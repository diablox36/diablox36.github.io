import CookieManager from './CookieManager.js'

const storageManager = new CookieManager()
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const h1 = document.querySelector('h1')

const LINEWIDTH = 2
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'grey', 'black']

resizeCanvas()
window.addEventListener('resize', resizeCanvas, false)
function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

let myPoint
let index  = nextIndex()
h1.textContent = `Index: ${index}`

setInterval(function() {
  addPoint(index)
  drawConnectionLines(storageManager.getAllItems())
}, 1000)

// const radius = 10 * index + 10
// drawLineFromPointToMiddleCirle(window.screenX, window.screenY, radius)



function nextIndex() {
  let i = 0
  while(storageManager.getItem(i) !== null) {
    i++
  }
  return i
}

window.onbeforeunload = function() {
  storageManager.removeItem(index)
  return null
}

function addPoint(key) {
  const point = {
    xLocationOnScreen: window.screenX + window.innerWidth/2,
    yLocationOnScreen: window.screenY + window.innerHeight/2,
  }
  myPoint = point
  storageManager.addItem(key, point)
}

function drawCircle(x, y, radius) {
  ctx.lineWidth = LINEWIDTH
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.stroke()
}

function drawConnectionLines(items) {
  clearCanvas()
  const radius0 = 10 * index + 10
  drawCircle(window.innerWidth/2, window.innerHeight/2, radius0)
  for (const item of items) {
    const radius1 = 10 * item[0] + 10

    drawCircle(item[1].xLocationOnScreen - window.screenX, item[1].yLocationOnScreen - window.screenY, radius1)
    let point0 = findClosestPointFromCircle(window.innerWidth/2, window.innerHeight/2, item[1].xLocationOnScreen - window.screenX, item[1].yLocationOnScreen - window.screenY, radius1)
    let point1 = findClosestPointFromCircle(item[1].xLocationOnScreen - window.screenX, item[1].yLocationOnScreen - window.screenY, window.innerWidth/2, window.innerHeight/2, radius0)
    drawLine(point0[0], point0[1], point1[0], point1[1])
  }
}

function drawLine(x0, y0, x1, y1) {
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function findClosestPointFromCircle(xPoint, yPoint, xCircle, yCircle, radius) {
  const dx = xPoint - xCircle
  const dy = yPoint - yCircle
  const distance = Math.sqrt(dx * dx + dy * dy)
  const result = [xCircle + dx * radius / distance, yCircle + dy * radius / distance]  
  console.log(result)
  return result
}
