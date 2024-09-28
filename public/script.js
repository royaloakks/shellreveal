let image;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const REVEAL_DURATION = 60 * 1000; // 1 minute in milliseconds
const PATCH_SIZE = 100; // Size of each patch
const revealedPatches = new Set(); // Track revealed patches
let totalPatches; // Total number of patches
let patchesPerFrame; // Number of patches to reveal per frame
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
    
    // Calculate total patches
    const totalPatchesX = Math.ceil(image.width / PATCH_SIZE);
    const totalPatchesY = Math.ceil(image.height / PATCH_SIZE);
    totalPatches = totalPatchesX * totalPatchesY;

    // Calculate patches to reveal per frame
    patchesPerFrame = Math.ceil(totalPatches / (REVEAL_DURATION / 1000)); // Reveal all patches in 60 seconds

    startTime = Date.now(); // Start the timer
    console.log('Starting reveal');
    revealImage(); // Start the reveal process
}

function drawPolygon(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y); // Starting point

    // Define the irregular polygon shape
    ctx.lineTo(x + 30, y + 10);
    ctx.lineTo(x + 10, y + 30);
    ctx.lineTo(x - 10, y + 10);
    ctx.closePath(); // Close the path
    ctx.clip(); // Clip the drawing to this path
}

function revealImage() {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / REVEAL_DURATION, 1); // Calculate progress

    console.log('Reveal progress:', progress);
    
    // Calculate how many patches to reveal based on elapsed time
    const patchesToReveal = Math.min(patchesPerFrame, totalPatches - revealedPatches.size);

    // Randomly reveal patches
    for (let i = 0; i < patchesToReveal; i++) {
        const xPatch = Math.floor(Math.random() * (canvas.width / PATCH_SIZE)); // Random x patch index
        const yPatch = Math.floor(Math.random() * (canvas.height / PATCH_SIZE)); // Random y patch index

        // Calculate the position of the patch
        const x = xPatch * PATCH_SIZE;
        const y = yPatch * PATCH_SIZE;

        // Ensure we only reveal unique patches
        const patchKey = `${x},${y}`;
        if (!revealedPatches.has(patchKey)) {
            revealedPatches.add(patchKey);
            // Draw the polygon shape
            drawPolygon(x, y);
            // Draw the image in the polygon area
            ctx.drawImage(image, x, y, PATCH_SIZE, PATCH_SIZE, x, y, PATCH_SIZE, PATCH_SIZE);
        }
    }

    // Clear the canvas and redraw the revealed patches
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with white to mask

    // Redraw the revealed patches
    revealedPatches.forEach(patch => {
        const [x, y] = patch.split(',').map(Number);
        drawPolygon(x, y);
        ctx.drawImage(image, x, y, PATCH_SIZE, PATCH_SIZE, x, y, PATCH_SIZE, PATCH_SIZE);
    });

    if (progress < 1) {
        requestAnimationFrame(revealImage); // Continue the reveal
    }
}

// Call setup to start the process
setup();
