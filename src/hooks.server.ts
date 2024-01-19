import { createJob } from "$lib/cron";

// Will start at startup when built, in dev mode will start when the first request is made
createJob();
