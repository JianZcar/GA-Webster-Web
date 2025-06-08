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
    <div class="w-full flex flex-col gap-4 items-center" x-data="{ idValue: '', xValue: '', yValue: '', typeValue: '', fromValue: '', toValue: '' }">

      <div class="flex items-center" x-show="idValue !== ''">
        <span class="text-sm mr-2">ID</span>
        <input type="text" id="ID" class="w-24 py-1 px-2 text-sm rounded-md" x-model="idValue" />
      </div>

      <div class="flex items-center" x-show="xValue !== ''">
        <span class="text-sm mr-2">X</span>
        <input type="number" id="nodeX" class="w-24 py-1 px-2 text-sm rounded-md" x-model="xValue" />
      </div>

      <div class="flex items-center" x-show="yValue !== ''">
        <span class="text-sm mr-2">Y</span>
        <input type="number" id="nodeY" class="w-24 py-1 px-2 text-sm rounded-md" x-model="yValue" />
      </div>

      <div class="flex items-center" x-show="typeValue !== ''">
        <span class="text-sm mr-2">Type</span>
        <select id="nodeType" class="form-select text-center" x-model="typeValue">
          <option value="" disabled selected hidden></option>
          <option value="priority">priority</option>
          <option value="traffic_light">traffic_light</option>
          <option value="unregulated">unregulated</option>
          <option value="priority_stop">priority_stop</option>
          <option value="allway_stop">allway_stop</option>
          <option value="dead_end">dead_end</option>
        </select>
      </div>

      <div class="flex items-center" x-show="fromValue !== ''">
        <span class="text-sm mr-2">From</span>
        <input type="text" id="edgeFrom" class="w-24 py-1 px-2 text-sm rounded-md" x-model="fromValue" disabled />
      </div>

      <div class="flex items-center" x-show="toValue !== ''">
        <span class="text-sm mr-2">To</span>
        <input type="text" id="edgeTo" class="w-24 py-1 px-2 text-sm rounded-md" x-model="toValue" disabled />
      </div>

      <button id="updateElement" class="btn btn-sm btn-primary me-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        x-show="idValue !== '' || xValue !== '' || yValue !== '' || typeValue !== ''">Update</button>
      <button id="toggleTraffic" class="btn btn-sm btn-secondary px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">Traffic: Right-Hand</button>
    </div>
  </div>

</body>
<script src="/js/road-editor.js"></script>

</html>
