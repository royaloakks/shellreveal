let image, mask;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const maskCanvas = document.createElement('canvas');
const maskCtx = maskCanvas.getContext('2d');

const REVEAL_DURATION = 60 * 1000; // 1 minute in milliseconds
const REVEAL_INTERVAL = 50; // Update every 50ms for smoother animation
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
    image = await loadImage('images/sg_shell.jpg');
    console.log('Image loaded', image.width, image.height);
    
    // Set canvas dimensions
    canvas.width = image.width;
    canvas.height = image.height;
    document.body.appendChild(canvas);
    
    maskCanvas.width = image.width;
    maskCanvas.height = image.height;
    
    // Initialize mask
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    startTime = Date.now(); // Start the timer
    console.log('Starting reveal');
    revealImage(); // Start the reveal process
}

function revealImage() {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / REVEAL_DURATION, 1); // Calculate progress

    console.log('Reveal progress:', progress);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(image, 0, 0); // Draw the image
    
    // Create a radial gradient for smooth reveal
    const gradient = maskCtx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * progress
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); // Transparent at the center
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)'); // Opaque at the edges
    
    maskCtx.fillStyle = gradient; // Apply the gradient to the mask
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height); // Fill the mask with the gradient
    
    ctx.globalCompositeOperation = 'destination-in'; // Set composite operation to mask
    ctx.drawImage(maskCanvas, 0, 0); // Apply the mask
    ctx.globalCompositeOperation = 'source-over'; // Reset composite operation
    
    if (progress < 1) {
        requestAnimationFrame(revealImage); // Continue the reveal
    }
}

// Call setup to start the process
setup();
