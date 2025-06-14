<script type="module">
  import * as esbuild from "https://cdn.jsdelivr.net/npm/esbuild-wasm/esm/browser.js";
  const esbuildReady = (async () => {
    const cacheName = "esbuild-wasm";
    const wasmURL = "https://cdn.jsdelivr.net/npm/esbuild-wasm/esbuild.wasm";
    try {
      const cache = await caches.open(cacheName);
      let response = await cache.match(wasmURL);

      if (!response) {
        console.log("Fetching and caching esbuild.wasm...");
        const fetched = await fetch(wasmURL);
        await cache.put(wasmURL, fetched.clone());
        response = fetched;
      } else {
        console.log("Using cached esbuild.wasm.");
      }
      const wasmModule = await WebAssembly.compileStreaming(response);
      await esbuild.initialize({
        wasmModule
      });
      console.log("esbuild initialized.");
    } catch (err) {
      console.error("Failed to load esbuild.wasm.", err);
    }
  })();

  window.run = async (name, code, loader, minify) => {
    const cache = await caches.open("js-cache");
    const [oKey, tKey] = [`${name}-orig`, `${name}-transformed`];

    const [oResp, tResp] = await Promise.all([cache.match(oKey), cache.match(tKey)]);
    const [oCode, tCode] = await Promise.all([
      oResp?.text() ?? null,
      tResp?.text() ?? null,
    ]);

    if (oCode === code && tCode) return new Function(tCode)();
    await esbuildReady;
    const {
      code: tNew
    } = await esbuild.transform(code, {
      loader,
      minify
    });
    await Promise.all([
      cache.put(oKey, new Response(code)),
      cache.put(tKey, new Response(tNew)),
    ]);

    new Function(tNew)();
  };
</script>

<?php
function esbuild(string $name, string $loader, bool $minify): void
{
  $path = __DIR__ .  '/' . '../' . $loader . '/' . $name . '.' . $loader;
  if (!file_exists($path)) {
    throw new Exception("File not found: $name");
  }

  $code = file_get_contents($path);
?>
  <script defer>
    window.addEventListener("load", () => {
      typeof window.run === "function" ? window.run(<?php echo json_encode($name); ?>, <?php echo json_encode($code); ?>, <?php echo json_encode($loader); ?>, <?php echo json_encode($minify); ?>) : console.error("window.run is not defined when trying to run the <?php echo $loader ?> code")
    });
  </script>
<?php
}
?>
