<script lang="ts">
  import {
    TrendingDown,
    TrendingUp,
    MoveRight,
    type IconSource,
  } from "@steeze-ui/lucide-icons";
  import { Icon } from "@steeze-ui/svelte-icon";

  const { title, value, icon, trend, color } = $props<{
    title: string;
    value: string;
    icon: IconSource;
    trend: number;
    color: string;
  }>();

  const getTrend = (trend: number) => {
    if (trend > 5) return { class: "text-success", icon: TrendingUp };
    if (trend < -5) return { class: "text-error", icon: TrendingDown };
    return { class: "text-primary", icon: MoveRight };
  };

  const trendStyle = $derived(getTrend(trend));
</script>

<div
  class="rounded-box bg-base-200 p-4 col-span-2 flex justify-between items-center"
>
  <div>
    <span class="opacity-80">{title}</span>
    <h3 class="text-xl">{value}</h3>
    <div class="flex items-center gap-2 {trendStyle.class}">
      <Icon src={trendStyle.icon} class="w-5 h-5" />
      <span class="text-xs">{trend}%</span>
    </div>
  </div>
  <Icon src={icon} class="w-10 h-10" style="color:{color}" />
</div>
