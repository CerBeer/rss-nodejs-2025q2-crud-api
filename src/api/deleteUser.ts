import { resOk, resErrors, typeUUIDFromURL } from "./utils";
import { Env } from "env";

export default async function deleteUser(uuid: typeUUIDFromURL, env: Env) {
  if (!uuid.thereIsParams || !uuid.thereIsUUD) return resErrors.UIdI();

  const user = env.DB.getUserById(uuid.uuid);

  if (!user.id) return resErrors.UNF();

  const deletedUser = env.DB.deleteUser(uuid.uuid);

  if (!deletedUser.id) return resErrors.ISE();

  return resOk.delete();
}
