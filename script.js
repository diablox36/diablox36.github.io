let canvas, ctx
let interval
let array
let size, step
const SPEED = 2

generateColors()

function init() {
    size = document.getElementById("size-input").value
    step = document.getElementById("step-input").value
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    canvas.width = size * step
    canvas.height = size * step

    array = new Array(size)
    fillArray(array)

    interval = setInterval(run, SPEED)
}

function fillArray(array) {
    for (let i = 0; i < size; i++) {
        array[i] = new Array(size)
        for (let j = 0; j < size; j++) {
            array[i][j] = i >= size / 2 ? 1 : 0
        }
    }
}

function calculate() {
    let newArray = array.map(row => [...row])

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            let neighbors = []
            for (let xVariation = -1; xVariation <= 1; xVariation++) {
                for (let yVariation = -1; yVariation <= 1; yVariation++) {
                    if (xVariation === 0 && yVariation === 0)
                        continue
                    let x = i + xVariation
                    let y = j + yVariation
                    if (x >= 0 && x < size && y >= 0 && y < size) {
                        neighbors.push(array[x][y])
                    }
                }
            }

            let count = neighbors.filter(n => n === 1).length
            let ratio = count / neighbors.length

            newArray[i][j] = ratio > Math.random() ? 1 : 0
        }
    }

    array = newArray
}

function draw() {
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            let color = array[i][j] === 1 ? color1 : color2
            drawPixel(i, j, color)
        }
    }
}

function drawPixel(x, y, color) {
    ctx.fillStyle = color
    ctx.fillRect(x * step, y * step, step, step)
}

function generateColors() {
    const hue1 = Math.floor(Math.random() * 360)
    const hue2 = (hue1 + 180) % 360 // Complementary color
    
    color1 = `hsl(${hue1}, 50%, 50%)`
    color2 = `hsl(${hue2}, 50%, 50%)`
}

function run() {
    calculate()
    draw()
}
