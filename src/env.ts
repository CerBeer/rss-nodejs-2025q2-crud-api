import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 4000,
  ENDPOINT: process.env.ENDPOINT || "/api/users",
};

export type Env = typeof env;
