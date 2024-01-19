<script>
  import "../app.pcss";

  $effect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    if (!prefersDark.matches) document.body.classList.remove("theme-dark");
  });
</script>

<slot />
