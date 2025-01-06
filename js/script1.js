// Game constants 
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music_food.mp3');
const gameOver = new Audio('music_gameover.mp3');
const move = new Audio('music_move.mp3');
const music = new Audio('music_music.mp3');
let speed = 8;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 5, y: 6 };

// Get scoreBox and board elements from the DOM
const scoreBox = document.getElementById('scoreBox');
const hiscoreBox = document.getElementById('hiscoreBox');
const board = document.getElementById('board');

// Update high score display initially
hiscoreBox.innerHTML = "High Score: " + hiscore;

// Game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself, game over
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you hit the wall, game over
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array & food
    if (isCollide(snakeArr)) {
        gameOver.play();
        music.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Your score: " + score);

        // Update high score if necessary
        if (score > highScore) {
            hiscore = score;
            localStorage.setItem("highScore", hiscore);
            hiscoreBox.innerHTML = "High Score: " + hiscore;
        }

        // Reset game state
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
        music.play();
        return;
    }

    // If you eat the food, increment the score & regenerate the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2, b = 16;
        food = { 
            x: Math.round(a + (b - a) * Math.random()), 
            y: Math.round(a + (b - a) * Math.random()) 
        };
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and food
    // Display snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 }; // Start the game
    move.play();
    switch (e.key) {
        case 'ArrowUp':
            if (inputDir.y !== 1) {
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;
        case 'ArrowDown':
            if (inputDir.y !== -1) {
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;
        case 'ArrowLeft':
            if (inputDir.x !== 1) {
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;
        case 'ArrowRight':
            if (inputDir.x !== -1) {
                inputDir.x = 1;
                inputDir.y = 0;
            }
            break;
    }
});
