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
    let maskOpacity = 1; // Start fully opaque
    const interval = setInterval(() => {
        if (maskOpacity > 0) {
            maskOpacity -= 0.01; // Decrease opacity
            mask.style.opacity = maskOpacity; // Update mask opacity
        } else {
            clearInterval(interval); // Stop when fully revealed
        }
    }, 600); // Adjust timing as needed
}

// Call setup to start the process
setup();
