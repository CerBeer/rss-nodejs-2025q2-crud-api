import http, { IncomingMessage, ServerResponse } from "http";
import { routeRequest } from "./router";
import { env } from "./env";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    routeRequest(req, res);
  },
);

server.on("request", (req) => {
  console.log(`${req.method}:${req.url}`);
});

server.on("error", (err) => {
  console.log("error: " + err);
});

server.on("listening", () => {
  console.log("ok, server is running");
});

server.on("connection", (item) => {
  console.log(`connection: ${item}`);
});

server.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});

export default server;
