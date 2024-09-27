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
    image = await loadImage('images/sg_shell.jpg');
    
    canvas.width = image.width;
    canvas.height = image.height;
    document.body.appendChild(canvas);
    
    maskCanvas.width = image.width;
    maskCanvas.height = image.height;
    
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    startTime = Date.now();
    revealImage();
}

function revealImage() {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / REVEAL_DURATION, 1);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    
    // Create a radial gradient for smooth reveal
    const gradient = maskCtx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * progress
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    
    maskCtx.fillStyle = gradient;
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(maskCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    
    if (progress < 1) {
        requestAnimationFrame(revealImage);
    }
}

setup();
