let image, mask;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const maskCanvas = document.createElement('canvas');
const maskCtx = maskCanvas.getContext('2d');

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function setup() {
    // Load the image
    image = await loadImage('images/sg_shell.jpg');
    
    // Set up the main canvas
    canvas.width = image.width;
    canvas.height = image.height;
    document.body.appendChild(canvas);
    
    // Set up the mask canvas
    maskCanvas.width = image.width;
    maskCanvas.height = image.height;
    
    // Initialize the mask as fully opaque (hidden)
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    // Start the reveal process
    revealImage();
}

function revealImage() {
    // Clear the main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image
    ctx.drawImage(image, 0, 0);
    
    // Apply the mask
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(maskCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    
    // Update the mask (example: reveal a random 50x50 square)
    const x = Math.random() * (maskCanvas.width - 50);
    const y = Math.random() * (maskCanvas.height - 50);
    maskCtx.clearRect(x, y, 50, 50);
    
    // Schedule the next reveal
    setTimeout(revealImage, 1000); // Reveal every second
}

// Start the process
setup();
