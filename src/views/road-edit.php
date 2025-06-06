<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>SUMO Road Layout Editor</title>

  <link href="css/style.css" rel="stylesheet">

  <script src="https://code.jquery.com/jquery-3.7.1.slim.min.js" integrity="sha256-kmHvs0B+OpCW5GVHUNjv9rOmY0IvSIRcf7zGUDTDQM8=" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/htmx.org@2.0.4"></script>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>

<body>

  <div id="header" class="bg-gray-100 border-b flex items-center p-2">
    <div class="flex items-center space-x-2">
      <div class="flex items-center">
        <span class="text-sm mr-2">X</span>
        <input type="number" id="nodeX" class="w-24 py-1 px-2 text-sm border rounded-md" />
      </div>

      <div class="flex items-center">
        <span class="text-sm mr-2">Y</span>
        <input type="number" id="nodeY" class="w-24 py-1 px-2 text-sm border rounded-md" />
      </div>

      <button id="updateNode" class="btn btn-sm btn-primary me-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">Update</button>
      <button id="toggleTraffic" class="btn btn-sm btn-secondary px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">Traffic: Right-Hand</button>
    </div>
  </div>

  <svg id="network" width="100%" height="100%"></svg>
</body>
<script src="js/road-editor.js"></script>

</html>
