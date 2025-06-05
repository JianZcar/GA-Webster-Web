const svg = d3.select("#network");
const width = window.innerWidth;
const height = window.innerHeight - 40;

const zoom = d3.zoom().on("zoom", (event) => {
  g.attr("transform", event.transform);
});
svg.call(zoom);

const g = svg.append("g");

// Grid
const grid = g.append("g").attr("class", "grid");
const gridSize = 20;
for (let x = -2000; x <= 2000; x += gridSize) {
  grid.append("line").attr("x1", x).attr("y1", -2000).attr("x2", x).attr("y2", 2000);
}
for (let y = -2000; y <= 2000; y += gridSize) {
  grid.append("line").attr("x1", -2000).attr("y1", y).attr("x2", 2000).attr("y2", y);
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
let rightHandTraffic = true;

function getNode(id) {
  return nodes.find(n => n.id === id);
}

function calculateOffset(index, total) {
  const spacing = 10;
  return (index - (total - 1) / 2) * spacing;
}

function updateInputs(n) {
  document.getElementById("nodeX").value = n?.x || "";
  document.getElementById("nodeY").value = n?.y || "";
}

function updateGraph() {
  g.selectAll("g.edge").remove();
  g.selectAll("g.node").remove();
  g.selectAll("text.edge-label").remove();

  // Group edges by undirected pairs
  const grouped = d3.groups(edges, d => [d.source, d.target].sort().join("-"));
  grouped.forEach(([_, group]) => {
    group.forEach((e, i) => {
      const dir = (e.source < e.target) === rightHandTraffic ? 1 : -1;
      e.offset = calculateOffset(i, group.length) * dir;
    });
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
      if (index > -1) {
        edges.splice(index, 1);
        if (selectedNode && (selectedNode.id === d.source || selectedNode.id === d.target)) {
          selectedNode = null;
          updateInputs(null);
        }
        updateGraph();
      }
    });

  edgeGroup.append("line")
    .attr("stroke", "#555")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrow)")
    .attr("x1", d => {
      const s = getNode(d.source), t = getNode(d.target);
      const dx = t.y - s.y, dy = s.x - t.x, len = Math.hypot(dx, dy);
      return s.x + dx / len * d.offset;
    })
    .attr("y1", d => {
      const s = getNode(d.source), t = getNode(d.target);
      const dx = t.y - s.y, dy = s.x - t.x, len = Math.hypot(dx, dy);
      return s.y + dy / len * d.offset;
    })
    .attr("x2", d => {
      const s = getNode(d.source), t = getNode(d.target);
      const dx = t.y - s.y, dy = s.x - t.x, len = Math.hypot(dx, dy);
      return t.x + dx / len * d.offset;
    })
    .attr("y2", d => {
      const s = getNode(d.source), t = getNode(d.target);
      const dx = t.y - s.y, dy = s.x - t.x, len = Math.hypot(dx, dy);
      return t.y + dy / len * d.offset;
    });

  g.selectAll("text.edge-label")
    .data(edges)
    .enter()
    .append("text")
    .attr("class", "edge-label")
    .attr("x", d => (getNode(d.source).x + getNode(d.target).x) / 2)
    .attr("y", d => (getNode(d.source).y + getNode(d.target).y) / 2 - 5)
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
        const existing = edges.filter(e =>
          (e.source === fromNode.id && e.target === d.id) ||
          (e.source === d.id && e.target === fromNode.id)
        );
        if (existing.length < 2 && !existing.find(e => e.source === fromNode.id && e.target === d.id)) {
          edges.push({ id: `e${++edgeCounter}`, source: fromNode.id, target: d.id });
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
      // Remove all edges connected to this node
      for (let i = edges.length - 1; i >= 0; i--) {
        if (edges[i].source === d.id || edges[i].target === d.id) {
          edges.splice(i, 1);
        }
      }
      // Remove the node itself
      const index = nodes.indexOf(d);
      if (index > -1) {
        nodes.splice(index, 1);
      }
      selectedNode = null;
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

svg.on("click", function (event) {
  const [mx, my] = d3.pointer(event, g.node());
  const newNode = {
    id: `n${++nodeCounter}`,
    x: mx,
    y: my
  };
  nodes.push(newNode);
  updateGraph();
});

document.getElementById("updateNode").addEventListener("click", () => {
  if (selectedNode) {
    selectedNode.x = parseFloat(document.getElementById("nodeX").value);
    selectedNode.y = parseFloat(document.getElementById("nodeY").value);
    updateGraph();
  }
});

document.getElementById("toggleTraffic").addEventListener("click", () => {
  rightHandTraffic = !rightHandTraffic;
  document.getElementById("toggleTraffic").innerText =
    `Traffic: ${rightHandTraffic ? 'Right' : 'Left'}-Hand`;
  updateGraph();
});

// Initial pan to center 0,0
svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2));

updateGraph();
