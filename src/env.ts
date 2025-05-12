import dotenv from "dotenv";
dotenv.config();
import { Users } from "./database/db";
import { availableParallelism } from "os";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const portdb = port + availableParallelism();

export const env = {
  PORT: port,
  ENDPOINT: process.env.ENDPOINT || "/api/users",
  MULTI: process.argv.includes("--multi"),
  DBSRV: new Users(),
  PORTDB: portdb,
};

export type Env = typeof env;
