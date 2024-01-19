<script>
  import "../app.pcss";
  import { alertClass, toasts } from "$lib/toasts.svelte";

  $effect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    if (!prefersDark.matches) document.body.classList.remove("theme-dark");
  });
</script>

<div class="toast z-50">
  {#each toasts.toasts as toast}
    <div class="alert {alertClass(toast.type)}">
      <span>{toast.text}</span>
    </div>
  {/each}
</div>

<slot />
