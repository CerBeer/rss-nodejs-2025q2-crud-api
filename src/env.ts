import dotenv from "dotenv";
dotenv.config();
import { Users } from "./database/db";

export const env = {
  PORT: process.env.PORT || 4000,
  ENDPOINT: process.env.ENDPOINT || "/api/users",
  DB: new Users(),
};

export type Env = typeof env;
