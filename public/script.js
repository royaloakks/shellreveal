let image; // This will be your sg_port_lo.png image
let maskImage; // Declare a variable for the mask image
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const REVEAL_DURATION = 60 * 1000; // 1 minute in milliseconds
const NUM_SITES = 100; // Number of Voronoi sites (cells)
let sites = [];
let revealedCells = new Set(); // Track revealed cells
let startTime;
let voronoiDiagram = [];

// Load the images
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (error) => {
            console.error(`Failed to load image: ${src}`, error);
            reject(error);
        };
        img.src = src;
    });
}

// Set up the canvas and start the reveal process
async function setup() {
    console.log('Setup started');
    try {
        image = await loadImage('images/sg_port_lo.png'); // Load the main image
        maskImage = await loadImage('images/sg_back_lo.jpg'); // Load the mask image
        console.log('Images loaded', image.width, image.height);
    } catch (error) {
        console.error('Error loading images:', error);
        return; // Exit if images fail to load
    }
    
    // Set canvas dimensions for the mask image
    canvas.width = window.innerWidth; // Full width of the viewport
    canvas.height = (canvas.width * (image.height / image.width)); // Maintain aspect ratio for the height
    document.body.appendChild(canvas); // Append the canvas to the body

    // Disable anti-aliasing to prevent edge issues
    ctx.imageSmoothingEnabled = false;

    // Draw the mask image on the canvas
    ctx.drawImage(maskImage, 0, 0, canvas.width, canvas.height); // Draw the mask image

    // Generate random Voronoi sites and cells
    generateVoronoiSites();

    // Start the timer
    startTime = Date.now(); 
    console.log('Starting Voronoi reveal');

    // Start the reveal process
    revealImage();
}

// Generate Voronoi sites (random points) and compute the Voronoi diagram
function generateVoronoiSites() {
    // Generate random points (Voronoi sites)
    sites = [];
    for (let i = 0; i < NUM_SITES; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        sites.push([x, y]);
    }
    
    // Compute Voronoi cells using Delaunator
    const delaunay = Delaunator.from(sites);
    voronoiDiagram = computeVoronoiDiagram(delaunay, sites);
}

// Compute Voronoi cells using Delaunator
function computeVoronoiDiagram(delaunay, points) {
    const voronoiCells = [];
    const triangles = delaunay.triangles;

    for (let i = 0; i < triangles.length; i += 3) {
        const triangle = [triangles[i], triangles[i + 1], triangles[i + 2]];
        const cell = [];
        triangle.forEach(pointIndex => {
            cell.push(points[pointIndex]);
        });
        voronoiCells.push(cell);
    }
    
    return voronoiCells;
}

// Reveal the image gradually using the Voronoi pattern
function revealImage() {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / REVEAL_DURATION, 1); // Calculate progress

    // Calculate how many Voronoi cells should be revealed at this point
    const cellsToReveal = Math.floor(NUM_SITES * progress);

    // Reveal new cells as needed
    while (revealedCells.size < cellsToReveal) {
        const cellIndex = Math.floor(Math.random() * NUM_SITES);
        if (!revealedCells.has(cellIndex)) {
            revealedCells.add(cellIndex);
            revealVoronoiCell(voronoiDiagram[cellIndex]);
        }
    }

    console.log(`Revealed ${revealedCells.size} cells out of ${NUM_SITES}`);

    // Continue the reveal process until the image is fully revealed
    if (progress < 1) {
        requestAnimationFrame(revealImage); // Continue the reveal
    } else {
        console.log('Reveal complete!'); // Log when the reveal is complete
    }
}

// Reveal a single Voronoi cell by clipping to its region and drawing the corresponding part of the image
function revealVoronoiCell(cell) {
    ctx.save();
    ctx.beginPath();
    
    // Calculate the center of the cell to expand it slightly
    const centerX = cell.reduce((sum, point) => sum + point[0], 0) / cell.length;
    const centerY = cell.reduce((sum, point) => sum + point[1], 0) / cell.length;
    
    const expansion = 1; // Increased expansion to 1px to overlap more

    // Start at the first point, with expansion
    ctx.moveTo(cell[0][0] + expansion * (cell[0][0] - centerX), cell[0][1] + expansion * (cell[0][1] - centerY));
    
    // Loop through the remaining points, expanding them slightly
    for (let i = 1; i < cell.length; i++) {
        ctx.lineTo(cell[i][0] + expansion * (cell[i][0] - centerX), cell[i][1] + expansion * (cell[i][1] - centerY));
    }
    
    ctx.closePath();
    
    // Clip to the expanded Voronoi cell and draw the corresponding part of the image
    ctx.clip();
    
    // Calculate the position to center the image
    const revealWidth = 800; // Set desired width for the reveal image
    const revealHeight = (revealWidth * (image.height / image.width)); // Maintain aspect ratio
    const xOffset = (canvas.width - revealWidth) / 2; // Center the image horizontally

    ctx.drawImage(image, xOffset, (canvas.height - revealHeight) / 2, revealWidth, revealHeight); // Draw the main image
    ctx.restore();
}

// Wait for the DOM to be fully loaded before running the setup
document.addEventListener('DOMContentLoaded', setup);