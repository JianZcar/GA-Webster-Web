(() => {
  const svg = d3.select("#network");
  const width = window.innerWidth;
  const height = window.innerHeight;
  svg.attr("width", width).attr("height", height);

  window.addEventListener('resize', () => {
    svg.attr("width", window.innerWidth).attr("height", window.innerHeight);
  });


  const g = svg.append("g");

  // Grid
  const gridSize = 20;
  const grid = g.append("g").attr("class", "grid");

  d3.range(-2000, 2001, gridSize).forEach(pos => {
    grid.append("line").attr("x1", pos).attr("y1", -2000)
      .attr("x2", pos).attr("y2", 2000).attr("stroke", "#eee");
    grid.append("line")
      .attr("x1", -2000).attr("y1", pos)
      .attr("x2", 2000).attr("y2", pos).attr("stroke", "#eee");
  });

  // Arrow marker for edges
  const defs = g.append("defs");
  defs.append("marker")
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

  const nodes = [];
  const edges = [];
  let nodeCounter = 0;
  let edgeCounter = 0;
  let selectedNode = null;
  let selectedEdge = null;
  let fromNode = null;

  let rightHandTraffic = true;

  function getNode(id) {
    return nodes.find(n => n.id === id);
  }

  function updateInputs(element) {
    document.getElementById("ID").value = element?.id ?? "";
    document.getElementById("ID").dispatchEvent(new Event('input'));

    document.getElementById("nodeX").value = element?.x ?? "";
    document.getElementById("nodeX").dispatchEvent(new Event('input'));

    document.getElementById("nodeY").value = element?.y * -1 ?? "";
    document.getElementById("nodeY").dispatchEvent(new Event('input'));

    document.getElementById("nodeType").value = element?.type ?? "";
    document.getElementById("nodeType").dispatchEvent(new Event('change'));

    document.getElementById("edgeFrom").value = element?.source ?? "";
    document.getElementById("edgeFrom").dispatchEvent(new Event('input'));

    document.getElementById("edgeTo").value = element?.target ?? "";
    document.getElementById("edgeTo").dispatchEvent(new Event('input'));
  }

  function edgeExists(source, target) {
    return edges.some(e => e.source === source && e.target === target);
  }

  // Toggle traffic side
  document.getElementById("toggleTraffic").addEventListener("click", () => {
    rightHandTraffic = !rightHandTraffic;
    document.getElementById("toggleTraffic").textContent =
      `Traffic: ${rightHandTraffic ? "Right-Hand" : "Left-Hand"}`;
    updateGraph();
  });

  // Zoom behavior
  const zoom = d3.zoom().scaleExtent([0.8, 5])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });
  svg.call(zoom).on("dblclick.zoom", null);

  // Center initial zoom and pan
  svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2));

  // Temporary edge line during edge creation
  const tempEdgeLine = g.append("line")
    .attr("class", "temp-edge")
    .attr("stroke", "orange")
    .attr("stroke-width", 2)
    .attr("pointer-events", "none")
    .attr("visibility", "hidden")
    .attr("marker-end", "url(#arrow)");

  // Update the graph (nodes and edges)
  function updateGraph() {
    // Clear existing edges and nodes except grid and defs
    g.selectAll("g.edge").remove();
    g.selectAll("g.node").remove();
    g.selectAll("text.edge-label").remove();

    edges.forEach(e => {
      e.offset = 10 * (rightHandTraffic ? 1 : -1);
    });

    // Draw edges
    const edgeGroup = g.selectAll("g.edge")
      .data(edges, d => d.id)
      .join(
        enter => {
          const gEdge = enter.append("g")
            .attr("class", "edge")
            .on("click", (event, d) => {
              event.stopPropagation();
              selectedEdge = d;
              selectedNode = null;
              updateInputs(d);
              updateGraph();
            })
            .on("contextmenu", (event, d) => {
              event.preventDefault();
              const idx = edges.indexOf(d);
              if (idx > -1) edges.splice(idx, 1);
              if (selectedNode && (selectedNode.id === d.source || selectedNode.id === d.target)) {
                selectedNode = null;
                updateInputs(null);
              }
              updateGraph();
            });

          gEdge.append("line")
            .attr("stroke", "#555")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");

          return gEdge;
        },
        update => update,
        exit => exit.remove()
      );

    // Update edge lines
    edgeGroup.select("line")
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
      })
      .attr("stroke", d => d === selectedEdge ? "gold" : "#555")


    // Edge labels
    g.selectAll("text.edge-label")
      .data(edges, d => d.id)
      .join("text")
      .attr("class", "edge-label")
      .attr("x", d => {
        const s = getNode(d.source), t = getNode(d.target);
        const midX = (s.x + t.x) / 2;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        const offset = 20 * (rightHandTraffic ? 1 : -1);
        return midX + (-dy / len) * offset;
      })
      .attr("y", d => {
        const s = getNode(d.source), t = getNode(d.target);
        const midY = (s.y + t.y) / 2;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        const offset = 20 * (rightHandTraffic ? 1 : -1);
        return midY + (dx / len) * offset;
      })
      .text(d => d.id);

    // Draw nodes
    const nodeGroup = g.selectAll("g.node")
      .data(nodes, d => d.id)
      .join(
        enter => {
          const gNode = enter.append("g")
            .attr("class", "node")
            .call(d3.drag()
              .on("drag", (event, d) => {
                d.x = event.x;
                d.y = event.y;
                selectedNode = d;
                selectedEdge = null;
                updateInputs(d);
                updateGraph();
              }))
            .on("click", (event, d) => {
              event.stopPropagation();
              if (!fromNode) {
                fromNode = d;
              } else if (fromNode !== d) {
                if (!edgeExists(fromNode.id, d.id)) {
                  edges.push({ id: `e${++edgeCounter}`, source: fromNode.id, target: d.id });
                }
                fromNode = null;
                tempEdgeLine.attr("visibility", "hidden");
              } else {
                fromNode = null;
                tempEdgeLine.attr("visibility", "hidden");
              }
              selectedNode = d;
              selectedEdge = null;
              updateInputs(d);
              updateGraph();
            })
            .on("contextmenu", (event, d) => {
              event.preventDefault();
              // Remove edges connected to this node
              for (let i = edges.length - 1; i >= 0; i--) {
                if (edges[i].source === d.id || edges[i].target === d.id) {
                  edges.splice(i, 1);
                }
              }
              const idx = nodes.indexOf(d);
              if (idx > -1) nodes.splice(idx, 1);
              selectedNode = null;
              fromNode = null;
              tempEdgeLine.attr("visibility", "hidden");
              updateInputs(null);
              updateGraph();
            });

          gNode.append("circle")
            .attr("r", 10)
            .attr("fill", "steelblue")
            .attr("stroke", "#333")
            .attr("stroke-width", 1);

          gNode.append("text")
            .attr("class", "node-label")
            .attr("y", 20)
            .text(d => d.id);

          return gNode;
        },
        update => update,
        exit => exit.remove()
      );

    nodeGroup.select("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("stroke", d => d === selectedNode ? "gold" : (d === fromNode ? "orange" : "#333"))
      .attr("stroke-width", d => (d === selectedNode || d === fromNode) ? 4 : 1);

    nodeGroup.select("text.node-label")
      .attr("x", d => d.x)
      .attr("y", d => d.y + 20);
  }

  // Create nodes on svg click (background)
  svg.on("click", (event) => {
    if (fromNode) {
      // Cancel edge creation if clicking empty space
      fromNode = null;
      tempEdgeLine.attr("visibility", "hidden");
      updateGraph();
      return;
    }

    const [mx, my] = d3.pointer(event, g.node());
    nodes.push({
      id: `n${++nodeCounter}`,
      x: mx,
      y: my,
      type: 'priority'
    });
    selectedNode = null;
    updateInputs(null);
    updateGraph();
  });

  // Mouse move on SVG to update temp edge line if edge creation started
  svg.on("mousemove", (event) => {
    if (fromNode) {
      const [mx, my] = d3.pointer(event, g.node());
      tempEdgeLine
        .attr("x1", fromNode.x)
        .attr("y1", fromNode.y)
        .attr("x2", mx)
        .attr("y2", my)
        .attr("visibility", "visible");
    }
  });

  // Cancel edge creation on pressing Escape
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && fromNode) {
      fromNode = null;
      tempEdgeLine.attr("visibility", "hidden");
      updateGraph();
    }
  });

  function renameNode(oldId, newId) {
    const node = nodes.find(n => n.id === oldId);
    if (!node) return;
    node.id = newId;

    edges.forEach(edge => {
      if (edge.source === oldId) edge.source = newId;
      if (edge.target === oldId) edge.target = newId;
    });

    updateGraph();
  }


  document.getElementById("updateElement").addEventListener("click", () => {
    if (selectedNode) {
      const id = document.getElementById("ID").value;
      const x = parseFloat(document.getElementById("nodeX").value);
      const y = -parseFloat(document.getElementById("nodeY").value); // inverted for UI consistency
      const type = document.getElementById("nodeType").value;

      renameNode(selectedNode.id, id);
      selectedNode.x = x;
      selectedNode.y = y;
      selectedNode.type = type;

      updateGraph();
    } else if (selectedEdge) {
      const id = document.getElementById("ID").value;

      selectedEdge.id = id;

      updateGraph();
    }
  });

  // Initialize toggle traffic button text
  document.getElementById("toggleTraffic").textContent = `Traffic: Right-Hand`;

  updateGraph();
})();
