let canvas, ctx, imageData
let color1, color2
let interval
let array
let size, step
const SPEED = 10

const NEIGHBOR_OFFSETS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

generateColors()

function init() {
    size = parseInt(document.getElementById("size-input").value)
    step = parseInt(document.getElementById("step-input").value)
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    canvas.width = size * step
    canvas.height = size * step

    imageData = ctx.createImageData(size * step, size * step)

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
    let newArray = new Array(size)

    for (let i = 0; i < size; i++) {
        newArray[i] = new Array(size)

        for (let j = 0; j < size; j++) {
            let count = 0
            let totalNeighbors = 0

            for (let k = 0; k < NEIGHBOR_OFFSETS.length; k++) {
                let x = i + NEIGHBOR_OFFSETS[k][0]
                let y = j + NEIGHBOR_OFFSETS[k][1]

                if (x >= 0 && x < size && y >= 0 && y < size) {
                    if (array[x][y] === 1)
                        count++
                    totalNeighbors++
                }
            }

            let ratio = count / totalNeighbors
            newArray[i][j] = ratio > Math.random() ? 1 : 0
        }
    }

    array = newArray
}

function draw() {
    const data = imageData.data
    const canvasWidth = size * step

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const color = array[i][j] === 1 ? color1 : color2

            for (let px = 0; px < step; px++) {
                for (let py = 0; py < step; py++) {
                    const pixelX = i * step + px
                    const pixelY = j * step + py
                    const pixelIndex = (pixelY * canvasWidth + pixelX) * 4

                    data[pixelIndex] = color.r
                    data[pixelIndex + 1] = color.g
                    data[pixelIndex + 2] = color.b
                    data[pixelIndex + 3] = 255
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0)
}

function generateColors() {
    const hue1 = Math.floor(Math.random() * 360)
    const hue2 = (hue1 + 180) % 360

    color1 = hslToRgb(hue1, 50, 50)
    color2 = hslToRgb(hue2, 50, 50)
}

function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = n => {
        const k = (n + h / (1 / 12)) % 12
        return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    }
    return {
        r: Math.round(f(0) * 255),
        g: Math.round(f(8) * 255),
        b: Math.round(f(4) * 255)
    }
}

function run() {
    calculate()
    draw()
}
