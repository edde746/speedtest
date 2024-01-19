import type { Prisma } from "@prisma/client";
import db from "./database";

export const run = async () => {
  const proc = Bun.spawn([
    "speedtest",
    "--accept-license",
    "--accept-gdpr",
    "-f",
    "json",
  ]);

  const result = (await new Response(proc.stdout).json()) as SpeedTestResult;

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
