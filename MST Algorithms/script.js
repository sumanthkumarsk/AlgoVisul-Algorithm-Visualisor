const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const algoSelect = document.getElementById('algo');
const addNodeButton = document.getElementById('add-node');
const addEdgeButton = document.getElementById('add-edge');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const speedControl = document.getElementById('speed');

let nodes = [];
let edges = [];
let isAddingEdge = false;
let selectedNode = null;

// Event listeners for buttons
addNodeButton.addEventListener('click', () => (isAddingEdge = false));
addEdgeButton.addEventListener('click', () => (isAddingEdge = true));
startButton.addEventListener('click', startAlgorithm);
resetButton.addEventListener('click', resetGraph);





document.getElementById("algo").addEventListener("change", () => {
  const selectedAlgorithm = document.getElementById("algo").value;

  // Show source node dropdown only for Dijkstra's Algorithm
  const sourceNodeDropdown = document.getElementById("sourceNodeContainer");
  if (selectedAlgorithm === "dijkstra") {
    sourceNodeDropdown.style.display = "block";
  } else {
    sourceNodeDropdown.style.display = "none";
  }
});








canvas.addEventListener('click', (event) => {
  const { offsetX: x, offsetY: y } = event;

  if (isAddingEdge) {
    const targetNode = getNodeAtPosition(x, y);
    if (targetNode && selectedNode) {
      const weight = parseInt(prompt("Enter edge weight:", 1));
      if (!isNaN(weight) && weight > 0) {
        edges.push({ start: selectedNode, end: targetNode, weight });
      }
      selectedNode = null;
      renderGraph();
    } else if (targetNode) {
      selectedNode = targetNode;
    }
  } else {
    nodes.push({ x, y, visited: false, distance: Infinity });
    renderGraph();
  }
});




// Utility Functions
function getNodeAtPosition(x, y) {
  return nodes.find((node) => Math.hypot(node.x - x, node.y - y) < 20);
}

function renderGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  edges.forEach(({ start, end, weight, highlighted, faded }) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = highlighted ? 'blue' : faded ? 'gray' : 'black';
    ctx.stroke();
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    ctx.fillStyle = 'black';
    ctx.fillText(weight, midX, midY);
  });

  // Draw nodes
  nodes.forEach((node, index) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = node.visited ? 'green' : 'red';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fillText(index, node.x - 5, node.y + 5);
  });
}

function getNeighbors(node) {
  return edges
    .filter((edge) => edge.start === node || edge.end === node)
    .map((edge) => (edge.start === node ? edge.end : edge.start));
}

// Algorithms
async function prims() {
    if (nodes.length === 0) return alert("Add some nodes first!");
    
    let mstEdges = [];
    let visitedNodes = new Set();
  
    // Start from the first node
    visitedNodes.add(nodes[0]);
    nodes[0].visited = true;
    renderGraph();
  
    while (mstEdges.length < nodes.length - 1) {
      // Get all edges where one endpoint is visited and the other is not
      const eligibleEdges = edges.filter(
        (edge) =>
          (visitedNodes.has(edge.start) && !visitedNodes.has(edge.end)) ||
          (visitedNodes.has(edge.end) && !visitedNodes.has(edge.start))
      );
  
      // Sort edges by weight
      eligibleEdges.sort((a, b) => a.weight - b.weight);
  
      const edge = eligibleEdges[0];
      if (!edge) break; // No more eligible edges (graph may be disconnected)
  
      // Add the edge to MST
      edge.highlighted = true;
      mstEdges.push(edge);
  
      // Mark the connected node as visited
      const newNode = !visitedNodes.has(edge.start) ? edge.start : edge.end;
      visitedNodes.add(newNode);
      newNode.visited = true; // Mark node as visited for rendering
      renderGraph();
      await sleep(speedControl.value);
    }
  
    if (mstEdges.length < nodes.length - 1) {
      alert("The graph is disconnected; MST cannot be formed.");
    } else {
      alert("Prim's Algorithm completed successfully!");
    }
  }

  
  async function kruskals() {
    if (nodes.length === 0 || edges.length === 0) {
      alert("Add some nodes and edges first!");
      return;
    }
  
    // Sort edges by weight in ascending order
    edges.sort((a, b) => a.weight - b.weight);
  
    // Initialize Union-Find (disjoint set) for nodes
    let parent = Array(nodes.length).fill(null).map((_, i) => i);
  
    // Find function with path compression
    function find(nodeIndex) {
      if (parent[nodeIndex] !== nodeIndex) {
        parent[nodeIndex] = find(parent[nodeIndex]); // Path compression
      }
      return parent[nodeIndex];
    }
  
    // Union function to join two subsets
    function union(node1Index, node2Index) {
      const root1 = find(node1Index);
      const root2 = find(node2Index);
      if (root1 !== root2) {
        parent[root1] = root2;
      }
    }
  
    // Minimum Spanning Tree (MST) edges
    let mstEdges = [];
  
    for (let edge of edges) {
      const startIndex = nodes.indexOf(edge.start);
      const endIndex = nodes.indexOf(edge.end);
  
      if (find(startIndex) !== find(endIndex)) {
        mstEdges.push(edge);
        union(startIndex, endIndex);
  
        // Highlight the edge as part of the MST
        edge.highlighted = true;
  
        // Mark nodes as visited
        edge.start.visited = true;
        edge.end.visited = true;
  
        renderGraph();
        await sleep(speedControl.value);
  
        // Stop if we have enough edges for the MST
        if (mstEdges.length === nodes.length - 1) {
          break;
        }
      }
    }
  
    // Check if the MST spans all nodes
    const rootSet = new Set(nodes.map((_, i) => find(i)));
    if (rootSet.size > 1) {
      alert("The graph is disconnected; MST cannot be formed.");
    } else {
      alert("Kruskal's Algorithm completed successfully!");
    }
  }
  
  

// Start Algorithm
function startAlgorithm() {
  const algorithm = algoSelect.value;

  nodes.forEach((node) => {
    node.visited = false;
    node.distance = Infinity;
  });
  edges.forEach((edge) => {
    edge.highlighted = false;
    edge.faded = false;
  });
  renderGraph();

  switch (algorithm) {
    case 'prims':
      prims();
      break;
    case 'kruskals':
      kruskals();
      break;
    case 'dijkstra':
      dijkstra();
      break;
    default:
      alert('Invalid algorithm selected!');
  }
}

// Helper functions
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resetGraph() {
  nodes = [];
  edges = [];
  selectedNode = null;
  isAddingEdge = false;
  renderGraph();
}
