<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>SUMO Road Layout Editor</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="css/style.css" rel="stylesheet">
</head>

<body>

  <div id="header" class="bg-light border-bottom d-flex align-items-center">
    <strong class="me-3">SUMO Editor</strong>
    <div class="input-group input-group-sm me-2" style="width: 100px;">
      <span class="input-group-text">X</span>
      <input type="number" id="nodeX" class="form-control" />
    </div>

    <div class="input-group input-group-sm me-2" style="width: 100px;">
      <span class="input-group-text">Y</span>
      <input type="number" id="nodeY" class="form-control" />
    </div>

    <button id="updateNode" class="btn btn-sm btn-primary me-2">Update</button>
    <button id="toggleTraffic" class="btn btn-sm btn-secondary">Traffic: Right-Hand</button>
  </div>

  <svg id="network" width="100%" height="100%"></svg>
</body>
<script src="js/road-editor.js"></script>
</html>
