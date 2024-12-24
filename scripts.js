document.addEventListener('DOMContentLoaded', () => {
    const planets = document.querySelectorAll('.planet');
    const tooltip = document.getElementById('tooltip');

    planets.forEach(planet => {
        planet.addEventListener('mouseover', (e) => {
            const info = e.target.getAttribute('data-info');
            tooltip.textContent = info;
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        planet.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        planet.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });
    });
});
