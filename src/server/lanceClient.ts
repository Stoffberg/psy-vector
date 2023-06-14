import lancedb from "vectordb";
import { env } from "~/env.mjs";

export const getLanceClient = async () =>
  await lancedb.connect(env.LANCE_DB_URL);
