let image;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const REVEAL_DURATION = 60 * 1000; // 1 minute in milliseconds
const NUM_SITES = 100; // Number of Voronoi sites (cells)
let sites = [];
let revealedCells = new Set(); // Track revealed cells
let startTime;
let voronoiCells = [];

// Load the image as before
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Set up the canvas and start the reveal process
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
    voronoiCells = computeVoronoiCells(delaunay, sites);
}

// Compute the Voronoi cells using Delaunator
function computeVoronoiCells(delaunay, points) {
    const voronoi = [];
    const halfedges = delaunay.halfedges;
    const triangles = delaunay.triangles;

    for (let e = 0; e < triangles.length; e++) {
        const i = triangles[e];
        const j = triangles[halfedges[e]];
        if (i > j) continue;
        const cell = [points[i], points[j]];
        voronoi.push(cell);
    }
    
    return voronoi;
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
            revealVoronoiCell(voronoiCells[cellIndex]);
        }
    }

    // Continue the reveal process until the image is fully revealed
    if (progress < 1) {
        requestAnimationFrame(revealImage); // Continue the reveal
    }
}

// Reveal a single Voronoi cell by clipping to its region and drawing the corresponding part of the image
function revealVoronoiCell(cell) {
    ctx.save();
    ctx.beginPath();
    
    // Draw the Voronoi cell by moving between its vertices
    ctx.moveTo(cell[0][0], cell[0][1]);
    for (let i = 1; i < cell.length; i++) {
        ctx.lineTo(cell[i][0], cell[i][1]);
    }
    ctx.closePath();
    
    // Clip to the Voronoi cell and draw that part of the image
    ctx.clip();
    ctx.drawImage(image, 0, 0);
    ctx.restore();
}

// Wait for the DOM to be fully loaded before running the setup
document.addEventListener('DOMContentLoaded', setup);