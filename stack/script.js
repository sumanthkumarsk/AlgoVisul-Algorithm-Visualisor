let stack = []; // The stack (as linked list nodes)
let maxSize = 0; // Default stack size

// Function to set the stack size based on user input
function setStackSize() {
    const size = document.getElementById('stack-size').value;
    const status = document.getElementById('status');

    if (size === '' || size <= 0) {
        status.textContent = 'Please enter a valid stack size!';
        return;
    }

    maxSize = parseInt(size);
    stack = []; // Reset the stack when the size changes
    status.textContent = `Stack size set to ${maxSize}.`;
    renderStack();
}

// Function to visualize the linked list stack
function renderStack() {
    const stackContainer = document.getElementById('stack');
    stackContainer.innerHTML = ''; // Clear the container

    // Create a visual representation of each node
    stack.forEach((value, index) => {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('node');

        const valueElement = document.createElement('span');
        valueElement.textContent = value;

        nodeElement.appendChild(valueElement);
        stackContainer.appendChild(nodeElement);

        // Add arrow pointing to next node (if not the last node)
        if (index !== stack.length - 1) {
            const arrowElement = document.createElement('span');
            arrowElement.classList.add('arrow');
            arrowElement.textContent = '↓';
            stackContainer.appendChild(arrowElement);
        }
    });
}

// Push operation (Linked List style)
function push() {
    const value = document.getElementById('input-value').value;
    const status = document.getElementById('status');

    if (value === '') {
        status.textContent = 'Please enter a value!';
        return;
    }

    if (stack.length >= maxSize) {
        status.textContent = 'Stack Overflow! Cannot push more elements.';
        return;
    }

    stack.push(value);
    status.textContent = `Pushed ${value} to the stack.`;
    renderStack();
}

// Pop operation (Linked List style)
function pop() {
    const status = document.getElementById('status');

    if (stack.length === 0) {
        status.textContent = 'Stack Underflow! No elements to pop.';
        return;
    }

    const poppedValue = stack.pop();
    status.textContent = `Popped ${poppedValue} from the stack.`;
    renderStack();
}
