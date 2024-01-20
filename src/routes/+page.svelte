<script lang="ts">
  import Table from "./Table.svelte";

  import { Download, Timer, Upload } from "@steeze-ui/lucide-icons";
  import Stat from "./Stat.svelte";
  import {
    VisAxis,
    VisCrosshair,
    VisLine,
    VisScatter,
    VisTooltip,
    VisXYContainer,
  } from "@unovis/svelte";
  import { enhance } from "$app/forms";
  import { toasts } from "$lib/toasts.svelte";
  import { invalidateAll } from "$app/navigation";
  const { data } = $props();

  $effect(() => {
    const interval = setInterval(invalidateAll, 10 * 1000);
    return () => clearInterval(interval);
  });

  let speedtests = $state(data.speedtests);
  $effect(() => {
    speedtests = data.speedtests;
  });

  const colors = ["#4D8CFD", "#FF6B7D", "#FFC06D"];

  const previous = $derived(speedtests.find((d, i) => i > 0 && d.ping));
  const getTrend = (field: "upload" | "download" | "ping") => {
    if (!previous) return 0;
    const current = speedtests[0][field];
    if (!current) return 0;
    return ((current - previous[field]!) / previous[field]!) * 100;
  };

  const successful = $derived(speedtests.filter((d) => d.ping));

  type Entry = (typeof speedtests)[0];
  const x = (d: Entry) => d.time.getTime();
</script>

<div class="p-4 grid grid-cols-6 gap-4">
  <Stat
    title="Ping"
    value={speedtests[0]?.ping}
    suffix="ms"
    icon={Timer}
    trend={getTrend("ping")}
    color={colors[0]}
  />
  <Stat
    title="Download"
    value={speedtests[0]?.download}
    suffix="mbps"
    icon={Download}
    trend={getTrend("download")}
    color={colors[1]}
  />
  <Stat
    title="Upload"
    value={speedtests[0]?.upload}
    suffix="mbps"
    icon={Upload}
    trend={getTrend("upload")}
    color={colors[2]}
  />

  <div class="col-span-6 rounded-box bg-base-200 w-full">
    <VisXYContainer data={successful.reverse()} padding={{ top: 12 }}>
      <VisAxis
        type="x"
        tickFormat={(d) =>
          new Date(d).toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "numeric",
          })}
      />

      <VisCrosshair
        color={(_, i) => colors[i]}
        template={(d) =>
          `<b>${d.time.toLocaleString()}</b><br/><b>Download:</b> ${
            d.download
          } mbps<br/><b>Upload:</b> ${d.upload} mbps<br/><b>Ping:</b> ${
            d.ping
          } ms`}
      />
      <VisTooltip />

      <VisLine lineWidth={3} {x} y={(d) => d.download} color={colors[0]} />
      <VisLine lineWidth={3} {x} y={(d) => d.upload} color={colors[1]} />
      <VisScatter {x} y={(d) => d.ping} shape="triangle" color={colors[2]} />
    </VisXYContainer>
  </div>

  {#key data.speedtests[0]}
    {#if data.speedtests.length}
      <Table speedtests={data.speedtests}></Table>
    {/if}
  {/key}

  <div class="flex col-span-full gap-2 ml-2">
    <form
      action="?/run"
      method="post"
      use:enhance={() =>
        ({ result }) => {
          if (result.type == "success") {
            toasts.add({ text: "Speedtest started", type: "success" });
          }
        }}
    >
      <button class="link">Run Test</button>
    </form>
    <a class="link" href="/settings">Settings</a>
    <a class="link" href="https://github.com/edde746/speedtest" target="_blank">
      GitHub
    </a>
  </div>
</div>

<style lang="postcss">
  .details > :nth-child(even) {
    @apply ml-auto;
  }
</style>
