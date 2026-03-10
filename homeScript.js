let canvas, ctx, imageData;
let interval;
let array, colors;
let size, step, colorCount;
const SPEED = 10;

const OFFSETS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function init() {
    clearInterval(interval);

    size = parseInt(document.getElementById("size-input").value);
    step = parseInt(document.getElementById("step-input").value);
    colorCount = parseInt(document.getElementById("colorCount-input").value);

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = size * step;
    canvas.height = size * step;

    colors = generateColors();

    imageData = ctx.createImageData(size * step, size * step);

    array = Array(size).fill().map(() => Array(size));
    fillArray(array);

    interval = setInterval(run, SPEED);
}

function fillArray(array) {
    const center = size / 2;
    const anglePerSection = (2 * Math.PI) / colorCount;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const angle = Math.atan2(i - center, j - center) + Math.PI;
            array[i][j] = Math.floor(angle / anglePerSection) % colorCount;
        }
    }
}

function calculate() {
    const newArray = Array(size).fill().map(() => Array(size));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const colorCounts = new Map();
            let adjacentCount = 0;

            for (const [dx, dy] of OFFSETS) {
                const x = i + dx;
                const y = j + dy;

                if (x >= 0 && x < size && y >= 0 && y < size) {
                    adjacentCount++;
                    const color = array[x][y];
                    colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
                }
            }

            let bestColor = 0;
            let maxRatio = -1;

            for (const [color, count] of colorCounts) {
                const randomness = Math.random() * 3.15 / colorCounts.size
                const ratio = (count / adjacentCount) + randomness;
                if (ratio > maxRatio) {
                    maxRatio = ratio;
                    bestColor = color;
                }
            }

            newArray[i][j] = bestColor;
        }
    }

    array = newArray;
}

function draw() {
    const data = imageData.data;
    const canvasWidth = size * step;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const color = colors[array[i][j]];

            for (let px = 0; px < step; px++) {
                for (let py = 0; py < step; py++) {
                    const pixelX = i * step + px;
                    const pixelY = j * step + py;
                    const pixelIndex = (pixelY * canvasWidth + pixelX) * 4;

                    data[pixelIndex] = color.r;
                    data[pixelIndex + 1] = color.g;
                    data[pixelIndex + 2] = color.b;
                    data[pixelIndex + 3] = 255;
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function generateColors() {
    let colorArray = new Array(colorCount);

    const baseOffset = Math.random() * 360;
    const hueStep = 360 / colorCount;

    for (let i = 0; i < colorCount; i++) {
        const hue = (baseOffset + i * hueStep) % 360;
        colorArray[i] = hslToRgb(hue, 60, 50);
    }

    return colorArray;
}

function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / (1 / 12)) % 12;
        return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    }
    return {
        r: Math.round(f(0) * 255),
        g: Math.round(f(8) * 255),
        b: Math.round(f(4) * 255)
    }
}

function run() {
    calculate();
    draw();
}