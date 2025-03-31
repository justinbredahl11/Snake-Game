const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "";
let food = { 
    x: Math.floor(Math.random() * (canvas.width / box)) * box, 
    y: Math.floor(Math.random() * (canvas.height / box)) * box 
};
let score = 0;
let gameStarted = false;
let gameOver = false;

// Draw snake
function drawSnake() {
    ctx.fillStyle = "lime";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, box, box);
    });
}

// Draw food
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

// Move the snake
function moveSnake() {
    if (!gameStarted || gameOver) return; // Stop movement when game over

    let head = { ...snake[0] };
    
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // Check for collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || 
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { 
            x: Math.floor(Math.random() * (canvas.width / box)) * box, 
            y: Math.floor(Math.random() * (canvas.height / box)) * box 
        };
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

// End game
function endGame() {
    gameOver = true;

    // Display "Game Over" and Score
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 60, canvas.height / 2 - 20);
    ctx.fillText("Final Score: " + score, canvas.width / 2 - 70, canvas.height / 2 + 10);

    createButtons();
}

// Create Restart and Quit buttons
function createButtons() {
    let restartBtn = document.createElement("button");
    restartBtn.innerText = "Restart";
    restartBtn.style.position = "absolute";
    restartBtn.style.top = "60%";
    restartBtn.style.left = "50%";
    restartBtn.style.transform = "translate(-50%, -50%)";
    restartBtn.style.padding = "10px 20px";
    restartBtn.style.fontSize = "18px";
    restartBtn.style.backgroundColor = "#4CAF50";
    restartBtn.style.color = "white";
    restartBtn.style.border = "none";
    restartBtn.style.cursor = "pointer";
    document.body.appendChild(restartBtn);
    restartBtn.addEventListener("click", () => {
        location.reload();
    });

    let quitBtn = document.createElement("button");
    quitBtn.innerText = "Quit";
    quitBtn.style.position = "absolute";
    quitBtn.style.top = "70%";
    quitBtn.style.left = "50%";
    quitBtn.style.transform = "translate(-50%, -50%)";
    quitBtn.style.padding = "10px 20px";
    quitBtn.style.fontSize = "18px";
    quitBtn.style.backgroundColor = "#f44336";
    quitBtn.style.color = "white";
    quitBtn.style.border = "none";
    quitBtn.style.cursor = "pointer";
    document.body.appendChild(quitBtn);
    quitBtn.addEventListener("click", () => {
        window.location.href = "index.html"; // Change this if needed
    });
}

// Start game on key press
let nextDirection = ""; // Stores the latest direction input

document.addEventListener("keydown", (event) => {
    if (!gameStarted) {
        gameStarted = true;
    }

    let key = event.key.toLowerCase(); // Normalize case
    if (["w", "arrowup"].includes(key)) nextDirection = "UP";
    if (["s", "arrowdown"].includes(key)) nextDirection = "DOWN";
    if (["a", "arrowleft"].includes(key)) nextDirection = "LEFT";
    if (["d", "arrowright"].includes(key)) nextDirection = "RIGHT";
});

function moveSnake() {
    if (!gameStarted || gameOver) return;

    // Only change direction if it's different
    if (nextDirection && nextDirection !== direction) {
        direction = nextDirection;
    }

    let head = { ...snake[0] };

    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // Prevent instant self-collision by ignoring invalid moves
    if (snake.length > 1 && head.x === snake[1].x && head.y === snake[1].y) {
        return;
    }

    // Check for collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { 
            x: Math.floor(Math.random() * (canvas.width / box)) * box, 
            y: Math.floor(Math.random() * (canvas.height / box)) * box 
        };
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

// Update game loop
function update() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        moveSnake();
        drawSnake();
    }
}

// Run game loop every 100ms
setInterval(update, 100);
