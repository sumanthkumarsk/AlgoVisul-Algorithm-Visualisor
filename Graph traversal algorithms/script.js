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

// Add event listeners for buttons
addNodeButton.addEventListener('click', () => (isAddingEdge = false));
addEdgeButton.addEventListener('click', () => (isAddingEdge = true));
startButton.addEventListener('click', startAlgorithm);
resetButton.addEventListener('click', resetGraph);

speedControl.addEventListener('input', () => {
    console.log(`Speed updated: ${speedControl.value}ms`);
});



// Handle canvas click to add nodes or edges
canvas.addEventListener('click', (event) => {
  const { offsetX: x, offsetY: y } = event;

  if (isAddingEdge) {
    const targetNode = getNodeAtPosition(x, y);
    if (targetNode && selectedNode) {
      edges.push([selectedNode, targetNode]);
      selectedNode = null;
      renderGraph();
    } else if (targetNode) {
      selectedNode = targetNode;
    }
  } else {
    nodes.push({ x, y, visited: false });
    renderGraph();
  }
});

// Get the node at a given position
function getNodeAtPosition(x, y) {
  return nodes.find((node) => Math.hypot(node.x - x, node.y - y) < 20);
}

// Render the graph (nodes and edges)
function renderGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  edges.forEach(([start, end]) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = 'black';
    ctx.stroke();
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

// Get neighbors of a node
function getNeighbors(node) {
  return edges
    .filter((edge) => edge[0] === node || edge[1] === node)
    .map((edge) => (edge[0] === node ? edge[1] : edge[0]));
}

// BFS Algorithm
async function bfs(startNode) {
  const queue = [startNode];
  startNode.visited = true;
  renderGraph();

  while (queue.length) {
    const node = queue.shift();
    const neighbors = getNeighbors(node);

    for (const neighbor of neighbors) {
      if (!neighbor.visited) {
        neighbor.visited = true;
        queue.push(neighbor);
        renderGraph();
        await sleep(500);
      }
    }
  }
}

// DFS Algorithm
async function dfs(node) {
  if (!node || node.visited) return;
  node.visited = true;
  renderGraph();
  await sleep(500);

  const neighbors = getNeighbors(node);
  for (const neighbor of neighbors) {
    await dfs(neighbor);
  }
}

// Start the selected algorithm
function startAlgorithm() {
  const algorithm = algoSelect.value;
  if (nodes.length === 0) return alert('Add some nodes first!');

  // Reset visited status for all nodes
  nodes.forEach((node) => (node.visited = false));
  renderGraph();

  switch (algorithm) {
    case 'bfs':
      bfs(nodes[0]);
      break;
    case 'dfs':
      dfs(nodes[0]);
      break;
    default:
      alert('Invalid algorithm selected!');
  }
}

// Helper function to pause execution
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resetGraph() {
  nodes = [];
  edges = [];
  selectedNode = null;
  isAddingEdge = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function sleep() {
    const speed = parseInt(speedControl.value); // Get the current speed value
    return new Promise((resolve) => setTimeout(resolve, speed));
}

