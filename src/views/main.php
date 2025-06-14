<!DOCTYPE html>
<html lang="en" class="h-full">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Main</title>
  <?php include_once(__DIR__ . '/' . '../includes/imports.php'); ?>
</head>

<body class="h-full m-0 p-0">
  <div x-data="{ current: 'roadedit' }" class="h-full flex flex-col">
    <!-- Tabs -->
    <div class="flex bg-gray-200 text-sm">
      <button
        class="px-4 py-2 hover:bg-gray-300"
        :class="{ 'font-bold border-b-2 border-black': current === 'roadedit' }"
        @click="current = 'roadedit'">
        Road Edit
      </button>
      <button
        class="px-4 py-2 hover:bg-gray-300"
        :class="{ 'font-bold border-b-2 border-black': current === 'settings' }"
        @click="current = 'settings'">
        Settings
      </button>
      <button
        class="px-4 py-2 hover:bg-gray-300"
        :class="{ 'font-bold border-b-2 border-black': current === 'help' }"
        @click="current = 'help'">
        Help
      </button>
    </div>
    <iframe
      :src="`/${current}`"
      class="h-full w-full border-none"
      style="border: none;"></iframe>
  </div>
</body>

</html>
