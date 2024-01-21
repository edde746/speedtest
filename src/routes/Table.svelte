<script lang="ts">
  import { Server, X, Trash2 } from "@steeze-ui/lucide-icons";
  import { Icon } from "@steeze-ui/svelte-icon";
  import { enhance } from "$app/forms";
  import { toasts } from "$lib/toasts.svelte";
  import { invalidateAll } from "$app/navigation";
  import type { PageServerData } from "./$types";
  const { speedtests } = $props<{
    speedtests: PageServerData["speedtests"];
  }>();

  let selectedServer = $state<
    (typeof data.speedtests)[0]["server"] | undefined
  >(undefined);
</script>

<svelte:window
  onkeydown={(e) => e.key == "Escape" && (selectedServer = undefined)}
/>

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

<div class="col-span-6 rounded-box bg-base-200 overflow-y-auto max-h-96">
  <table class="table">
    <thead class="sticky top-0 bg-base-200">
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
                class="btn btn-primary btn-sm flex-nowrap no-animation"
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
          <td>
            <form
              class="flex justify-end items-center"
              action="?/delete"
              method="POST"
              use:enhance={() =>
                ({ result }) => {
                  if (result.type == "success") {
                    toasts.add({
                      text: "Speedtest deleted",
                      type: "success",
                    });
                    invalidateAll();
                  }
                }}
            >
              <button
                class="btn btn-error btn-sm flex-nowrap no-animation"
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

<style lang="postcss">
  .details > :nth-child(even) {
    @apply ml-auto;
  }
</style>
