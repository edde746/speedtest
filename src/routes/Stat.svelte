<script lang="ts">
  import {
    TrendingDown,
    TrendingUp,
    MoveRight,
    type IconSource,
    X,
  } from "@steeze-ui/lucide-icons";
  import { Icon } from "@steeze-ui/svelte-icon";

  const { title, value, suffix, icon, trend, color } = $props<{
    title: string;
    value: string | number | null;
    suffix: string;
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
    {#if value}
      <h3 class="text-xl">{value} {suffix}</h3>
      <div class="flex items-center gap-2 {trendStyle.class}">
        <Icon src={trendStyle.icon} class="w-5 h-5" />
        <span class="text-xs">{trend.toFixed(1)}%</span>
      </div>
    {:else}
      <h3 class="text-xl">- {suffix}</h3>
      <div class="flex items-center gap-2 text-error">
        <Icon src={X} class="w-5 h-5" />
        <span class="text-xs">Failed</span>
      </div>
    {/if}
  </div>
  <Icon src={icon} class="w-10 h-10" style="color:{color}" />
</div>
