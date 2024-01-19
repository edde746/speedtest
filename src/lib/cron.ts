import { CronJob } from "cron";
import { get } from "./settings";
import { run } from "./speedtest";

export let job: CronJob | undefined;

export const createJob = async () => {
  if (job) job.stop();

  const schedule = await get<string>("cron");
  job = new CronJob(
    "0 " + (schedule?.length ? schedule : "0 * * * *"),
    run,
    null,
    true
  );
};
