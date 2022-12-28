WINDOW_WIDTH = 1024
WINDOW_HEIGHT = 576

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = WINDOW_WIDTH
canvas.height = WINDOW_HEIGHT
// background color
function windowFill(color) {
    c.fillStyle = color
    c.fillRect(0, 0, canvas.width, canvas.height)
}
// making a function to draw any colored rect
function rect(x, y, w, h, color) {
    c.fillStyle = color
    c.fillRect(x, y, w, h,)
}

class Ball {
    constructor(x, y, w, h, color) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = color

        this.velocity = { x: 8, y: 12 }
        this.initialX = x
        this.initialY = y
        this.score1 = 0
        this.score2 = 0
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.x, this.y, this.w, this.h)
    }

    update() {
        // ball movement
        this.x += this.velocity.x
        this.y += this.velocity.y

        //preventing the ball from going out of bounds up and down
        if (this.y > (WINDOW_HEIGHT - this.h)) this.changeY()
        else if (this.y < 0) this.changeY()

        //what happens when the ball goes out of x bounds
        if (this.x > WINDOW_WIDTH + 276) {
            this.score1 += 1
            this.x = this.initialX
            this.changeX()
        }
        else if (this.x < -300) {
            this.score2 += 1
            this.x = this.initialX
            this.changeX()
        }
    }
    // square collision function
    collidesWith(other_body) {
        if (this.x + this.w < other_body.x || this.x > other_body.x + other_body.w) return false
        else if (this.y + this.h < other_body.y || this.y > other_body.y + other_body.h) return false
        else return true
    }

    changeX() { this.velocity.x *= -1 }
    changeY() { this.velocity.y *= -1 }

    blit() {
        this.draw()
        this.update()
    }
}

class Paddle {
    constructor(x, y, w, h, color) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = color
        this.speed = 0
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.x, this.y, this.w, this.h)
    }

    update() {
        // movement
        this.y += this.speed

        // preventing paddles from going out of bounds
        if ((this.y + this.h) > WINDOW_HEIGHT) {
            this.y = WINDOW_HEIGHT - this.h
        } 
        else if (this.y < 0) { this.y = 0 }
    }

    blit() {
        this.draw()
        this.update()
    }
}

const keys = {
    up: { pressed: false },
    down: { pressed: false }
}


ball = new Ball(512, 20, 20, 20, "white")
paddle1 = new Paddle(10, WINDOW_HEIGHT / 2, 12, 100, "red")
paddle2 = new Paddle(WINDOW_WIDTH - 22, WINDOW_HEIGHT / 2, 12, 100, "purple")

const choices = ["y", "n", "y", "n", "y", "n", "y", "n", "y", "y"]
let randomIndex = 0
let randomChoice = ""

function animate() {
    window.requestAnimationFrame(animate)

    // paddle movement
    paddle1.speed = 0
    if (keys.up.pressed) paddle1.speed = -20
    else if (keys.down.pressed) paddle1.speed = 20

    // AI movement
    paddle2.speed = 0
    randomIndex = Math.floor(Math.random() * 10)
    randomChoice = choices[randomIndex]

    if (randomChoice == "y") {
        if (ball.velocity.y < 0) paddle2.speed = -16
        else if (ball.velocity.y > 0) paddle2.speed = 16
        if (ball.x < 0 || ball.x > WINDOW_WIDTH || ball.velocity.x < 0) paddle2.speed = 0
    }

    //collision detection
    if (ball.collidesWith(paddle1)) {
        if (ball.x > paddle1.x) ball.changeX()
    }
    else if (ball.collidesWith(paddle2)) {
        if (ball.x < paddle2.x) ball.changeX()
    }

    // render
    windowFill('black')
    ball.blit()
    paddle1.blit()
    paddle2.blit()

    //score
    c.fillStyle = 'white'
    c.font = "bold 48px sans-serif"
    c.fillText(ball.score1, 256, 80)

    c.fillStyle = 'white'
    c.font = "bold 48px sans-serif"
    c.fillText(ball.score2, 768, 80)

    // middle line
    rect(512, 0, 2, WINDOW_HEIGHT, 'white')

} animate()

// EVENTS
window.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 38:
            keys.up.pressed = true
            break
        case 40:
            keys.down.pressed = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.keyCode) {
        case 38:
            keys.up.pressed = false
            break
        case 40:
            keys.down.pressed = false
            break
    }
})