<script type="module">
  import * as esbuild from "https://cdn.jsdelivr.net/npm/esbuild-wasm/esm/browser.js";

  const esbuildReady = (async () => {
    const cacheName = "esbuild-wasm";
    const wasmURL = "https://cdn.jsdelivr.net/npm/esbuild-wasm/esbuild.wasm";
    try {
      const cache = await caches.open(cacheName);
      let response = await cache.match(wasmURL);

      if (!response) {
        console.log("Fetching esbuild.wasm from network");
        response = await fetch(wasmURL);
        await cache.put(wasmURL, response.clone());
        console.log("Cached esbuild.wasm locally.");
      } else {
        console.log("Using cached esbuild.wasm.");
      }
      const wasmArrayBuffer = await response.arrayBuffer();
      await esbuild.initialize({
        wasmModule: await WebAssembly.compile(wasmArrayBuffer),
      });

      console.log("esbuild initialized.");
    } catch (e) {
      console.log("Failed to load esbuild.wasm.");
      console.error(e);
    }
  })();

  window.run = async function(tsCode) {
    await esbuildReady;
    const result = await esbuild.transform(tsCode, {
      loader: "ts",
      minify: true,
    });
    new Function(result.code)();
  }
</script>

<?php
function ts_transpile(string $ts): void
{
  $path = __DIR__ .  '/' . '../ts/' . $ts . '.ts';
  if (!file_exists($path)) {
    throw new Exception("TypeScript file not found: $ts");
  }

  $tsCode = file_get_contents($path);
?>
  <script>
    window.addEventListener("load", () => {
      typeof window.run === "function" ? window.run(<?php echo json_encode($tsCode); ?>) : console.error("window.run is not defined when trying to run the TS code")
    });
  </script>
<?php
}
?>
