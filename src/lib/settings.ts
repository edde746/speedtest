import { parse, stringify } from "devalue";
import db from "./database";

export const set = (key: string, value: any) =>
  db.settings.upsert({
    where: {
      key,
    },
    update: {
      data: stringify(value),
    },
    create: {
      key,
      data: stringify(value),
    },
  });

export const get = async <T>(key: string): Promise<T | undefined> => {
  const setting = await db.settings.findUnique({
    where: {
      key,
    },
  });

  if (!setting) return undefined;

  return parse(setting.data) as T;
};
