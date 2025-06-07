<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SUMO Road Layout Editor</title>

  <?php include_once(__DIR__ . '/' . 'imports.php'); ?>
</head>

<body>
  <svg id="network" class="absolute top-0 left-0"></svg>

  <div id="header" class="fixed top-4 left-4 rounded-md w-48 flex items-center p-2 backdrop-blur-sm shadow-sm">
    <div class="w-full flex flex-col gap-4 items-center">
      <div class="flex items-center">
        <span class="text-sm mr-2">X</span>
        <input type="number" id="nodeX" class="w-24 py-1 px-2 text-sm rounded-md" />
      </div>

      <div class="flex items-center">
        <span class="text-sm mr-2">Y</span>
        <input type="number" id="nodeY" class="w-24 py-1 px-2 text-sm rounded-md" />
      </div>

      <button id="updateNode" class="btn btn-sm btn-primary me-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">Update</button>
      <button id="toggleTraffic" class="btn btn-sm btn-secondary px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">Traffic: Right-Hand</button>
    </div>
  </div>

</body>
<script src="/js/road-editor.js"></script>

</html>
