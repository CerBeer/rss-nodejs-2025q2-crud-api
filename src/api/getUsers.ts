import { User } from "../database/db";
import { typeUUIDFromURL, resOk, resErrors } from "./utils";
import { env } from "../env";

export default async function getUsers(uuid: typeUUIDFromURL) {
  if (!uuid.thereIsParams) {
    const users = await getAllUsers();
    return resOk.Ok(users);
  }

  if (!uuid.thereIsUUD) return resErrors.UIdI();

  const user = await getUserById(uuid.uuid);

  if (!user.id) return resErrors.UNF();

  return resOk.Ok(user);
}

const getAllUsers = async (): Promise<User[]> => {
  const command = "getAllUsers";
  const hostname = `http://localhost:${env.PORTDB}/db/${command}`;
  const response = await fetch(hostname, { method: "POST" });
  const users = await response.json();
  return users as User[];
};

const getUserById = async (id: string): Promise<User> => {
  const command = "getUserById";
  const params = { id };

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
