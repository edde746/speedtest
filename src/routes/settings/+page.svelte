<script>
  import { enhance } from "$app/forms";
  import { toasts } from "$lib/toasts.svelte";
</script>

<form
  class="m-4 p-4 bg-base-200 rounded-box"
  method="post"
  action="?/save"
  use:enhance={() =>
    ({ result }) => {
      if (result.type == "success") {
        toasts.add({ text: "Settings saved", type: "success" });
      }
    }}
>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-xl font-semibold">Settings</h1>
    <button class="btn btn-primary btn-sm">Save</button>
  </div>
  <div class="grid grid-cols-2 items-center settings">
    <p>Schedule</p>
    <input
      type="text"
      name="cron"
      placeholder="0 * * * *"
      class="input input-bordered input-sm w-full max-w-xs"
    />
  </div>
</form>

<style lang="postcss">
  .settings > :nth-child(even) {
    @apply ml-auto;
  }
</style>
