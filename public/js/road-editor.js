const svg = d3.select("#network");
const width = window.innerWidth;
const height = window.innerHeight - 40;

const zoom = d3.zoom().on("zoom", (event) => {
  g.attr("transform", event.transform);
});
svg.call(zoom).on("dblclick.zoom", null);

const g = svg.append("g");

// Grid
const grid = g.append("g").attr("class", "grid");
const gridSize = 20;
for (let x = -2000; x <= 2000; x += gridSize) {
  grid.append("line").attr("x1", x).attr("y1", -2000).attr("x2", x).attr("y2", 2000).attr("stroke", "#eee");
}
for (let y = -2000; y <= 2000; y += gridSize) {
  grid.append("line").attr("x1", -2000).attr("y1", y).attr("x2", 2000).attr("y2", y).attr("stroke", "#eee");
}

const marker = g.append("defs").append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 15)
  .attr("refY", 0)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "#555");

const nodes = [], edges = [];
let nodeCounter = 0, edgeCounter = 0;
let selectedNode = null, fromNode = null;

function getNode(id) {
  return nodes.find(n => n.id === id);
}

function updateInputs(n) {
  document.getElementById("nodeX").value = n?.x || "";
  document.getElementById("nodeY").value = n?.y || "";
}

function edgeExists(source, target) {
  return edges.some(e => e.source === source && e.target === target);
}

let rightHandTraffic = true;

document.getElementById("toggleTraffic").addEventListener("click", () => {
  rightHandTraffic = !rightHandTraffic;
  document.getElementById("toggleTraffic").textContent =
    `Traffic: ${rightHandTraffic ? "Right-Hand" : "Left-Hand"}`;
  updateGraph();
});

function updateGraph() {
  g.selectAll("g.edge").remove();
  g.selectAll("g.node").remove();
  g.selectAll("text.edge-label").remove();

  // Set offset based on traffic side
  edges.forEach(e => {
    e.offset = 10 * (rightHandTraffic ? 1 : -1);
  });

  // Draw edges
  const edgeGroup = g.selectAll("g.edge")
    .data(edges)
    .enter()
    .append("g")
    .attr("class", "edge")
    .on("contextmenu", (event, d) => {
      event.preventDefault();
      const index = edges.indexOf(d);
      if (index > -1) edges.splice(index, 1);
      if (selectedNode && (selectedNode.id === d.source || selectedNode.id === d.target)) {
        selectedNode = null;
        updateInputs(null);
      }
      updateGraph();
    });

  edgeGroup.append("line")
    .attr("stroke", "#555")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrow)")
    .attr("x1", d => {
      const s = getNode(d.source), t = getNode(d.target);
      const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
      return s.x + (-dy / len) * d.offset;
    })
    .attr("y1", d => {
      const s = getNode(d.source), t = getNode(d.target);
      const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
      return s.y + (dx / len) * d.offset;
    })
    .attr("x2", d => {
      const s = getNode(d.source), t = getNode(d.target);
      const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
      return t.x + (-dy / len) * d.offset;
    })
    .attr("y2", d => {
      const s = getNode(d.source), t = getNode(d.target);
      const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
      return t.y + (dx / len) * d.offset;
    });

  // Draw edge labels offset to right or left based on traffic mode
  g.selectAll("text.edge-label")
    .data(edges)
    .enter()
    .append("text")
    .attr("class", "edge-label")
    .attr("x", d => {
      const s = getNode(d.source), t = getNode(d.target);
      const midX = (s.x + t.x) / 2;
      const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
      const offset = 2 * (rightHandTraffic ? 1 : -1) * 10;
      return midX + (-dy / len) * offset;
    })
    .attr("y", d => {
      const s = getNode(d.source), t = getNode(d.target);
      const midY = (s.y + t.y) / 2;
      const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
      const offset = 2 * (rightHandTraffic ? 1 : -1) * 10;
      return midY + (dx / len) * offset;
    })
    .text(d => d.id);

  // Draw nodes
  const nodeGroup = g.selectAll("g.node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(d3.drag().on("drag", (event, d) => {
      d.x = event.x;
      d.y = event.y;
      selectedNode = d;
      updateInputs(d);
      updateGraph();
    }))
    .on("click", (event, d) => {
      event.stopPropagation();
      if (!fromNode) {
        fromNode = d;
      } else if (fromNode !== d) {
        const a = fromNode.id, b = d.id;
        if (!edgeExists(a, b)) {
          edges.push({ id: `e${++edgeCounter}`, source: a, target: b });
        }
        fromNode = null;
      } else {
        fromNode = null;
      }
      selectedNode = d;
      updateInputs(d);
      updateGraph();
    })
    .on("contextmenu", (event, d) => {
      event.preventDefault();
      for (let i = edges.length - 1; i >= 0; i--) {
        if (edges[i].source === d.id || edges[i].target === d.id) {
          edges.splice(i, 1);
        }
      }
      const index = nodes.indexOf(d);
      if (index > -1) nodes.splice(index, 1);
      selectedNode = null;
      fromNode = null;
      updateInputs(null);
      updateGraph();
    });

  nodeGroup.append("circle")
    .attr("r", 10)
    .attr("fill", "steelblue")
    .attr("stroke", d => d === selectedNode ? "gold" : "#333")
    .attr("stroke-width", d => d === selectedNode ? 4 : 1)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

  nodeGroup.append("text")
    .attr("class", "node-label")
    .attr("x", d => d.x)
    .attr("y", d => d.y + 20)
    .text(d => d.id);
}

// Create nodes on svg click
svg.on("click", function(event) {
  const [mx, my] = d3.pointer(event, g.node());
  const newNode = {
    id: `n${++nodeCounter}`,
    x: mx,
    y: my
  };
  nodes.push(newNode);
  fromNode = null;
  selectedNode = null;
  updateInputs(null);
  updateGraph();
});

// Update node position from input fields
document.getElementById("updateNode").addEventListener("click", () => {
  if (selectedNode) {
    selectedNode.x = parseFloat(document.getElementById("nodeX").value);
    selectedNode.y = parseFloat(document.getElementById("nodeY").value);
    updateGraph();
  }
});

// Center zoom initially
svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2));

updateGraph();

