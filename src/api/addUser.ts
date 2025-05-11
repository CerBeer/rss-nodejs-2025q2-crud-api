import { User } from "../database/db";
import { resOk, resErrors, validateUser } from "./utils";
import { Env } from "env";

export default async function addUser(body: string, env: Env) {
  if (!body) return resErrors.NCRF([]);
  let user: User;
  try {
    user = JSON.parse(body);
  } catch {
    return resErrors.EJSON();
  }

  const { username, age, hobbies } = user;
  const validate = validateUser(username, age, hobbies);
  if (validate.length > 0) return resErrors.NCRF(validate);

  const newUser = env.DB.addUser({ username, age, hobbies });

  if (!newUser.id) return resErrors.ISE();

  return resOk.create(newUser);
}
