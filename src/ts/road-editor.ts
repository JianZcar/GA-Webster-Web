(() => {
  const svg = d3.select<SVGSVGElement, unknown>("#network");
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

  d3.range(-2000, 2001, gridSize).forEach((pos: number) => {
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
    // Access Alpine.js data safely (may require typing or runtime checks)
    const properties = (document.getElementById("properties") as any)?._x_dataStack?.[0];
    if (!properties) return;

    properties.oID = element?.id ?? "";
    if ("x" in (element ?? {})) {
      // It's a Node (has x and y)
      properties.oNodeX = (element as Node).x ?? "";
      properties.oNodeY = (element as Node).y != null ? -(element as Node).y : "";
      properties.oNodeType = (element as Node).type ?? "";
      properties.hasFrom = false;
      properties.hasTo = false;
      properties.idValue = element?.id ?? "";
      properties.xValue = (element as Node).x ?? "";
      properties.yValue = (element as Node).y != null ? -(element as Node).y : "";
      properties.typeValue = (element as Node).type ?? "";
      properties.fromValue = "";
      properties.toValue = "";
    } else if (element && "source" in element && "target" in element) {
      // It's an Edge
      const e = element as Edge;
      properties.hasFrom = true;
      properties.hasTo = true;
      properties.oNodeX = "";
      properties.oNodeY = "";
      properties.oNodeType = "";
      properties.idValue = e.id ?? "";
      properties.fromValue = e.source ?? "";
      properties.toValue = e.target ?? "";
      properties.xValue = "";
      properties.yValue = "";
      properties.typeValue = "";
    } else {
      // Null or unknown
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
  const toggleTrafficBtn = document.getElementById("toggleTraffic")!;
  toggleTrafficBtn.addEventListener("click", () => {
    rightHandTraffic = !rightHandTraffic;
    toggleTrafficBtn.textContent =
      `Traffic: ${rightHandTraffic ? "Right-Hand" : "Left-Hand"}`;
    updateGraph();
  });

  // Zoom behavior
  const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.8, 5])
    .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
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

  function updateGraph(): void {
    // Clear existing edges and nodes except grid and defs
    g.selectAll("g.edge").remove();
    g.selectAll("g.node").remove();
    g.selectAll("text.edge-label").remove();

    edges.forEach(e => {
      e.offset = 10 * (rightHandTraffic ? 1 : -1);
    });

    // Draw edges
    const edgeGroup = g.selectAll<SVGGElement, Edge>("g.edge")
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
        const s = getNode(d.source)!;
        const t = getNode(d.target)!;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        return s.x + (-dy / len) * (d.offset ?? 0);
      })
      .attr("y1", d => {
        const s = getNode(d.source)!;
        const t = getNode(d.target)!;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        return s.y + (dx / len) * (d.offset ?? 0);
      })
      .attr("x2", d => {
        const s = getNode(d.source)!;
        const t = getNode(d.target)!;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        return t.x + (-dy / len) * (d.offset ?? 0);
      })
      .attr("y2", d => {
        const s = getNode(d.source)!;
        const t = getNode(d.target)!;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        return t.y + (dx / len) * (d.offset ?? 0);
      })
      .attr("stroke", d => d === selectedEdge ? "gold" : "#555");


    // Edge labels
    g.selectAll<SVGTextElement, Edge>("text.edge-label")
      .data(edges, d => d.id)
      .join("text")
      .attr("class", "edge-label")
      .attr("x", d => {
        const s = getNode(d.source)!;
        const t = getNode(d.target)!;
        const midX = (s.x + t.x) / 2;
        const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy);
        const offset = 20 * (rightHandTraffic ? 1 : -1);
        return midX + (-dy / len) * offset;
      })
      .attr("y", d => {
        const s = getNode(d.source)!;
        const t = getNode(d.target)!;
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
          const gNode = enter.append("g")
            .attr("class", "node")
            .call(d3.drag<SVGGElement, Node>()
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
              const idx = nodes.indexOf(d);
              if (idx > -1) nodes.splice(idx, 1);
              // Remove edges connected to this node
              for (let i = edges.length - 1; i >= 0; i--) {
                if (edges[i].source === d.id || edges[i].target === d.id) edges.splice(i, 1);
              }
              if (selectedNode?.id === d.id) {
                selectedNode = null;
                updateInputs(null);
              }
              updateGraph();
            });

          gNode.append("circle")
            .attr("r", 10)
            .attr("fill", "#eee")
            .attr("stroke", "#555")
            .attr("stroke-width", 2);

          gNode.append("text")
            .attr("dy", 4)
            .attr("text-anchor", "middle")
            .attr("pointer-events", "none")
            .text(d => d.id);

          return gNode;
        },
        update => update,
        exit => exit.remove()
      );

    // Update node circles style based on selection
    nodeGroup.select("circle")
      .attr("fill", d => d === selectedNode ? "yellow" : "#eee")
      .attr("stroke", d => d === selectedNode ? "orange" : "#555");

    // Update node labels if needed
    nodeGroup.select("text").text(d => d.id);
  }

  // Adding nodes on SVG click (only if not clicking on node/edge)
  svg.on("click", () => {
    if (d3.event?.defaultPrevented) return; // Ignore drag
    if (selectedNode || selectedEdge) {
      selectedNode = null;
      selectedEdge = null;
      updateInputs(null);
      updateGraph();
      return;
    }
    const [x, y] = d3.pointer(d3.event as any);
    const newNode: Node = {
      id: `n${++nodeCounter}`,
      x,
      y: y,
      type: "road",
    };
    nodes.push(newNode);
    updateInputs(newNode);
    updateGraph();
  });

  // Track mouse for temp edge line when creating edges
  svg.on("mousemove", () => {
    if (!fromNode) {
      tempEdgeLine.attr("visibility", "hidden");
      return;
    }
    const [mx, my] = d3.pointer(d3.event as any);
    tempEdgeLine
      .attr("x1", fromNode.x)
      .attr("y1", fromNode.y)
      .attr("x2", mx)
      .attr("y2", my)
      .attr("visibility", "visible");
  });

  // Update inputs when clicking outside any element
  svg.on("contextmenu", () => {
    // prevent default context menu
    d3.event.preventDefault();
  });

  updateGraph();
})();
