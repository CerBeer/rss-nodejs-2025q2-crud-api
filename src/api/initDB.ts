import { User } from "../database/db";
import { resOk, resErrors } from "./utils";
import { env } from "../env";

export default async function initDB(body: string) {
  if (!body) return resErrors.MNA();

  let commands: { command: string };
  try {
    commands = JSON.parse(body);
  } catch {
    return resErrors.MNA();
  }
  const { command } = commands;
  if (command !== "Init DB") return resErrors.MNA();

  const result = await flushDB();
  console.log(result);
  if (Array.isArray(result) && result.length === 0) return resOk.Ok("");

  return resErrors.MNA();
}

const flushDB = async (): Promise<User[]> => {
  const command = "initDB";
  const hostname = `http://localhost:${env.PORTDB}/db/${command}`;
  const response = await fetch(hostname, { method: "POST" });
  const users = await response.json();
  return users as User[];
};
