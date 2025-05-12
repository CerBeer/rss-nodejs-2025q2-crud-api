import { User } from "../database/db";
import { resOk, resErrors, typeUUIDFromURL } from "./utils";
import { env } from "../env";

export default async function deleteUser(uuid: typeUUIDFromURL) {
  if (!uuid.thereIsParams || !uuid.thereIsUUD) return resErrors.UIdI();

  const deletedUser = await deleteUserById(uuid.uuid);

  if (!deletedUser.id) return resErrors.UNF();

  return resOk.delete();
}

const deleteUserById = async (id: string): Promise<User> => {
  const command = "deleteUser";
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
