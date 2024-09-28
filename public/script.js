let image;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const REVEAL_DURATION = 60 * 1000; // 1 minute in milliseconds
let startTime;
const PATCH_COUNT = 100; // Number of patches to reveal

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
    
    // Clear the canvas and draw the image
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(image, 0, 0); // Draw the image first

    // Calculate the number of patches to reveal based on progress
    const patchesToReveal = Math.floor(PATCH_COUNT * progress);

    // Randomly reveal patches
    for (let i = 0; i < patchesToReveal; i++) {
        const x = Math.random() * canvas.width; // Random x position
        const y = Math.random() * canvas.height; // Random y position
        const patchSize = 50; // Size of each patch

        // Draw the image in the patch area
        ctx.drawImage(image, x, y, patchSize, patchSize, x, y, patchSize, patchSize);
    }

    if (progress < 1) {
        requestAnimationFrame(revealImage); // Continue the reveal
    }
}

// Call setup to start the process
setup();
