/*
 * script.js
 * This file contains the JavaScript logic for the 2D solar system simulation.
 */

// Get the canvas and its 2D rendering context
const canvas = document.getElementById('solar-system-canvas');
const ctx = canvas.getContext('2d');

// Global variables for canvas dimensions and scale
let canvasWidth, canvasHeight;
let scale;
let animationFrameId;

// Class to define a celestial object (planet, moon, or sun)
class CelestialObject {
    constructor(name, radius, distance, color, speed) {
        this.name = name;
        this.radius = radius;
        this.distance = distance;
        this.color = color;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2; // Start at a random angle
        this.x = 0;
        this.y = 0;
    }

    // Update the position of the object
    update(deltaTime) {
        this.angle += this.speed * deltaTime;
        const orbitRadius = this.distance * scale;
        this.x = Math.cos(this.angle) * orbitRadius;
        this.y = Math.sin(this.angle) * orbitRadius;
    }

    // Draw the object on the canvas
    draw(parentX, parentY) {
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2); // Center of the canvas
        ctx.translate(parentX, parentY);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
    }
}

// Function to generate and draw a belt of objects (e.g., asteroids, Kuiper Belt)
function drawBelt(minDist, maxDist, count, color) {
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (maxDist - minDist) + minDist;
        const x = Math.cos(angle) * (dist * scale);
        const y = Math.sin(angle) * (dist * scale);

        ctx.beginPath();
        ctx.arc(x, y, 0.5 * scale, 0, Math.PI * 2); // Tiny circles for asteroids
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    ctx.restore();
}

// Define the celestial objects with their properties
// Distances are in arbitrary units, speeds are relative to orbital periods
const sun = new CelestialObject('Sun', 20, 0, '#FFC300', 0);
const planets = [
    new CelestialObject('Mercury', 3, 40, '#B3A19C', 0.05),
    new CelestialObject('Venus', 4, 60, '#E6D8A9', 0.03),
    new CelestialObject('Earth', 5, 85, '#2D729C', 0.02),
    new CelestialObject('Mars', 4, 110, '#C1440E', 0.015),
    new CelestialObject('Jupiter', 15, 180, '#C78F56', 0.008),
    new CelestialObject('Saturn', 12, 250, '#E0BF9C', 0.005),
    new CelestialObject('Uranus', 10, 320, '#A7B7BB', 0.003),
    new CelestialObject('Neptune', 10, 380, '#4A5087', 0.002)
];
const moon = new CelestialObject('Moon', 2, 10, '#888888', 0.2); // Relative to Earth

let lastTime = 0;

// The main animation loop
function animate(currentTime) {
    // Calculate the time elapsed since the last frame
    const deltaTime = (currentTime - lastTime) / 1000; // in seconds
    lastTime = currentTime;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw the sun at the center
    sun.draw(0, 0);

    // Update and draw the asteroid belt
    drawBelt(120, 160, 500, '#6B543F'); // Asteroid belt between Mars and Jupiter

    // Update and draw each planet
    planets.forEach(planet => {
        planet.update(deltaTime);
        planet.draw(0, 0);
        
        // If the planet is Earth, draw its moon
        if (planet.name === 'Earth') {
            moon.update(deltaTime * 10); // Moon orbits faster
            moon.draw(planet.x, planet.y);
        }
    });
    
    // Draw the Kuiper Belt (further out, less dense)
    drawBelt(400, 450, 300, '#424242');

    // Request the next animation frame
    animationFrameId = requestAnimationFrame(animate);
}

// Function to resize the canvas and recalculate the scale
function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Calculate a new scale based on the smaller of the two dimensions
    scale = Math.min(canvasWidth, canvasHeight) / 800;
    
    // Restart the animation loop to apply the new scale
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animate(0); // Pass 0 to reset deltaTime for the new loop
}

// Initial setup and event listeners
window.onload = resizeCanvas;
window.onresize = resizeCanvas;
