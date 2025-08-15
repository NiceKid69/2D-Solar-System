body {
    margin: 0;
    overflow: hidden;
    background-color: #0d0d1a;
    font-family: 'Arial', sans-serif;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

#solarSystemCanvas {
    background-color: transparent;
    border-radius: 10px;
    box-shadow: 0 0 50px rgba(255, 255, 255, 0.05);
}

.loading-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: #ccc;
}

.label {
    position: absolute;
    font-size: 0.8em;
    text-shadow: 0 0 5px black;
    pointer-events: none;
}
