let image;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const REVEAL_DURATION = 60 * 1000; // 1 minute in milliseconds
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
    document.body.appendChild(canvas); // Append the canvas to the body
    
    startTime = Date.now(); // Start the timer
    console.log('Starting reveal');
    revealImage(); // Start the reveal process
}

function revealImage() {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / REVEAL_DURATION, 1); // Calculate progress

    console.log('Reveal progress:', progress);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the image first
    ctx.drawImage(image, 0, 0); 

    // Create a mask that starts fully opaque (white) and becomes transparent
    ctx.globalCompositeOperation = 'destination-out'; // Set composite operation to remove the mask
    ctx.fillStyle = `rgba(255, 255, 255, ${progress})`; // Gradually increase opacity (white)
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Apply the mask

    ctx.globalCompositeOperation = 'source-over'; // Reset composite operation

    if (progress < 1) {
        requestAnimationFrame(revealImage); // Continue the reveal
    }
}

// Call setup to start the process
setup();
