const imageSections = [
    'section1.jpg',
    'section2.jpg',
    'section3.jpg',
    'section4.jpg',
    'section5.jpg',
    'section6.jpg',
    'section7.jpg'
];

const startDate = new Date('2023-05-01'); // Replace with your start date
const revealInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getCurrentSection() {
    const now = new Date();
    const daysPassed = Math.floor((now - startDate) / revealInterval);
    return Math.min(daysPassed, imageSections.length - 1);
}

function revealImage() {
    const container = document.getElementById('image-container');
    const currentSection = getCurrentSection();

    for (let i = 0; i <= currentSection; i++) {
        const img = document.createElement('img');
        img.src = imageSections[i];
        img.classList.add('image-section');
        img.style.zIndex = i;
        img.style.opacity = 1;
        container.appendChild(img);
    }
}

revealImage();
