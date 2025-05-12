import { User, NewUser } from "../database/db";
import { resOk, resErrors, validateUpdateUser, typeUUIDFromURL } from "./utils";
import { env } from "../env";

export default async function updateUser(uuid: typeUUIDFromURL, body: string) {
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

  const newUser = await updateUserById(uuid.uuid, {
    username,
    age,
    hobbies,
  });

  if (!newUser.id) return resErrors.UNF();

  return resOk.Ok(newUser);
}

const updateUserById = async (id: string, newUser: NewUser): Promise<User> => {
  const command = "updateUser";
  const params = { id, body: newUser };

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
