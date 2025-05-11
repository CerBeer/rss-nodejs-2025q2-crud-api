import { resOk, resErrors } from "./utils";
import { Env } from "env";

export default async function initDB(body: string, env: Env) {
  if (!body) return resErrors.MNA();
  let commands: { command: string };
  try {
    commands = JSON.parse(body);
  } catch {
    return resErrors.MNA();
  }

  const { command } = commands;
  if (command !== "Init DB") return resErrors.MNA();

  const result = env.DB.flushDB();
  if (Array.isArray(result) && result.length === 0) return resOk.Ok("");

  return resErrors.MNA();
}
