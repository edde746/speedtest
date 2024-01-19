<script lang="ts">
  import { Download, Timer, Upload } from "@steeze-ui/lucide-icons";
  import Stat from "./Stat.svelte";
</script>

<div class="p-4 grid grid-cols-6 gap-4">
  <Stat title="Ping" value="13 ms" icon={Timer} trend={-5.3} />
  <Stat title="Download" value="502.2 mbps" icon={Download} trend={3.2} />
  <Stat title="Upload" value="47.1 mbps" icon={Upload} trend={7.5} />
</div>
