document.getElementById('submit-feedback').addEventListener('click', () => {
  const input = document.getElementById('feedback-input');
  const feedbackList = document.getElementById('feedback-list');

  if (input.value.trim() !== "") {
    const feedback = document.createElement('li');
    feedback.textContent = input.value.trim();
    feedbackList.appendChild(feedback);
    input.value = "";
  }
});
// Smooth scroll to Home Page
document.getElementById("get-started").addEventListener("click", function () {
  document.getElementById("algorithms").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("sorting-btn").addEventListener("click", function() {
  window.location.href = "Sorting/Sort.html";  // Replace with the actual URL you want to go to
});
document.getElementById("traversing-btn").addEventListener("click", function() {
  window.location.href = "Graph Traversal Algorithms/graph.html";  // Replace with the actual URL you want to go to
});
document.getElementById("Spanning-btn").addEventListener("click", function() {
  window.location.href = "MST Algorithms/Mst.html";  // Replace with the actual URL you want to go to
});
document.getElementById("array-btn").addEventListener("click", function() {
  window.location.href = "Array/array.html";  // Replace with the actual URL you want to go to
});
document.getElementById("stack-btn").addEventListener("click", function() {
  window.location.href = "stack/Stack.html";  // Replace with the actual URL you want to go to
});
document.getElementById("nqueens-btn").addEventListener("click", function() {
  window.location.href = "nqueen/nqueens.html";  // Replace with the actual URL you want to go to
});