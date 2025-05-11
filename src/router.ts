import { IncomingMessage, ServerResponse } from "http";
import { env } from "./env";
import { setRes, resErrors, getUUIDFromURL } from "./api/utils";
import getUsers from "./api/getUsers";

export async function routeRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const { method, url } = req;
  if (!url || !url.startsWith(env.ENDPOINT)) setRes(res, resErrors.ENF());
  const uuid = getUUIDFromURL(url!);

  switch (method) {
    case "GET":
      setRes(res, await getUsers(uuid));
      break;
    case "POST":
      setRes(res, await getUsers(uuid));
      break;
    case "PUT":
      setRes(res, await getUsers(uuid));
      break;
    case "DELETE":
      setRes(res, await getUsers(uuid));
      break;
    default:
      setRes(res, resErrors.ENF());
  }
}
