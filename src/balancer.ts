import cluster, { Worker } from "node:cluster";
import {
  IncomingMessage,
  Server,
  ServerResponse,
  createServer,
  request,
} from "node:http";
import { availableParallelism, hostname } from "node:os";
import process from "node:process";
import { env } from "./env";
import { getBody, setRes } from "./api/utils";

export function balancer(server: Server, serverDB: Server) {
  const cpus = availableParallelism();

  if (cpus < 2) {
    console.error(
      "It is impossible to run parallel processes on this server configuration",
    );
    return;
  }

  type WorkerRecord = { port: number; worker: Worker };
  const workers: WorkerRecord[] = [];
  let currentWorker: number = 0;

  if (cluster.isPrimary) {
    for (let i = 1; i < cpus; i++) {
      const port = env.PORT + i;
      const worker = cluster
        .fork({ WORKER_PORT: port })
        .on("listening", (address) => {
          console.log(`Worker listening on port ${address.port}`);
        });
      workers.push({ port, worker });
    }

    const balancerProxy = createServer();
    balancerProxy.listen(env.PORT, () => {
      console.log(`Server listening on port ${env.PORT}`);
    });

    balancerProxy.on(
      "request",
      async (req: IncomingMessage, res: ServerResponse) => {
        const worker = workers[currentWorker];
        const options = {
          hostname: hostname(),
          port: worker?.port,
          path: req.url,
          method: req.method,
          headers: req.headers,
        };
        currentWorker += 1;
        if (currentWorker >= workers.length) currentWorker = 0;

        const workerRequest = request(options);
        const reqBody = await getBody(req);
        workerRequest.end(reqBody);

        workerRequest.on("response", async (workerRes) => {
          const responseBody = await getBody(workerRes);
          const responseCode = workerRes.statusCode || 200;
          const response = { code: responseCode, body: responseBody };

          setRes(res, response);
        });
      },
    );

    serverDB.listen(env.PORTDB, () => {
      console.log(`Server DB listening on port ${env.PORTDB}`);
    });
  } else {
    const PORT = Number(process.env.WORKER_PORT);
    server.listen(PORT);
  }
}
