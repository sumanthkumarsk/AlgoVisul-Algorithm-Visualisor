let array = [];
let size = 0;

function initializeArray() {
  const arraySizeInput = document.getElementById("array-size");
  size = parseInt(arraySizeInput.value);

  if (isNaN(size) || size <= 0) {
    updateOutput("Please enter a valid array size!");
    return;
  }

  array = new Array(size).fill(null);
  renderArray();
  updateOutput(`Array of size ${size} initialized.`);
}

function renderArray() {
  const container = document.getElementById("array-container");
  container.innerHTML = ""; // Clear previous elements

  array.forEach((value, index) => {
    const box = document.createElement("div");
    box.classList.add("array-box");
    box.textContent = value !== null ? value : "";
    container.appendChild(box);
  });
}

function insertElement() {
  const inputValue = document.getElementById("input-value").value.trim();
  const value = parseInt(inputValue);

  if (isNaN(value)) {
    updateOutput("Please enter a valid number to insert!");
    return;
  }

  const emptyIndex = array.indexOf(null);
  if (emptyIndex === -1) {
    updateOutput("Array is full! Cannot insert more elements.");
    return;
  }

  array[emptyIndex] = value;
  renderArray();
  updateOutput(`Inserted ${value} at position ${emptyIndex + 1}.`);
  document.getElementById("input-value").value = ""; // Clear input
}

function deleteElement() {
  const inputValue = document.getElementById("input-value").value.trim();
  const value = parseInt(inputValue);

  if (isNaN(value)) {
    updateOutput("Please enter a valid number to delete!");
    return;
  }

  const index = array.indexOf(value);
  if (index === -1) {
    updateOutput(`Element ${value} not found.`);
    return;
  }

  array.splice(index, 1);
  array.push(null); // Maintain array size by filling with null
  renderArray();
  updateOutput(`Deleted ${value} from position ${index + 1}.`);
  document.getElementById("input-value").value = ""; // Clear input
}

function searchElement() {
  const inputValue = document.getElementById("input-value").value.trim();
  const value = parseInt(inputValue);

  if (isNaN(value)) {
    updateOutput("Please enter a valid number to search!");
    return;
  }

  const boxes = document.querySelectorAll(".array-box");
  let found = false;

  boxes.forEach((box, index) => {
    box.classList.remove("highlight");
    if (array[index] === value) {
      box.classList.add("highlight");
      found = true;
    }
  });

  if (found) {
    updateOutput(`Element ${value} found.`);
  } else {
    updateOutput(`Element ${value} not found.`);
  }

  document.getElementById("input-value").value = ""; // Clear input
}

function updateOutput(message) {
  const output = document.getElementById("output");
  output.textContent = message;
}
