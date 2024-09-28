let image;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const REVEAL_DURATION = 60 * 1000; // 1 minute in milliseconds
const PATCH_SIZE = 50; // Size of each shape
const revealedShapes = new Set(); // Track revealed shapes
let totalShapes; // Total number of shapes
let shapesPerSecond; // Number of shapes to reveal per second
let startTime;

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function setup() {
    console.log('Setup started');
    image = await loadImage('images/sg_shell.jpg'); // Load your image
    console.log('Image loaded', image.width, image.height);
    
    // Set canvas dimensions
    canvas.width = image.width;
    canvas.height = image.height;
    document.body.appendChild(canvas); // Append the canvas to the body

    // Fill the canvas with white to start fully masked
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate total shapes
    const totalShapesX = Math.ceil(image.width / (PATCH_SIZE * 0.75)); // Adjust for hexagon width
    const totalShapesY = Math.ceil(image.height / (PATCH_SIZE * Math.sqrt(3) / 2)); // Adjust for hexagon height
    totalShapes = totalShapesX * totalShapesY;

    // Calculate shapes to reveal per second
    shapesPerSecond = totalShapes / (REVEAL_DURATION / 1000); // Total shapes divided by duration in seconds

    startTime = Date.now(); // Start the timer
    console.log('Starting reveal');
    revealImage(); // Start the reveal process
}

function drawSquare(x, y) {
    ctx.fillRect(x, y, PATCH_SIZE, PATCH_SIZE);
}

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x + PATCH_SIZE / 2, y + PATCH_SIZE / 2, PATCH_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawHexagon(x, y) {
    const radius = PATCH_SIZE; // Radius for the hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i; // 60 degrees in radians
        const vertexX = x + Math.cos(angle) * radius;
        const vertexY = y + Math.sin(angle) * radius;
        ctx.lineTo(vertexX, vertexY);
    }
    ctx.closePath();
    ctx.fill();
}

function revealImage() {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / REVEAL_DURATION, 1); // Calculate progress

    console.log('Reveal progress:', progress);
    
    // Calculate how many shapes to reveal based on elapsed time
    const shapesToReveal = Math.floor(shapesPerSecond * (elapsedTime / 1000)); // Calculate shapes to reveal based on elapsed time

    // Ensure we only reveal unique shapes
    while (revealedShapes.size < shapesToReveal) {
        const xPatch = Math.floor(Math.random() * (canvas.width / (PATCH_SIZE * 0.75))) * (PATCH_SIZE * 0.75); // Random x position
        const yPatch = Math.floor(Math.random() * (canvas.height / (PATCH_SIZE * Math.sqrt(3) / 2))) * (PATCH_SIZE * Math.sqrt(3) / 2); // Random y position

        const shapeKey = `${xPatch},${yPatch}`;
        if (!revealedShapes.has(shapeKey)) {
            revealedShapes.add(shapeKey);
            // Randomly select a shape to draw
            const shapeType = Math.floor(Math.random() * 3); // 0: square, 1: circle, 2: hexagon
            ctx.save(); // Save the current state
            ctx.clip(); // Clip the drawing to this path

            // Draw the selected shape
            if (shapeType === 0) {
                drawSquare(xPatch, yPatch);
            } else if (shapeType === 1) {
                drawCircle(xPatch, yPatch);
            } else {
                drawHexagon(xPatch, yPatch);
            }

            // Draw the image in the shape area
            ctx.drawImage(image, xPatch, yPatch, PATCH_SIZE, PATCH_SIZE, xPatch, yPatch, PATCH_SIZE, PATCH_SIZE); // Adjust size as needed
            ctx.restore(); // Restore the state to remove clipping
        }
    }

    // Clear the canvas and redraw the revealed shapes
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with white to mask

    // Redraw the revealed shapes
    revealedShapes.forEach(shape => {
        const [x, y] = shape.split(',').map(Number);
        ctx.save(); // Save the current state
        ctx.clip(); // Clip the drawing to this path

        // Draw the selected shape
        const shapeType = Math.floor(Math.random() * 3); // 0: square, 1: circle, 2: hexagon
        if (shapeType === 0) {
            drawSquare(x, y);
        } else if (shapeType === 1) {
            drawCircle(x, y);
        } else {
            drawHexagon(x, y);
        }

        ctx.drawImage(image, x, y, PATCH_SIZE, PATCH_SIZE, x, y, PATCH_SIZE, PATCH_SIZE); // Adjust size as needed
        ctx.restore(); // Restore the state to remove clipping
    });

    if (progress < 1) {
        requestAnimationFrame(revealImage); // Continue the reveal
    }
}

// Wait for the DOM to be fully loaded before running the setup
document.addEventListener('DOMContentLoaded', setup);