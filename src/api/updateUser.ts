import { User } from "../database/db";
import { resOk, resErrors, validateUpdateUser, typeUUIDFromURL } from "./utils";
import { Env } from "env";

export default async function updateUser(
  uuid: typeUUIDFromURL,
  body: string,
  env: Env,
) {
  if (!uuid.thereIsParams || !uuid.thereIsUUD) return resErrors.UIdI();

  if (!body) return resErrors.NCRF([]);
  let user: User;
  try {
    user = JSON.parse(body);
  } catch {
    return resErrors.EJSON();
  }

  const { username, age, hobbies } = user;
  const validateErrors = validateUpdateUser(username, age, hobbies);
  if (validateErrors.length) return resErrors.NCRF(validateErrors);

  const newUser = env.DB.updateUser(uuid.uuid, { username, age, hobbies });

  if (!newUser.id) return resErrors.UNF();

  return resOk.Ok(newUser);
}
