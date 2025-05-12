import http from "http";
import { routeRequest } from "./router";
import { env } from "./env";
import { balancer } from "./balancer";
import { routeRequestDB } from "./database/serverdb";

const server = http.createServer(routeRequest);
export const serverDB = http.createServer(routeRequestDB);

server.on("error", (err) => {
  console.log("error: " + err);
});

if (env.MULTI) {
  balancer(server, serverDB);
} else {
  server.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });
  serverDB.listen(env.PORTDB, () => {
    console.log(`Server DB listening on port ${env.PORTDB}`);
  });
}

export default server;
