let image;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const REVEAL_DURATION = 60 * 1000; // 1 minute in milliseconds
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
    totalShapes = Math.ceil((image.width * image.height) / (50 * 50)); // Adjust based on desired average shape size

    // Calculate shapes to reveal per second
    shapesPerSecond = totalShapes / (REVEAL_DURATION / 1000); // Total shapes divided by duration in seconds

    startTime = Date.now(); // Start the timer
    console.log('Starting reveal');
    revealImage(); // Start the reveal process
}

function drawRandomShape(x, y) {
    const numVertices = Math.floor(Math.random() * 5) + 3; // Random number of vertices (3 to 7)
    const radius = Math.random() * 40 + 20; // Random radius for the polygon
    const angleIncrement = (Math.PI * 2) / numVertices;

    ctx.beginPath();
    for (let i = 0; i < numVertices; i++) {
        const angle = angleIncrement * i;
        const vertexX = x + Math.cos(angle) * radius + (Math.random() * 20 - 10); // Randomize position slightly
        const vertexY = y + Math.sin(angle) * radius + (Math.random() * 20 - 10);
        ctx.lineTo(vertexX, vertexY);
    }
    ctx.closePath();
    ctx.clip(); // Clip the drawing to this path
}

function revealImage() {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / REVEAL_DURATION, 1); // Calculate progress

    console.log('Reveal progress:', progress);
    
    // Calculate how many shapes to reveal based on elapsed time
    const shapesToReveal = Math.floor(shapesPerSecond * (elapsedTime / 1000)); // Calculate shapes to reveal based on elapsed time

    // Ensure we only reveal unique shapes
    while (revealedShapes.size < shapesToReveal) {
        const x = Math.floor(Math.random() * canvas.width); // Random x position
        const y = Math.floor(Math.random() * canvas.height); // Random y position

        const shapeKey = `${x},${y}`;
        if (!revealedShapes.has(shapeKey)) {
            revealedShapes.add(shapeKey);
            // Draw the random shape
            ctx.save(); // Save the current state
            drawRandomShape(x, y);
            // Draw the image in the shape area
            ctx.drawImage(image, x, y, 50, 50, x, y, 50, 50); // Adjust size as needed
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
        drawRandomShape(x, y);
        ctx.drawImage(image, x, y, 50, 50, x, y, 50, 50); // Adjust size as needed
        ctx.restore(); // Restore the state to remove clipping
    });

    if (progress < 1) {
        requestAnimationFrame(revealImage); // Continue the reveal
    }
}

// Wait for the DOM to be fully loaded before running the setup
document.addEventListener('DOMContentLoaded', setup);