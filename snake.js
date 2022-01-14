class Snake {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.tail = [{ x: this.x, y: this.y }];
        this.rotateX = 1;
        this.rotateY = 0;
    }
    move() {
        this.x = this.tail[this.tail.length - 1].x + this.rotateX * this.size;
        this.y = this.tail[this.tail.length - 1].y + this.rotateY * this.size;
        this.tail.push({
            x: this.x,
            y: this.y
        });
        this.tail.shift();
    }
}

class Food {
    constructor() {
        while (true) {
            let isTouching = false;
            this.x = snake.size * Math.floor(Math.random() * width / snake.size);
            this.y = snake.size * Math.floor(Math.random() * height / snake.size);
            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
                    isTouching = true;
                    break;
                }
            }
            if (!isTouching)
                break;
        }
    }
}

const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const FPS = 15;

let snake = new Snake(0, 0, 20);
let food = new Food();

let alive = true;
let hasTurned = false;

window.onload = () => {
    setInterval(show, 1000 / FPS);
}

window.addEventListener("keydown", (e) => {
    if (hasTurned)
        return;
    const key = e.key;
    if (key == "ArrowLeft" && snake.rotateX == 0) {
        snake.rotateX = -1;
        snake.rotateY = 0;
        hasTurned = true;
    }
    else if (key == "ArrowUp" && snake.rotateY == 0) {
        snake.rotateX = 0;
        snake.rotateY = -1;
        hasTurned = true;
    }
    else if (key == "ArrowRight" && snake.rotateX == 0) {
        snake.rotateX = 1;
        snake.rotateY = 0;
        hasTurned = true;
    }
    else if (key == "ArrowDown" && snake.rotateY == 0) {
        snake.rotateX = 0;
        snake.rotateY = 1;
        hasTurned = true;
    }
})

function show() {
    if (!alive)
        return;
    update();
    draw();
}

function update() {
    hasTurned = false;
    snake.move();
    checkHitTail();
    checkHitWall();
    eatFood();
}

function checkHitTail() {
    for (let i = 0; i < snake.tail.length - 1; i++) {
        if (snake.x == snake.tail[i].x && snake.y == snake.tail[i].y && snake.x != food.x && snake.y != food.y) {
            alive = false;
        }
    }
}

function checkHitWall() {
    let head = snake.tail[snake.tail.length - 1];
    if (snake.x >= width) {
        snake.x = 0;
    }
    if (snake.y >= height) {
        snake.y = 0;
    }
    if (snake.x < 0) {
        snake.x = width;
    }
    if (snake.y < 0) {
        snake.y = height;
    }
    head.x = snake.x;
    head.y = snake.y;
}

function eatFood() {
    if (snake.x == food.x && snake.y == food.y) {
        snake.tail.push({
            x: food.x,
            y: food.y
        })
        food = new Food();
    }
}

function draw() {
    rect(0, 0, width, height, "black");
    rect(food.x, food.y, snake.size - 2, snake.size - 2, "red");
    for (let i = 0; i < snake.tail.length; i++) {
        rect(snake.tail[i].x, snake.tail[i].y, snake.size - 2, snake.size - 2, "lightgreen");
    }
    canvasContext.font = "20px Arial";
    canvasContext.fillStyle = "cyan";
    canvasContext.fillText("Score: " + (snake.tail.length - 1), 0, 20);
}

function rect(x, y, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}
