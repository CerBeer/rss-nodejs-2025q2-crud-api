import { typeUUIDFromURL, resOk, resErrors } from "./utils";
import { Env } from "env";

export default async function getUsers(uuid: typeUUIDFromURL, env: Env) {
  if (!uuid.thereIsParams) return resOk.Ok(env.DB.getAllUsers());

  if (!uuid.thereIsUUD) return resErrors.UIdI();

  const user = env.DB.getUserById(uuid.uuid);

  if (!user.id) return resErrors.UNF();

  return resOk.Ok(user);
}
