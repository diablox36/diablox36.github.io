let canvas, ctx
let interval
let size, step
let sum

color1 = Math.floor(Math.random() * 16777215).toString(16)
color1 = "#" + ("000000" + color1).slice(-6)
color2 = Math.floor(Math.random() * 16777215).toString(16)
color2 = "#" + ("000000" + color2).slice(-6)

function setup() {
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    const sizeInput = 500
    const stepInput = 4

    canvas.width = sizeInput
    canvas.height = sizeInput

    size = sizeInput / stepInput
    step = stepInput

    sum = 0

    initialize()
    interval = setInterval(run, 2)
}

function initialize() {
    oldArray = new Array(size)
    newArray = new Array(size)

    neighArray = new Array(size)
    ratioArray = new Array(size)

    for (i = 0; i < oldArray.length; ++i) {
        oldArray[i] = new Array(size)
        newArray[i] = new Array(size)
        neighArray[i] = new Array(size)
        ratioArray[i] = new Array(size)

    }

    for (i = 0; i < size; ++i) {
        for (j = 0; j < size; ++j) {
            ratioArray[i][j] = 0
            neighArray[i][j] = 8
            if (i === 0 || i === size - 1) {
                neighArray[i][j] = 5
                if (j === 0 || j === size - 1) {
                    neighArray[i][j] = 3
                }
            }
            if (j === 0 || j === size - 1) {
                neighArray[i][j] = 5
                if (i === 0 || i === size - 1) {
                    neighArray[i][j] = 3
                }
            }

            if (i < size / 2) {
                oldArray[i][j] = 1
                sum += 1
            }
            else {
                oldArray[i][j] = 0
            }
            newArray[i][j] = oldArray[i][j]
        }
    }
    sum = sum / (size * size)
}

function ratio() {
    for (i = 0; i < size; ++i) {
        for (j = 0; j < size; ++j) {
            ratioArray[i][j] = 0
            if (i > 0) {
                if (j > 0) { ratioArray[i][j] += oldArray[i - 1][j - 1] }
                ratioArray[i][j] += oldArray[i - 1][j]
                if (j < size - 1) { ratioArray[i][j] += oldArray[i - 1][j + 1] }
            }

            if (j > 0) { ratioArray[i][j] += oldArray[i][j - 1] }
            if (j < size - 1) { ratioArray[i][j] += oldArray[i][j + 1] }

            if (i < size - 1) {
                if (j > 0) { ratioArray[i][j] += oldArray[i + 1][j - 1] }
                ratioArray[i][j] += oldArray[i + 1][j]
                if (j < size - 1) { ratioArray[i][j] += oldArray[i + 1][j + 1] }
            }

            ratioArray[i][j] = ratioArray[i][j] / neighArray[i][j]
        }
    }
}

function draw() {
    for (i = 0; i < size; ++i) {
        for (j = 0; j < size; ++j) {
            ctx.fillStyle = color1
            if (oldArray[i][j] === 1) { ctx.fillStyle = color2 }
            ctx.fillRect(i * step, j * step, step, step)
        }
    }
}

function calculate() {

    for (i = 0; i < size; ++i) {
        for (j = 0; j < size; ++j) {
            help = Math.random()

            if ((ratioArray[i][j]) > help) {
                oldArray[i][j] = 1
            } else {
                oldArray[i][j] = 0
            }
        }
    }

    sum = 0
    for (i = 0; i < size; ++i) {
        for (j = 0; j < size; ++j) {
            if (oldArray[i][j] == 1) sum += 1
        }
    }
    sum = sum / (size * size)
}

function run() {
    ratio()
    draw()
    calculate()
}