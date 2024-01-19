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
