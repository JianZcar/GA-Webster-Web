<!doctype html>
<html lang="en" class="h-full">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>main</title>
  <?php include_once(__DIR__ . '/../includes/imports.php'); ?>
</head>

<body class="h-full m-0 p-0">
  <div x-data="{current: 'roadedit', syncTab() {const p = $refs.iframe?.contentWindow?.location?.pathname?.split('/')?.[1] || 'roadedit';if (p !== this.current) this.current = p;}}"
    class="h-full flex flex-col">

    <!-- Tabs -->
    <div class="flex bg-gray-200 text-sm">
      <button class="px-4 py-2 hover:bg-gray-300"
        :class="{ 'font-bold border-b-2 border-black': current === 'roadedit' }"
        @click="current = 'roadedit'">
        road edit
      </button>
      <button class="px-4 py-2 hover:bg-gray-300"
        :class="{ 'font-bold border-b-2 border-black': current === 'settings' }"
        @click="current = 'settings'">
        settings
      </button>
      <button class="px-4 py-2 hover:bg-gray-300"
        :class="{ 'font-bold border-b-2 border-black': current === 'help' }"
        @click="current = 'help'">
        help
      </button>
    </div>

    <!-- Iframe -->
    <iframe
      x-ref="iframe"
      :src="`/${current}`"
      class="h-full w-full border-none"
      style="border: none;"
      @load="syncTab()">
    </iframe>
  </div>
</body>

</html>
