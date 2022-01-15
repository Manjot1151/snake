class Snake {
    constructor(size) {
        this.alive = true;
        this.x = size * Math.floor(Math.random() * width / size);
        this.y = size * Math.floor(Math.random() * width / size);
        this.size = size;
        this.tail = [{ x: this.x, y: this.y }];
        this.rotate = { x: 0, y: 0 };
        this.turnQueue = [];
        this.hasTurned = false;

        let randomTurn = [this.turnLeft, this.turnUp, this.turnRight, this.turnDown];
        randomTurn[Math.floor(Math.random() * randomTurn.length)].bind(this)();
    }
    move() {
        this.hasTurned = false;
        this.x = this.tail[this.tail.length - 1].x + this.rotate.x * this.size;
        this.y = this.tail[this.tail.length - 1].y + this.rotate.y * this.size;
        this.tail.push({
            x: this.x,
            y: this.y
        });
        this.tail.shift();
        if (this.turnQueue.length != 0) {
            this.turnQueue.shift().bind(this)();
        }
    }
    turnLeft() {
        if (this.hasTurned) {
            this.turnQueue.push(this.turnLeft);
            return;
        }
        this.rotate = { x: -1, y: 0 };
        this.hasTurned = true;
    }
    turnUp() {
        if (this.hasTurned) {
            this.turnQueue.push(this.turnUp);
            return;
        }
        this.rotate = { x: 0, y: -1 };
        this.hasTurned = true;
    }
    turnRight() {
        if (this.hasTurned) {
            this.turnQueue.push(this.turnRight);
            return;
        }
        this.rotate = { x: 1, y: 0 };
        this.hasTurned = true;
    }
    turnDown() {
        if (this.hasTurned) {
            this.turnQueue.push(this.turnDown);
            return;
        }
        this.rotate = { x: 0, y: 1 };
        this.hasTurned = true;
    }
}

class Food {
    constructor() {
        if (snake.tail.length == width / snake.size * height / snake.size) {
            this.x = -1000;
            this.y = -1000;
            return;
        }
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

const leftKey = ["a", "ArrowLeft"];
const upKey = ["w", "ArrowUp"];
const rightKey = ["d", "ArrowRight"];
const downKey = ["s", "ArrowDown"];
const restartKey = ["r"];

let snake = new Snake(20);
let food = new Food();

window.onload = () => {
    setInterval(show, 1000 / FPS);
}

window.addEventListener("keydown", (e) => {
    const key = e.key;
    if (leftKey.includes(key) && snake.rotate.x == 0) {
        snake.turnLeft();
    }
    else if (upKey.includes(key) && snake.rotate.y == 0) {
        snake.turnUp();
    }
    else if (rightKey.includes(key) && snake.rotate.x == 0) {
        snake.turnRight();
    }
    else if (downKey.includes(key) && snake.rotate.y == 0) {
        snake.turnDown();
    }
    else if (restartKey.includes(key)) {
        restart();
    }
})

function show() {
    if (!snake.alive)
        return;
    update();
    draw();
}

function update() {
    snake.move();
    checkHitWall();
    checkHitTail();
    eatFood();
}

function checkHitTail() {
    for (let i = 0; i < snake.tail.length - 1; i++) {
        if (snake.x == snake.tail[i].x && snake.y == snake.tail[i].y && snake.x != food.x && snake.y != food.y) {
            snake.alive = false;
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
        snake.x = width - snake.size;
    }
    if (snake.y < 0) {
        snake.y = height - snake.size;
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
    for (let i = 0; i < snake.tail.length - 1; i++) {
        rect(snake.tail[i].x, snake.tail[i].y, snake.size - 2, snake.size - 2, "lightgreen");
    }
    let head = snake.tail[snake.tail.length - 1];
    rect(head.x, head.y, snake.size - 2, snake.size - 2, "#60e35a")
    canvasContext.font = "20px Arial";
    canvasContext.fillStyle = "cyan";
    canvasContext.fillText("Score: " + (snake.tail.length - 1), 0, 20);
}

function rect(x, y, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

function restart() {
    snake = new Snake(20);
    food = new Food();
}
