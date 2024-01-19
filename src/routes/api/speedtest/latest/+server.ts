import db from "$lib/database";
import { json, type RequestHandler } from "@sveltejs/kit";
import { format } from "$lib/speedtest";

// This is for gethomepage.dev support
export const GET: RequestHandler = async () => {
  const speedtest = await db.speedtest.findFirst({
    orderBy: {
      time: "desc",
    },
  });

  if (!speedtest) return json({ data: null });

  return json({
    data: format(speedtest),
  });
};
