// Set up the canvas and drawing context
const canvas = document.getElementById('solarSystemCanvas');
const ctx = canvas.getContext('2d');
const loadingText = document.getElementById('loadingText');

// Set the canvas size to the full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Solar System constants and parameters
const CENTER_X = canvas.width / 2;
const CENTER_Y = canvas.height / 2;
const SCALE = Math.min(canvas.width, canvas.height) / 1000; // Scale factor for orbits
const ORBIT_LINE_COLOR = 'rgba(255, 255, 255, 0.1)';
const ASTEROID_COUNT = 1000;
const KUIPER_COUNT = 1000;

// Class to represent a celestial body
class CelestialBody {
    constructor(name, radius, color, orbitRadius, speed, initialAngle) {
        this.name = name;
        this.radius = radius * SCALE;
        this.color = color;
        this.orbitRadius = orbitRadius * SCALE;
        this.speed = speed;
        this.angle = initialAngle || Math.random() * Math.PI * 2;
        this.x = 0;
        this.y = 0;
    }

    // Update the body's position based on its speed
    update() {
        this.angle += this.speed;
        this.x = CENTER_X + this.orbitRadius * Math.cos(this.angle);
        this.y = CENTER_Y + this.orbitRadius * Math.sin(this.angle);
    }

    // Draw the body and its orbit
    draw() {
        // Draw the orbit path
        if (this.name !== 'Sun') {
            ctx.beginPath();
            ctx.arc(CENTER_X, CENTER_Y, this.orbitRadius, 0, Math.PI * 2);
            ctx.strokeStyle = ORBIT_LINE_COLOR;
            ctx.stroke();
        }

        // Draw the body itself
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Class to represent the Moon, which orbits a planet (Earth)
class Moon extends CelestialBody {
    constructor(name, radius, color, orbitRadius, speed, parent) {
        super(name, radius, color, orbitRadius, speed);
        this.parent = parent;
        this.x = 0;
        this.y = 0;
    }

    // Update the Moon's position relative to its parent planet
    update() {
        this.angle += this.speed;
        this.x = this.parent.x + this.orbitRadius * Math.cos(this.angle);
        this.y = this.parent.y + this.orbitRadius * Math.sin(this.angle);
    }

    // Draw the Moon and its orbit around the parent planet
    draw() {
        // Draw the orbit path around the parent planet
        ctx.beginPath();
        ctx.arc(this.parent.x, this.parent.y, this.orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();

        // Draw the moon
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Create all celestial bodies
const sun = {
    name: "Sun",
    radius: 50 * SCALE,
    color: '#ffbf00',
    x: CENTER_X,
    y: CENTER_Y,
    draw: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        // Add a glowing effect for the sun
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        glow.addColorStop(0, 'rgba(255, 204, 0, 0.8)');
        glow.addColorStop(0.5, 'rgba(255, 204, 0, 0.2)');
        glow.addColorStop(1, 'rgba(255, 204, 0, 0)');
        ctx.fillStyle = glow;
        ctx.fill();
    }
};

const planets = [
    new CelestialBody("Mercury", 5, '#A0A0A0', 100, 0.006),
    new CelestialBody("Venus", 8, '#E3A36C', 150, 0.0045),
    new CelestialBody("Earth", 9, '#4169E1', 200, 0.003),
    new CelestialBody("Mars", 6, '#E16C5A', 250, 0.0025),
    new CelestialBody("Jupiter", 15, '#E1A36C', 400, 0.0015),
    new CelestialBody("Saturn", 12, '#D3C3A3', 550, 0.001),
    new CelestialBody("Uranus", 10, '#ACE5EE', 700, 0.0007),
    new CelestialBody("Neptune", 10, '#4169E1', 850, 0.0005),
];

const earth = planets.find(p => p.name === "Earth");
const moon = new Moon("Moon", 3, '#D3D3D3', 25, 0.05, earth);

// Asteroid Belt: Many small bodies between Mars and Jupiter
const asteroids = [];
const asteroidMinOrbit = planets.find(p => p.name === "Mars").orbitRadius;
const asteroidMaxOrbit = planets.find(p => p.name === "Jupiter").orbitRadius;
for (let i = 0; i < ASTEROID_COUNT; i++) {
    const orbit = Math.random() * (asteroidMaxOrbit - asteroidMinOrbit) + asteroidMinOrbit;
    const speed = (0.003 / orbit) * 100;
    asteroids.push(new CelestialBody(`Asteroid ${i}`, 1, 'rgba(150, 150, 150, 0.5)', orbit, speed));
}

// Kuiper Belt: Icy bodies beyond Neptune
const kuiperBeltObjects = [];
const kuiperMinOrbit = planets.find(p => p.name === "Neptune").orbitRadius;
const kuiperMaxOrbit = kuiperMinOrbit + 150 * SCALE;
for (let i = 0; i < KUIPER_COUNT; i++) {
    const orbit = Math.random() * (kuiperMaxOrbit - kuiperMinOrbit) + kuiperMinOrbit;
    const speed = (0.003 / orbit) * 100;
    kuiperBeltObjects.push(new CelestialBody(`Kuiper ${i}`, 1, 'rgba(150, 200, 255, 0.5)', orbit, speed));
}

// Function to draw text labels for planets
function drawLabel(body) {
    ctx.fillStyle = 'white';
    ctx.font = `${10 * SCALE}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let labelX = body.x;
    let labelY = body.y - body.radius - 10;
    ctx.fillText(body.name, labelX, labelY);
}

// The main animation loop
function animate() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update all body positions
    planets.forEach(p => p.update());
    moon.update();
    asteroids.forEach(a => a.update());
    kuiperBeltObjects.forEach(k => k.update());

    // Draw all celestial bodies and their orbits
    sun.draw();
    planets.forEach(p => p.draw());
    moon.draw();
    asteroids.forEach(a => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fillStyle = a.color;
        ctx.fill();
    });
    kuiperBeltObjects.forEach(k => {
        ctx.beginPath();
        ctx.arc(k.x, k.y, k.radius, 0, Math.PI * 2);
        ctx.fillStyle = k.color;
        ctx.fill();
    });

    // Draw labels for the major planets
    planets.forEach(p => drawLabel(p));
    
    // Loop the animation
    requestAnimationFrame(animate);
}

// Start the animation when the window loads
window.onload = function() {
    loadingText.style.display = 'none'; // Hide loading text
    animate();
};

// Handle window resizing to make it responsive
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // The scaling and centering variables are already responsive,
    // so the animation will adapt automatically.
});
