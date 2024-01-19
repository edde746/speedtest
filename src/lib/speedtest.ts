import type { Prisma } from "@prisma/client";
import { spawn } from "child_process";
import db from "./database";

const spawnAsync = (command: string, args: string[]): Promise<string> =>
  new Promise((resolve, reject) => {
    const proc = spawn(command, args);

    let output = "";
    proc.stdout.on("data", (data) => {
      output += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });

export const run = async () => {
  const result = JSON.parse(
    await spawnAsync("speedtest", [
      "--accept-license",
      "--accept-gdpr",
      "-f",
      "json",
    ])
  ) as SpeedTestResult;

  await db.speedtest.create({
    data: {
      ping: Math.round(result.ping.latency * 100),
      download: result.download.bandwidth,
      upload: result.upload.bandwidth,
      server: {
        connectOrCreate: {
          where: {
            id: result.server.id,
          },
          create: {
            id: result.server.id,
            country: result.server.country,
            location: result.server.location,
            name: result.server.name,
            ip: result.server.ip,
          },
        },
      },
    },
  });
};

export const format = (
  entry: Prisma.PromiseReturnType<typeof db.speedtest.findMany>[0]
) =>
  entry.ping
    ? {
        ...entry,
        ping: Number((entry.ping / 100).toFixed(2)),
        download: Number(((entry.download! * 8) / 1000000).toFixed(2)),
        upload: Number(((entry.upload! * 8) / 1000000).toFixed(2)),
      }
    : entry;
