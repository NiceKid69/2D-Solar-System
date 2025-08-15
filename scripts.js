// --- JavaScript Code (script.js) ---

        // Get the canvas and 2D context
        const canvas = document.getElementById('solarSystemCanvas');
        const ctx = canvas.getContext('2d');

        // Define simulation parameters
        let speedMultiplier = 1;
        let isPaused = false;
        let scale = 1;
        const orbitScale = 1; // Used to adjust orbit sizes

        // Define celestial objects with their properties
        const celestialObjects = {
            sun: {
                radius: 30,
                color: 'var(--sun-color)'
            },
            planets: [{
                name: 'Mercury',
                color: 'var(--mercury-color)',
                radius: 3,
                distance: 50,
                speed: 4.79
            }, {
                name: 'Venus',
                color: 'var(--venus-color)',
                radius: 6,
                distance: 75,
                speed: 3.50
            }, {
                name: 'Earth',
                color: 'var(--earth-color)',
                radius: 7,
                distance: 100,
                speed: 2.98,
                hasMoon: true,
                moon: {
                    radius: 2,
                    distance: 15,
                    color: 'var(--moon-color)',
                    speed: 1.02
                }
            }, {
                name: 'Mars',
                color: 'var(--mars-color)',
                radius: 4,
                distance: 150,
                speed: 2.41
            }, {
                name: 'Jupiter',
                color: 'var(--jupiter-color)',
                radius: 15,
                distance: 220,
                speed: 1.31
            }, {
                name: 'Saturn',
                color: 'var(--saturn-color)',
                radius: 12,
                distance: 280,
                speed: 0.97
            }, {
                name: 'Uranus',
                color: 'var(--uranus-color)',
                radius: 10,
                distance: 350,
                speed: 0.68
            }, {
                name: 'Neptune',
                color: 'var(--neptune-color)',
                radius: 10,
                distance: 420,
                speed: 0.54
            }],
            asteroidBelt: {
                minDistance: 170,
                maxDistance: 200,
                count: 300,
                color: 'var(--belt-color)'
            },
            kuiperBelt: {
                minDistance: 450,
                maxDistance: 500,
                count: 500,
                color: 'var(--belt-color)'
            }
        };

        // Initialize angles for each planet and the moon
        celestialObjects.planets.forEach(planet => {
            planet.angle = Math.random() * Math.PI * 2;
            if (planet.hasMoon) {
                planet.moon.angle = Math.random() * Math.PI * 2;
            }
        });

        /**
         * Resizes the canvas and recalculates the scale to fit the window.
         */
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Calculate scale based on the smaller dimension to ensure everything fits
            scale = Math.min(canvas.width, canvas.height) / 1000;
        }

        /**
         * Draws an object (sun, planet, or moon) on the canvas.
         * @param {number} x - The x-coordinate.
         * @param {number} y - The y-coordinate.
         * @param {number} radius - The radius of the object.
         * @param {string} color - The color of the object.
         */
        function drawObject(x, y, radius, color) {
            ctx.beginPath();
            ctx.arc(x, y, radius * scale, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }

        /**
         * Draws a line representing an orbit.
         * @param {number} distance - The distance from the center.
         * @param {string} color - The color of the orbit line.
         */
        function drawOrbit(distance, color) {
            ctx.beginPath();
            ctx.arc(0, 0, distance * orbitScale * scale, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.stroke();
        }

        /**
         * Draws the asteroid belt with multiple small particles.
         * @param {object} belt - The belt object with its properties.
         */
        function drawBelt(belt) {
            ctx.fillStyle = belt.color;
            for (let i = 0; i < belt.count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = belt.minDistance + (Math.random() * (belt.maxDistance - belt.minDistance));
                const x = Math.cos(angle) * distance * orbitScale * scale;
                const y = Math.sin(angle) * distance * orbitScale * scale;
                ctx.beginPath();
                ctx.arc(x, y, 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        /**
         * The main drawing function that renders all celestial objects.
         */
        function draw() {
            // Clear the canvas
            ctx.fillStyle = 'var(--bg-color)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Translate the canvas to the center for easier drawing
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);

            // Draw the Sun
            drawObject(0, 0, celestialObjects.sun.radius, celestialObjects.sun.color);

            // Draw planets, their orbits, and the moon
            celestialObjects.planets.forEach(planet => {
                // Draw planet orbit line
                drawOrbit(planet.distance, 'var(--orbit-color)');

                // Calculate planet position
                const planetX = Math.cos(planet.angle) * planet.distance * orbitScale * scale;
                const planetY = Math.sin(planet.angle) * planet.distance * orbitScale * scale;

                // Draw the planet
                drawObject(planetX, planetY, planet.radius, planet.color);

                // If the planet has a moon, draw its orbit and the moon itself
                if (planet.hasMoon) {
                    ctx.save();
                    ctx.translate(planetX, planetY);
                    
                    // Draw the moon orbit line
                    ctx.beginPath();
                    ctx.arc(0, 0, planet.moon.distance * scale, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                    ctx.stroke();

                    // Calculate moon position
                    const moonX = Math.cos(planet.moon.angle) * planet.moon.distance * scale;
                    const moonY = Math.sin(planet.moon.angle) * planet.moon.distance * scale;

                    // Draw the moon
                    drawObject(moonX, moonY, planet.moon.radius, planet.moon.color);

                    ctx.restore();
                }
            });

            // Draw the asteroid belt between Mars and Jupiter
            drawBelt(celestialObjects.asteroidBelt);

            // Draw the Kuiper belt at the outer edge
            drawBelt(celestialObjects.kuiperBelt);

            // Restore the canvas state
            ctx.restore();
        }

        /**
         * Updates the position of all celestial objects.
         */
        function update() {
            if (isPaused) return;

            // Update planet and moon angles
            celestialObjects.planets.forEach(planet => {
                planet.angle += (planet.speed / 1000) * speedMultiplier;
                if (planet.hasMoon) {
                    planet.moon.angle += (planet.moon.speed / 10) * speedMultiplier;
                }
            });
        }

        /**
         * The main animation loop.
         */
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }

        // Event listeners for controls
        const speedUpBtn = document.getElementById('speedUpBtn');
        const slowDownBtn = document.getElementById('slowDownBtn');
        const toggleBtn = document.getElementById('toggleBtn');

        speedUpBtn.addEventListener('click', () => {
            speedMultiplier = Math.min(speedMultiplier + 0.5, 3);
        });

        slowDownBtn.addEventListener('click', () => {
            speedMultiplier = Math.max(speedMultiplier - 0.5, 0);
        });

        toggleBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            toggleBtn.textContent = isPaused ? 'Resume' : 'Pause';
        });

        // Event listener for window resize
        window.addEventListener('resize', resizeCanvas);

        // Initial setup
        resizeCanvas();
        gameLoop();
