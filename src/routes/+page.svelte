<script lang="ts">
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

  const colors = ["#4D8CFD", "#FF6B7D", "#FFC06D"];

  let data = Array.from({ length: 24 }, (_, i) => ({
    time: Date.now() + i * 60 * 60 * 1000,
    download: Math.floor(Math.random() * 10000) / 10,
    upload: Math.floor(Math.random() * 5000) / 10,
    ping: Math.floor(Math.random() * 1000) / 10,
    shape: Math.random() > 0.5 ? "circle" : "square",
  }));
  type Entry = (typeof data)[0];
  const x = (d: Entry) => d.time;
</script>

<div class="p-4 grid grid-cols-6 gap-4">
  <Stat
    title="Ping"
    value="13 ms"
    icon={Timer}
    trend={-5.3}
    color={colors[0]}
  />
  <Stat
    title="Download"
    value="502.2 mbps"
    icon={Download}
    trend={3.2}
    color={colors[1]}
  />
  <Stat
    title="Upload"
    value="47.1 mbps"
    icon={Upload}
    trend={7.5}
    color={colors[2]}
  />

  <div class="col-span-6 rounded-box bg-base-200 w-full">
    <VisXYContainer {data} padding={{ top: 12 }}>
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
          `<b>Download:</b> ${d.download} mbps<br/><b>Upload:</b> ${d.upload} mbps<br/><b>Ping:</b> ${d.ping} ms`}
      />
      <VisTooltip />

      <VisLine lineWidth={3} {x} y={(d) => d.download} color={colors[0]} />
      <VisLine lineWidth={3} {x} y={(d) => d.upload} color={colors[1]} />
      <VisScatter {x} y={(d) => d.ping} shape="triangle" color={colors[2]} />
    </VisXYContainer>
  </div>
</div>
