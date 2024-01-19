import db from "$lib/database";
import type { Prisma } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";
import { format, run } from "$lib/speedtest";

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

  return { speedtests: speedtests.map(format) };
};

export const actions: Actions = {
  delete: async ({ request }) => {
    const body = await request.formData();
    await db.speedtest.delete({
      where: {
        id: Number(body.get("id")!),
      },
    });
  },
  run: async () => {
    run();
  },
};
