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
  const { data } = $props();

  const colors = ["#4D8CFD", "#FF6B7D", "#FFC06D"];

  const previous = $derived(data.speedtests.find((d, i) => i > 0 && d.ping));
  const getTrend = (field: "upload" | "download" | "ping") => {
    if (!previous) return 0;
    const current = data.speedtests[0][field];
    if (!current) return 0;
    return ((current - previous[field]!) / previous[field]!) * 100;
  };

  const successful = $derived(data.speedtests.filter((d) => d.ping));

  type Entry = (typeof data.speedtests)[0];
  const x = (d: Entry) => d.time.getTime();
</script>

<div class="p-4 grid grid-cols-6 gap-4">
  <Stat
    title="Ping"
    value={data.speedtests[0].ping}
    suffix="ms"
    icon={Timer}
    trend={getTrend("ping")}
    color={colors[0]}
  />
  <Stat
    title="Download"
    value={data.speedtests[0].download}
    suffix="mbps"
    icon={Download}
    trend={getTrend("download")}
    color={colors[1]}
  />
  <Stat
    title="Upload"
    value={data.speedtests[0].upload}
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
        {#each data.speedtests as speedtest}
          <tr>
            <td
              >{speedtest.time.toLocaleString(undefined, {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}</td
            >
            {#if speedtest.ping}
              <td>{speedtest.ping?.toFixed(2)} ms</td>
              <td>{speedtest.download?.toFixed(2)} mbps</td>
              <td>{speedtest.upload?.toFixed(2)} mpbs</td>
              <td>
                <button class="btn btn-primary btn-sm">
                  <Icon src={Server} class="w-4 h-4" />
                  <span>{speedtest.server?.name}</span>
                </button>
              </td>
            {:else}
              <td><Icon src={X} class="w-4 h-4 text-error" /></td>
              <td><Icon src={X} class="w-4 h-4 text-error" /></td>
              <td><Icon src={X} class="w-4 h-4 text-error" /></td>
              <td><Icon src={X} class="w-4 h-4 text-error" /></td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="flex col-span-full gap-2 ml-2">
    <a class="link" href="/settings">Settings</a>
    <a class="link" href="https://github.com/edde746/speedtest" target="_blank">
      GitHub
    </a>
  </div>
</div>
