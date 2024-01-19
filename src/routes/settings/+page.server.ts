import { get, set } from "$lib/settings";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async () => {
  return {
    cron: await get<string>("cron"),
  };
};

export const actions: Actions = {
  save: async ({ request }) => {
    const body = await request.formData();
    const cron = body.get("cron");
    if (cron) await set("cron", cron);
  },
};
