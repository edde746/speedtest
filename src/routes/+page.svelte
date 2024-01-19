<script lang="ts">
  import {
    Download,
    Timer,
    Upload,
    Server,
    X,
    Trash2,
  } from "@steeze-ui/lucide-icons";
  import Stat from "./Stat.svelte";
  import {
    VisAxis,
    VisCrosshair,
    VisLine,
    VisScatter,
    VisTooltip,
    VisXYContainer,
  } from "@unovis/svelte";
  import { Icon } from "@steeze-ui/svelte-icon";
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

  let selectedServer = $state<
    (typeof data.speedtests)[0]["server"] | undefined
  >(undefined);
</script>

<svelte:window
  onkeydown={(e) => e.key == "Escape" && (selectedServer = undefined)}
/>

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

  <dialog class="modal" open={!!selectedServer}>
    <div class="modal-box space-y-2">
      {#if selectedServer}
        <h3 class="font-bold text-lg flex gap-2 items-center">
          <Icon src={Server} class="w-6 h-6" />
          <span>{selectedServer.name}</span>
        </h3>
        <div class="grid grid-cols-2 gap-2 details">
          <p>Country</p>
          <p class="font-semibold">{selectedServer.country}</p>
          <p>Location</p>
          <p class="font-semibold">{selectedServer.location}</p>
          <p>IP</p>
          <p class="font-semibold">{selectedServer.ip}</p>
        </div>
      {/if}
    </div>
    <button class="modal-backdrop" onclick={() => (selectedServer = undefined)}>
    </button>
  </dialog>

  {#if data.speedtests.length}
    <div class="col-span-6 rounded-box bg-base-200 overflow-y-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Ping</th>
            <th>Download</th>
            <th>Upload</th>
            <th>Server</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each speedtests as speedtest}
            <tr>
              <td>
                {speedtest.time.toLocaleString(undefined, {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </td>
              {#if speedtest.ping}
                <td>{speedtest.ping?.toFixed(2)} ms</td>
                <td>{speedtest.download?.toFixed(2)} mbps</td>
                <td>{speedtest.upload?.toFixed(2)} mpbs</td>
                <td>
                  <button
                    class="btn btn-primary btn-sm"
                    onclick={() => {
                      selectedServer = speedtest.server;
                    }}
                  >
                    <Icon src={Server} class="w-4 h-4" />
                    <span>{speedtest.server?.name}</span>
                  </button>
                </td>
              {:else}
                {#each Array(4) as _}
                  <td><Icon src={X} class="w-4 h-4 text-error" /></td>
                {/each}
              {/if}
              <td class="flex justify-end items-center">
                <form
                  action="?/delete"
                  method="POST"
                  use:enhance={() =>
                    ({ result }) => {
                      if (result.type == "success") {
                        toasts.add({
                          text: "Speedtest deleted",
                          type: "success",
                        });
                        speedtests = speedtests.filter(
                          (d) => d.id != speedtest.id
                        );
                      }
                    }}
                >
                  <button
                    class="btn btn-error btn-sm"
                    name="id"
                    value={speedtest.id}
                  >
                    <Icon src={Trash2} class="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </form>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <div class="flex col-span-full gap-2 ml-2">
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
