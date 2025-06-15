<!DOCTYPE html>
<html lang="en" class="h-full">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GAxWebster</title>
  <?php require_once(__DIR__ . '/../includes/imports.php'); ?>
  <script src="https://cdn.jsdelivr.net/npm/d3/dist/d3.min.js"></script>
</head>

<body class="h-full m-0 p-0">
  <div x-data="{ current: 'roadedit' }" class="h-full flex flex-col">

    <!-- Tabs -->
    <div class="flex min-h-14 px-4 pt-4 gap-4 text-sm">
      <button
        class="px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-50"
        :class="{ 'font-bold border-b-2 border-black': current === 'roadedit' }"
        :disabled="current === 'roadedit'"
        @click="current = 'roadedit'"
        hx-get="/roadedit"
        hx-target="#content"
        hx-swap="innerHTML">
        Road Editor
      </button>
      <button
        class="px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-50"
        :class="{ 'font-bold border-b-2 border-black': current === 'about' }"
        :disabled="current === 'about'"
        @click="current = 'about'"
        hx-get="/about"
        hx-target="#content"
        hx-swap="innerHTML">
        About
      </button>
    </div>

    <!-- HTMX content container -->
    <div id="content"
      class="flex-1 w-full"
      hx-get="/roadedit"
      hx-trigger="load"
      hx-target="this"
      hx-swap="innerHTML">
    </div>

  </div>
</body>

</html>
