const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let data = [];
let speed = 300;
let isSorting = false;

// Generate random data
function generateData(size) {
    data = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    drawData(data, [], []);
}

// Draw bars with highlighted comparisons
function drawData(data, comparing, swapped) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / data.length;

    data.forEach((value, index) => {
        const height = (value / 105) * canvas.height;
        let color = 'red';

        if (comparing.includes(index)) color = 'blue'; // Comparing
        if (swapped.includes(index)) color = 'green'; // Swapped

        ctx.fillStyle = color;
        ctx.fillRect(index * barWidth, canvas.height - height, barWidth - 2, height);

        // Display the number above the bar
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(value, index * barWidth + barWidth / 2 - 6, canvas.height - height - 5); // Adjusting position to place text above the bar
    });
}


// Sleep function to add delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Bubble Sort
async function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            drawData(arr, [j, j + 1], []);
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                drawData(arr, [], [j, j + 1]);
                await sleep(speed);
            }
        }
    }
    drawData(arr, [], Array.from({ length: n }, (_, i) => i)); // Final sorted array
}

// Selection Sort
async function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            drawData(arr, [j, minIdx], []);
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
            await sleep(speed);
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        drawData(arr, [], [i, minIdx]);
    }
    drawData(arr, [], Array.from({ length: n }, (_, i) => i));
}

// Insertion Sort
async function insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            drawData(arr, [j, j + 1], []);
            await sleep(speed);
            j--;
        }
        arr[j + 1] = key;
        drawData(arr, [], [j + 1]);
    }
    drawData(arr, [], Array.from({ length: n }, (_, i) => i));
}

// Quick Sort
async function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return;

    let pivotIdx = await partition(arr, left, right);
    await quickSort(arr, left, pivotIdx - 1);
    await quickSort(arr, pivotIdx + 1, right);
    drawData(arr, [], Array.from({ length: arr.length }, (_, i) => i));
}

async function partition(arr, left, right) {
    let pivot = arr[right];
    let i = left;
    for (let j = left; j < right; j++) {
        drawData(arr, [j, right], []);
        if (arr[j] < pivot) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
        }
        await sleep(speed);
    }
    [arr[i], arr[right]] = [arr[right], arr[i]];
    return i;
}

// Event listeners
document.getElementById('generate').addEventListener('click', () => {
    const size = parseInt(document.getElementById('size').value);
    generateData(size);
});

document.getElementById('start').addEventListener('click', async () => {
    if (isSorting) return;
    isSorting = true;
    speed = parseInt(document.getElementById('speed').value);
    const algorithm = document.getElementById('algorithm').value;

    switch (algorithm) {
        case 'bubble':
            await bubbleSort(data);
            break;
        case 'selection':
            await selectionSort(data);
            break;
        case 'insertion':
            await insertionSort(data);
            break;
        case 'quick':
            await quickSort(data);
            break;
    }

    isSorting = false;
});
