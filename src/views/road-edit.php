<?php require_once(__DIR__ . '/' . '../includes/esbuild.php'); ?>
<div class="h-full w-full p-4">
  <div class="h-full w-full border-2 border-slate-500/50 shadow-md rounded-lg overflow-hidden">
    <div class="h-full w-full relative">
      <svg id="network"></svg>

      <div id="header" class="absolute top-4 left-4 rounded-md w-48 flex items-center p-2 backdrop-blur-sm shadow-sm" x-data="{ data: true }">
        <form id="properties" class="w-full flex flex-col gap-4 items-center"
          x-data="{oID: '', oNodeX: '', oNodeY: '', oNodeType: '', hasFrom: false, hasTo: false,
            idValue: '', xValue: '', yValue: '', typeValue: '', fromValue: '', toValue: ''}"
          onsubmit="event.preventDefault(); updateElementHandler();">

          <div class="flex items-center" x-show="oID !== ''">
            <span class="text-sm mr-2">ID</span>
            <input type="text" id="ID" class="w-24 py-1 px-2 text-sm rounded-md" x-model="idValue" />
          </div>

          <div class="flex items-center" x-show="oNodeX !== ''">
            <span class="text-sm mr-2">X</span>
            <input type="number" step="any" id="nodeX" class="w-24 py-1 px-2 text-sm rounded-md" x-model="xValue" />
          </div>

          <div class="flex items-center" x-show="oNodeY !== ''">
            <span class="text-sm mr-2">Y</span>
            <input type="number" step="any" id="nodeY" class="w-24 py-1 px-2 text-sm rounded-md" x-model="yValue" />
          </div>

          <div class="flex items-center" x-show="oNodeType !== ''">
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

          <div class="flex items-center" x-show="hasFrom">
            <span class="text-sm mr-2">From</span>
            <input type="text" id="edgeFrom" class="w-24 py-1 px-2 text-sm rounded-md" x-model="fromValue" disabled />
          </div>

          <div class="flex items-center" x-show="hasTo">
            <span class="text-sm mr-2">To</span>
            <input type="text" id="edgeTo" class="w-24 py-1 px-2 text-sm rounded-md" x-model="toValue" disabled />
          </div>

          <button id="updateElement" class="btn btn-sm btn-primary me-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            x-show="(idValue !== oID && idValue !== '') || (xValue * 1 !== oNodeX * 1 && xValue * 1 !== '') || (yValue * 1 !== oNodeY * 1 && yValue !== '') || typeValue !== oNodeType">Update</button>
          <button id="toggleTraffic" class="btn btn-sm btn-secondary px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">Traffic: Right-Hand</button>
        </form>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/d3/dist/d3.min.js"></script>
      <?php esbuild("road-editor", 'ts', true); ?>
    </div>
  </div>
</div>
