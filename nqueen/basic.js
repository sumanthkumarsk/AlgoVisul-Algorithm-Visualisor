// References
const solutionsContainer = document.getElementById("solutions");
const solveButton = document.getElementById("solve-btn");
const nInput = document.getElementById("n-input");

// Delay for visualization (in milliseconds)
const VISUALIZATION_DELAY = 500;

// Function to generate a single chessboard for a solution
function createChessboard(board, N) {
  const boardContainer = document.createElement("div");
  boardContainer.classList.add("board-container");

  const chessboard = document.createElement("div");
  chessboard.classList.add("chessboard");
  chessboard.style.gridTemplateColumns = `repeat(${N}, 40px)`;
  chessboard.style.gridTemplateRows =` repeat(${N}, 40px)`;

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Add a queen if present
      if (board[i][j] === 1) {
        const queen = document.createElement("span");
        queen.textContent = "♛";
        queen.classList.add("queen");
        cell.appendChild(queen);
      }

      // Alternate cell colors
      const isEven = (i + j) % 2 === 0;
      cell.style.backgroundColor = isEven ? "#eee" : "#333";
      cell.style.color = isEven ? "black" : "white";

      chessboard.appendChild(cell);
    }
  }

  boardContainer.appendChild(chessboard);
  return boardContainer;
}

// Update the chessboard visualization in real-time
async function updateChessboard(board, N) {
  // Create a live chessboard visualization
  solutionsContainer.innerHTML = ""; // Clear current visual
  const liveChessboard = createChessboard(board, N);
  solutionsContainer.appendChild(liveChessboard);

  // Delay to allow visualization
  await new Promise((resolve) => setTimeout(resolve, VISUALIZATION_DELAY));
}

// Check if placing a queen is safe
function isSafe(board, row, col, N) {
  for (let i = 0; i < col; i++) {
    if (board[row][i]) return false;
  }
  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j]) return false;
  }
  for (let i = row, j = col; i < N && j >= 0; i++, j--) {
    if (board[i][j]) return false;
  }
  return true;
}

// Solve N-Queens problem using backtracking and visualize step by step
async function solveNQueens(board, col, N, solutions) {
  if (col >= N) {
    solutions.push(board.map((row) => [...row])); // Store solution
    return;
  }

  for (let i = 0; i < N; i++) {
    if (isSafe(board, i, col, N)) {
      board[i][col] = 1; // Place queen
      await updateChessboard(board, N); // Visualize placement

      await solveNQueens(board, col + 1, N, solutions); // Recursively solve

      board[i][col] = 0; // Backtrack
      await updateChessboard(board, N); // Visualize backtracking
    }
  }
}

// Main function to visualize solutions
async function visualizeNQueens() {
  const N = parseInt(nInput.value);
  if (isNaN(N) || N < 4 || N > 12) {
    alert("Please enter a valid number between 4 and 12.");
    return;
  }

  // Clear previous solutions
  solutionsContainer.innerHTML = "";

  // Prepare the board and solutions array
  const board = Array.from({ length: N }, () => Array(N).fill(0));
  const solutions = [];

  // Solve and visualize
  await solveNQueens(board, 0, N, solutions);

  // Display all solutions in separate chessboards
  solutions.forEach((solution, index) => {
    const solutionContainer = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = `Solution ${index + 1}`;
    solutionContainer.appendChild(title);
    solutionContainer.appendChild(createChessboard(solution, N));
    solutionsContainer.appendChild(solutionContainer);
  });
}

// Attach event listener to the button
solveButton?.addEventListener("click", visualizeNQueens);