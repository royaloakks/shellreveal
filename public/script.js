let image;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const REVEAL_DURATION = 60 * 1000; // 1 minute in milliseconds
let startTime;
const PATCH_COUNT = 100; // Total number of patches
const PATCH_SIZE = 50; // Size of each patch
const revealedPatches = new Set(); // Track revealed patches
const PATCHES_PER_FRAME = 5; // Number of patches to reveal per frame

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
    
    startTime = Date.now(); // Start the timer
    console.log('Starting reveal');
    revealImage(); // Start the reveal process
}

function revealImage() {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / REVEAL_DURATION, 1); // Calculate progress

    console.log('Reveal progress:', progress);
    
    // Calculate the total number of patches to reveal based on progress
    const totalPatchesToReveal = Math.floor(PATCH_COUNT * progress);

    // Randomly reveal patches
    while (revealedPatches.size < totalPatchesToReveal) {
        for (let i = 0; i < PATCHES_PER_FRAME; i++) {
            const x = Math.floor(Math.random() * (canvas.width / PATCH_SIZE)) * PATCH_SIZE; // Random x position
            const y = Math.floor(Math.random() * (canvas.height / PATCH_SIZE)) * PATCH_SIZE; // Random y position

            // Ensure we only reveal unique patches
            const patchKey = `${x},${y}`;
            if (!revealedPatches.has(patchKey)) {
                revealedPatches.add(patchKey);
                // Draw the image in the patch area
                ctx.drawImage(image, x, y, PATCH_SIZE, PATCH_SIZE, x, y, PATCH_SIZE, PATCH_SIZE);
            }
        }
    }

    // Clear the canvas and redraw the revealed patches
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with white to mask

    // Redraw the revealed patches
    revealedPatches.forEach(patch => {
        const [x, y] = patch.split(',').map(Number);
        ctx.drawImage(image, x, y, PATCH_SIZE, PATCH_SIZE, x, y, PATCH_SIZE, PATCH_SIZE);
    });

    if (progress < 1) {
        requestAnimationFrame(revealImage); // Continue the reveal
    }
}

// Call setup to start the process
setup();
