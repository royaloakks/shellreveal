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
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = 'path/to/your/image.jpg'; // Update with your image path

    image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-out'; // Change to 'destination-out' for masking

        let startTime = null;
        const duration = 60000; // 1 minute

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Calculate the opacity based on elapsed time
            const opacity = Math.min(elapsed / duration, 1);
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`; // Gradually increase opacity

            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (elapsed < duration) {
                requestAnimationFrame(animate);
            } else {
                ctx.globalCompositeOperation = 'source-over'; // Reset to default
            }
        }

        requestAnimationFrame(animate);
    };
}

// Call setup to start the process
setup();
