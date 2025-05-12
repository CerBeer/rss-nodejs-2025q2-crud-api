import { IncomingMessage, ServerResponse } from "http";
import {
  setRes,
  resErrors,
  getCommandFromURL,
  getBody,
  resOk,
} from "../api/utils";
import { env } from "../env";

export async function routeRequestDB(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const { method, url } = req;
  const endpoint = "/db/";
  if (method !== "POST") {
    setRes(res, resErrors.ENF());
    return;
  }
  if (!url || !url.startsWith(endpoint)) {
    setRes(res, resErrors.ENF());
    return;
  }
  const command = getCommandFromURL(url!);
  const params = await getBody(req)
    .then((data) => JSON.parse(data))
    .catch(() => {});

  switch (command) {
    case "getAllUsers":
      setRes(res, resOk.create(env.DBSRV.getAllUsers()));
      break;
    case "getUserById":
      setRes(res, resOk.create(env.DBSRV.getUserById(params.id)));
      break;
    case "addUser":
      setRes(res, resOk.create(env.DBSRV.addUser(params.body)));
      break;
    case "updateUser":
      setRes(res, resOk.create(env.DBSRV.updateUser(params.id, params.body)));
      break;
    case "deleteUser":
      setRes(res, resOk.create(env.DBSRV.deleteUser(params.id)));
      break;
    case "initDB":
      setRes(res, resOk.create(env.DBSRV.flushDB()));
      break;
    default:
      setRes(res, resErrors.MNA());
  }
}
