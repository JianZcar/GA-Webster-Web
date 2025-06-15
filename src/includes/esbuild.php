<?php
function esbuild(string $name, string $loader, bool $minify): void
{
  $path = __DIR__ .  '/' . '../' . $loader . '/' . $name . '.' . $loader;
  if (!file_exists($path)) {
    throw new Exception("File not found: $name");
  }

  $code = file_get_contents($path);
?>
  <script>
    function callRunWhenReady() {
      window.run(
        <?php echo json_encode($name); ?>,
        <?php echo json_encode($code); ?>,
        <?php echo json_encode($loader); ?>,
        <?php echo json_encode($minify); ?>
      );
    }

    if (window.esbuildReady) {
      callRunWhenReady();
    } else {
      document.addEventListener("esbuild:ready", callRunWhenReady);
    }
  </script>
<?php
}
?>
