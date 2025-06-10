interface HTMLElement {
  _x_dataStack?: any[];
}

(() => {
  const svg = d3.select<SVGSVGElement, unknown>("#network");
  const width = window.innerWidth;
  const height = window.innerHeight;
  svg.attr("width", width).attr("height", height);

  window.addEventListener('resize', () => {
    svg.attr("width", window.innerWidth).attr("height", window.innerHeight);
  });

  const g = svg.append<SVGGElement>("g");

  // Grid
  const gridSize = 20;
  const grid = g.append<SVGGElement>("g").attr("class", "grid");

  d3.range(-2000, 2001, gridSize).forEach(pos => {
    grid.append<SVGLineElement>("line")
      .attr("x1", pos).attr("y1", -2000)
      .attr("x2", pos).attr("y2", 2000).attr("stroke", "#eee");
    grid.append<SVGLineElement>("line")
      .attr("x1", -2000).attr("y1", pos)
      .attr("x2", 2000).attr("y2", pos).attr("stroke", "#eee");
  });

  // Arrow marker for edges
  const defs = g.append<SVGDefsElement>("defs");
  defs.append<SVGMarkerElement>("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append<SVGPathElement>("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#555");

  interface Node {
    id: string;
    x: number;
    y: number;
    type: string;
  }

  interface Edge {
    id: string;
    source: string;
    target: string;
    offset?: number;
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeCounter = 0;
  let edgeCounter = 0;
  let selectedNode: Node | null = null;
  let selectedEdge: Edge | null = null;
  let fromNode: Node | null = null;
  let rightHandTraffic = true;

  function getNode(id: string): Node | undefined {
    return nodes.find(n => n.id === id);
  }

  function updateInputs(element: Node | Edge | null): void {
    const properties = document.getElementById("properties")?._x_dataStack?.[0];
    if (!properties) return;

    if (element && 'x' in element) {
      // Node
      const node = element as Node;
      properties.oID = node.id;
      properties.oNodeX = node.x;
      properties.oNodeY = -node.y;
      properties.oNodeType = node.type;
      properties.hasFrom = false;
      properties.hasTo = false;

      properties.idValue = node.id;
      properties.xValue = node.x;
      properties.yValue = -node.y;
      properties.typeValue = node.type;
    } else if (element && 'source' in element) {
      // Edge
      const edge = element as Edge;
      properties.oID = edge.id;
      properties.oNodeX = "";
      properties.oNodeY = "";
      properties.oNodeType = "";
      properties.hasFrom = true;
      properties.hasTo = true;

      properties.idValue = edge.id;
      properties.xValue = "";
      properties.yValue = "";
      properties.typeValue = "";
      properties.fromValue = edge.source;
      properties.toValue = edge.target;
    } else {
      // Clear
      properties.oID = "";
      properties.oNodeX = "";
      properties.oNodeY = "";
      properties.oNodeType = "";
      properties.hasFrom = false;
      properties.hasTo = false;

      properties.idValue = "";
      properties.xValue = "";
      properties.yValue = "";
      properties.typeValue = "";
      properties.fromValue = "";
      properties.toValue = "";
    }
  }

  function edgeExists(source: string, target: string): boolean {
    return edges.some(e => e.source === source && e.target === target);
  }

  // Toggle traffic side
  document.getElementById("toggleTraffic")?.addEventListener("click", () => {
    rightHandTraffic = !rightHandTraffic;
    const button = document.getElementById("toggleTraffic");
    if (button) {
      button.textContent = `Traffic: ${rightHandTraffic ? "Right-Hand" : "Left-Hand"}`;
    }
    updateGraph();
  });

  // Zoom behavior
  const zoom = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.8, 5])
    .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      g.attr("transform", event.transform.toString());
    });
  svg.call(zoom).on("dblclick.zoom", null);

  // Center initial zoom and pan
  svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2));

  // Temporary edge line during edge creation
  const tempEdgeLine = g.append<SVGLineElement>("line")
    .attr("class", "temp-edge")
    .attr("stroke", "orange")
    .attr("stroke-width", 2)
    .attr("pointer-events", "none")
    .attr("visibility", "hidden")
    .attr("marker-end", "url(#arrow)");

  // Update the graph (nodes and edges)
  function updateGraph(): void {
    // Clear existing edges and nodes except grid and defs
    g.selectAll<SVGGElement, Edge>("g.edge").remove();
    g.selectAll<SVGGElement, Node>("g.node").remove();
    g.selectAll<SVGTextElement, Edge>("text.edge-label").remove();

    // Calculate edge offsets
    edges.forEach(e => {
      e.offset = 10 * (rightHandTraffic ? 1 : -1);
    });

    // Draw edges
    const edgeGroup = g.selectAll<SVGGElement, Edge>("g.edge")
      .data(edges, d => d.id)
      .join(
        enter => {
          const gEdge = enter.append<SVGGElement>("g")
            .attr("class", "edge")
            .on("click", (event: MouseEvent, d) => {
              event.stopPropagation();
              selectedEdge = d;
              selectedNode = null;
              updateInputs(d);
              updateGraph();
            })
            .on("contextmenu", (event: MouseEvent, d) => {
              event.preventDefault();
              const idx = edges.indexOf(d);
              if (idx > -1) edges.splice(idx, 1);
              if (selectedNode && (selectedNode.id === d.source || selectedNode.id === d.target)) {
                selectedNode = null;
                updateInputs(null);
              }
              updateGraph();
            });

          gEdge.append<SVGLineElement>("line")
            .attr("stroke", "#555")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");

          return gEdge;
        },
        update => update,
        exit => exit.remove()
      );

    // Update edge lines
    edgeGroup.select<SVGLineElement>("line")
      .attr("x1", d => {
        const s = getNode(d.source), t = getNode(d.target);
        if (!s || !t) return 0;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        return s.x + (-dy / len) * (d.offset || 0);
      })
      .attr("y1", d => {
        const s = getNode(d.source), t = getNode(d.target);
        if (!s || !t) return 0;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        return s.y + (dx / len) * (d.offset || 0);
      })
      .attr("x2", d => {
        const s = getNode(d.source), t = getNode(d.target);
        if (!s || !t) return 0;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        return t.x + (-dy / len) * (d.offset || 0);
      })
      .attr("y2", d => {
        const s = getNode(d.source), t = getNode(d.target);
        if (!s || !t) return 0;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        return t.y + (dx / len) * (d.offset || 0);
      })
      .attr("stroke", d => d === selectedEdge ? "gold" : "#555");

    // Edge labels
    g.selectAll<SVGTextElement, Edge>("text.edge-label")
      .data(edges, d => d.id)
      .join("text")
      .attr("class", "edge-label")
      .attr("x", d => {
        const s = getNode(d.source), t = getNode(d.target);
        if (!s || !t) return 0;
        const midX = (s.x + t.x) / 2;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        const offset = 20 * (rightHandTraffic ? 1 : -1);
        return midX + (-dy / len) * offset;
      })
      .attr("y", d => {
        const s = getNode(d.source), t = getNode(d.target);
        if (!s || !t) return 0;
        const midY = (s.y + t.y) / 2;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        const offset = 20 * (rightHandTraffic ? 1 : -1);
        return midY + (dx / len) * offset;
      })
      .text(d => d.id);

    // Draw nodes
    const nodeGroup = g.selectAll<SVGGElement, Node>("g.node")
      .data(nodes, d => d.id)
      .join(
        enter => {
          const gNode = enter.append<SVGGElement>("g")
            .attr("class", "node")
            .call(d3.drag<SVGGElement, Node, unknown>()
              .on("drag", (event: d3.D3DragEvent<SVGGElement, Node, unknown>, d) => {
                d.x = event.x;
                d.y = event.y;
                selectedNode = d;
                selectedEdge = null;
                updateInputs(d);
                updateGraph();
              }))
            .on("click", (event: MouseEvent, d) => {
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
            .on("contextmenu", (event: MouseEvent, d) => {
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

          gNode.append<SVGCircleElement>("circle")
            .attr("r", 10)
            .attr("fill", "steelblue")
            .attr("stroke", "#333")
            .attr("stroke-width", 1);

          gNode.append<SVGTextElement>("text")
            .attr("class", "node-label")
            .attr("y", 20)
            .text(d => d.id);

          return gNode;
        },
        update => update,
        exit => exit.remove()
      );

    nodeGroup.select<SVGCircleElement>("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("stroke", d => d === selectedNode ? "gold" : (d === fromNode ? "orange" : "#333"))
      .attr("stroke-width", d => (d === selectedNode || d === fromNode) ? 4 : 1);

    nodeGroup.select<SVGTextElement>("text.node-label")
      .attr("x", d => d.x)
      .attr("y", d => d.y + 20);
  }

  // Create nodes on svg click (background)
  svg.on("click", (event: MouseEvent) => {
    if (fromNode) {
      // Cancel edge creation if clicking empty space
      fromNode = null;
      tempEdgeLine.attr("visibility", "hidden");
      updateGraph();
      return;
    }

    const [mx, my] = d3.pointer(event, g.node() as any);
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
  svg.on("mousemove", (event: MouseEvent) => {
    if (fromNode) {
      const [mx, my] = d3.pointer(event, g.node() as any);
      tempEdgeLine
        .attr("x1", fromNode.x)
        .attr("y1", fromNode.y)
        .attr("x2", mx)
        .attr("y2", my)
        .attr("visibility", "visible");
    }
  });

  // Cancel edge creation on pressing Escape
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape" && fromNode) {
      fromNode = null;
      tempEdgeLine.attr("visibility", "hidden");
      updateGraph();
    }
  });

  function renameNode(oldId: string, newId: string): void {
    const node = nodes.find(n => n.id === oldId);
    if (!node) return;
    node.id = newId;

    edges.forEach(edge => {
      if (edge.source === oldId) edge.source = newId;
      if (edge.target === oldId) edge.target = newId;
    });

    updateGraph();
  }

  (window as any).updateElementHandler = function(): void {
    const properties = document.getElementById("properties")?._x_dataStack?.[0];
    if (!properties) return;

    if (selectedNode) {
      const idInput = document.getElementById("ID") as HTMLInputElement;
      const xInput = document.getElementById("nodeX") as HTMLInputElement;
      const yInput = document.getElementById("nodeY") as HTMLInputElement;
      const typeInput = document.getElementById("nodeType") as HTMLSelectElement;

      const id = idInput.value;
      const x = parseFloat(xInput.value);
      const y = parseFloat(yInput.value); // inverted for UI consistency
      const type = typeInput.value;

      renameNode(selectedNode.id, id);
      selectedNode.x = x;
      selectedNode.y = -y;
      selectedNode.type = type;

      // Update properties object
      properties.oID = id;
      properties.oNodeX = x;
      properties.oNodeY = y;
      properties.oNodeType = type;

      properties.idValue = id;
      properties.xValue = x;
      properties.yValue = y;
      properties.typeValue = type;
    } else if (selectedEdge) {
      const idInput = document.getElementById("ID") as HTMLInputElement;
      const id = idInput.value;
      selectedEdge.id = id;

      properties.oID = id;
      properties.idValue = id;
    }
    updateGraph();
  }

  // Initialize toggle traffic button text
  const trafficButton = document.getElementById("toggleTraffic");
  if (trafficButton) {
    trafficButton.textContent = `Traffic: Right-Hand`;
  }

  updateGraph();
})();
