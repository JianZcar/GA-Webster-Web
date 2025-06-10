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

  window.run = async function(code, loader, minify) {
    await esbuildReady;
    const result = await esbuild.transform(code, {
      loader: loader,
      minify: minify,
    });
    new Function(result.code)();
  }
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
      typeof window.run === "function" ? window.run(<?php echo json_encode($code); ?>, <?php echo json_encode($loader); ?>, <?php echo json_encode($minify); ?>) : console.error("window.run is not defined when trying to run the <?php echo $loader ?> code")
    });
  </script>
<?php
}
?>
