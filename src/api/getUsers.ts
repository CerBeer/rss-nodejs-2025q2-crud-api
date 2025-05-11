import { typeUUIDFromURL, resOk, resErrors } from "./utils";

export default async function getUsers(uuid: typeUUIDFromURL) {
  if (!uuid.thereIsParams)
    return resOk.Ok([
      {
        username: "TestUser",
        age: 25,
        hobbies: ["Test", "hobbies"],
      },
    ]);
  if (!uuid.thereIsUUD) return resErrors.UIdI();

  const user = {
    username: "TestUser",
    age: 25,
    hobbies: ["Test", "hobbies"],
  };

  if (user) return resOk.Ok(user);

  return resErrors.ENF();
}
