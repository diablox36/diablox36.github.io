let canvas, ctx, imageData
let interval
let array, colors
let size, step, number
const SPEED = 10
let colorMode = 0

const NEIGHBOR_OFFSETS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

function init() {
    if (interval) {
        clearInterval(interval)
    }
    
    size = parseInt(document.getElementById("size-input").value)
    step = parseInt(document.getElementById("step-input").value)
    number = parseInt(document.getElementById("number-input").value)

    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    canvas.width = size * step
    canvas.height = size * step

    colors = new Array(number)
    generateColors(colors)

    imageData = ctx.createImageData(size * step, size * step)

    array = new Array(size)
    fillArray(array)

    interval = setInterval(run, SPEED)
}

function fillArray(array) {
    const centerX = size / 2
    const centerY = size / 2
    const anglePerSection = (2 * Math.PI) / number

    for (let i = 0; i < size; i++) {
        array[i] = new Array(size)
        for (let j = 0; j < size; j++) {
            // Calculate angle from center to current point
            const dx = j - centerX
            const dy = i - centerY
            let angle = Math.atan2(dy, dx)

            // Normalize angle to 0-2π range
            if (angle < 0) angle += 2 * Math.PI

            // Determine which section this point belongs to
            const sectionIndex = Math.floor(angle / anglePerSection)

            // Assign color index (ensure it's within bounds)
            array[i][j] = Math.min(sectionIndex, number - 1)
        }
    }
}

function calculate() {
    let newArray = new Array(size)

    for (let i = 0; i < size; i++) {
        newArray[i] = new Array(size)

        for (let j = 0; j < size; j++) {
            let colorCount = new Array(number).fill(0)
            let totalNeighbors = 0

            for (let k = 0; k < NEIGHBOR_OFFSETS.length; k++) {
                let x = i + NEIGHBOR_OFFSETS[k][0]
                let y = j + NEIGHBOR_OFFSETS[k][1]

                if (x >= 0 && x < size && y >= 0 && y < size) {
                    colorCount[array[x][y]]++
                    totalNeighbors++
                }
            }

            let colorRatio = new Array(number)
            for (let k = 0; k < colorCount.length; k++) {
                let ratio = colorCount[k] / totalNeighbors
                colorRatio[k] = ratio * Math.random()
            }

            newArray[i][j] = colorRatio.indexOf(Math.max(...colorRatio))
        }
    }

    array = newArray
}

function calculate2Colors() {
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
            const color = colors[array[i][j]]

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

function generateColors(colors) {
    let ratio = 360 / number
    const baseOffset = Math.random() * 360

    for (let i = 0; i < number; i++) {
        const hue = (baseOffset + i * ratio) % 360
        colors[i] = hslToRgb(hue, 60, 50)
    }
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
    switch (colorMode) {
        case 0:
            calculate()
            break
        case 1:
            calculate2Colors()
            break
        default:
    }
    draw()
}

function changeAlgorithm() {
    colorMode = (colorMode + 1) % 2
    init()
}
