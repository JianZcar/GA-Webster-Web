<?php require_once(__DIR__ . '/' . '../includes/esbuild.php'); ?>
<div class="w-full h-full p-4">
  <div class="w-full h-full relative border-2 border-slate-500/50 shadow-md rounded-lg overflow-hidden">
    <div class="skeleton absolute inset-0"></div>
    <svg id="network" class="absolute inset-0 w-full h-full bg-base-100"></svg>

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

        <button id="updateElement" class="btn btn-soft btn-primary"
          x-show="(idValue !== oID && idValue !== '') || (xValue * 1 !== oNodeX * 1 && xValue * 1 !== '') || (yValue * 1 !== oNodeY * 1 && yValue !== '') || typeValue !== oNodeType">Update</button>
        <button id="toggleTraffic" class="btn btn-soft btn-secondary">Traffic: Right-Hand</button>
      </form>
    </div>
    <div class="absolute bottom-4 right-4 h-14 w-14 rounded-[999px] items-center btn btn-soft" x-on:click="window.resetZoom()">
      <div class="absolute inset-0"></div>
      <svg xmlns="http://www.w3.org/2000/svg" class="block size-7" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
        <path d="M256 0c17.7 0 32 14.3 32 32l0 34.7C368.4 80.1 431.9 143.6 445.3 224l34.7 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-34.7 0C431.9 368.4 368.4 431.9 288 445.3l0 34.7c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-34.7C143.6 431.9 80.1 368.4 66.7 288L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l34.7 0C80.1 143.6 143.6 80.1 224 66.7L224 32c0-17.7 14.3-32 32-32zM128 256a128 128 0 1 0 256 0 128 128 0 1 0 -256 0zm128-80a80 80 0 1 1 0 160 80 80 0 1 1 0-160z" />
      </svg>
    </div>
  </div>
</div>
<?php esbuild("road-editor", 'ts', true); ?>
