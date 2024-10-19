// variable utiliser pour le casse brique
let canvas = document.getElementById("myCanvas")
let ctx = canvas.getContext("2d")

// variable utiliser pour la balle
let ballRadius = 10
let x = canvas.width / 2
let y = canvas.height - 30
let dx = 2
let dy = -2

// variable utilisé pour la raquette
let paddleHeight = 10
let paddleWidth = 75
let paddleX = (canvas.width - paddleWidth) / 2
let rightPressed = false
let leftPressed = false

// variable utilisé pour les brique
let brickRowCount = 5
let brickColumnCount = 3
let brickWidth = 75
let brickHeight = 20
let brickPadding = 10
let brickOffsetTop = 30
let brickOffsetLeft = 30
let gameOverNotify = document.querySelector('.game-over-notify')
let interval

// variable utilisé pour le score
let score = 0

// variable utilisé pour donner des vies au joueur
let lives = 3

let bricks = []
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }
    }
}

// les écouteur d'évenement
document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)
document.addEventListener("mousemove", mouseMoveHandler, false)

// function qui vérifie si les touches left et right sont pressées
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true
    }
    else if (e.keyCode == 37) {
        leftPressed = true
    }
}

// function qui vérifie si les touches left et right ne sont pas pressées
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false
    }
    else if (e.keyCode == 37) {
        leftPressed = false
    }
}

// function qui vérifie les coordonnées de la souris
function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2
    }
}

// function qui détecte la collision du balle sur une brique
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r]
            if (b.status == 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy
                    b.status = 0
                    score++
                    if (score == brickRowCount * brickColumnCount) {
                        alert("C'est gagné, Bravo!")
                        document.location.reload()
                    }
                }
            }
        }
    }
}

// function pour créer le score
function drawScore() {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#0095DD"
    ctx.fillText("Score: " + score, 8, 20)
}

// function pour créer les vies du joueur
function drawLives() {
    ctx.fonnt = "16px Arial"
    ctx.fillStyle = "#0095DD"
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20)
}

// function pour créer la balle
function drawBall() {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#0095DD"
    ctx.fill()
    ctx.closePath()
}

// function pour créer la raquette pour frapper la balle
function drawPaddle() {
    ctx.beginPath()
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle = "#0095DD"
    ctx.fill()
    ctx.closePath()
}

// function pour créer les briques
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft
                let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop
                bricks[c][r].x = brickX
                bricks[c][r].y = brickY
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight)
                ctx.fillStyle = "#0095DD"
                ctx.fill()
                ctx.closePath()
            }
        }
    }
}

// function pour ajouter les données dans la page web
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBricks()
    drawBall()
    drawPaddle()
    drawScore()
    drawLives()
    collisionDetection()

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx
    }
    if (y + dy < ballRadius) {
        dy = -dy
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy
        }
        else {
            lives--
            if (!lives){
                alert("GAME OVER")
                document.location.reload()
            }
            else {
                x = canvas.width / 2
                y = canvas.height - 30
                dx = 2
                dy = -2
                paddleX = (canvas.width - paddleWidth) / 2
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7
    }

    x += dx
    y += dy
    requestAnimationFrame(draw);
}

// permet de répéter des instructions à des intervalles réguilers
draw()