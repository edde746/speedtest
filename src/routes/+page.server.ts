import db from "$lib/database";
import type { Prisma } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const query: Prisma.SpeedtestFindManyArgs = {
    orderBy: {
      time: "desc",
    },
  };

  let speedtests = await db.speedtest.findMany({
    ...query,
    where: {
      time: {
        gt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    },
    include: {
      server: true,
    },
  });

  if (speedtests.length < 10) {
    speedtests = await db.speedtest.findMany({
      ...query,
      take: 10,
      include: {
        server: true,
      },
    });
  }

  const format = (entry: (typeof speedtests)[0]) =>
    entry.ping
      ? {
          ...entry,
          ping: Number((entry.ping / 100).toFixed(2)),
          download: Number(((entry.download! * 8) / 1000000).toFixed(2)),
          upload: Number(((entry.upload! * 8) / 1000000).toFixed(2)),
        }
      : entry;

  return { speedtests: speedtests.map(format) };
};

