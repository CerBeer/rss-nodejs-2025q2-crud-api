import { User, NewUser } from "../database/db";
import { resOk, resErrors, validateUser } from "./utils";
import { env } from "../env";

export default async function addUser(body: string) {
  if (!body) return resErrors.NCRF([]);
  let user: User;
  try {
    user = JSON.parse(body);
  } catch {
    return resErrors.EJSON();
  }

  const { username, age, hobbies } = user;
  const validateErrors = validateUser(username, age, hobbies);
  if (validateErrors.length > 0) return resErrors.NCRF(validateErrors);

  const newUser = await addNewUser({ username, age, hobbies });

  if (!newUser.id) return resErrors.ISE();

  return resOk.create(newUser);
}

const addNewUser = async (newUser: NewUser): Promise<User> => {
  const command = "addUser";
  const params = { body: newUser };
  const body = JSON.stringify(params);
  const hostname = `http://localhost:${env.PORTDB}/db/${command}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body,
  };

  const response = await fetch(hostname, options);
  const user = await response.json();
  return user as User;
};
