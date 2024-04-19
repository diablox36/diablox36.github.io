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

let index  = nextIndex()
h1.textContent = `Index: ${index}`

setInterval(function() {
  addPoint(index)
}, 1000)

const radius = 10 * index + 10
drawCircle(radius)
drawLineFromPointToMiddleCirle(window.screenX, window.screenY, radius)



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
  storageManager.addItem(key, point)
}

function drawCircle(radius) {
  ctx.lineWidth = LINEWIDTH
  ctx.beginPath()
  ctx.arc(window.innerWidth/2, window.innerHeight/2 ,radius, 0, 2 * Math.PI)
  ctx.stroke()
}

function drawLineFromPointToMiddleCirle(x, y, radius) {
  ctx.beginPath()
  ctx.moveTo(x,y)
  const point = findClosestPointFromCircle(x, y, radius)
  ctx.lineTo(point[0], point[1])
  ctx.stroke()
}

function findClosestPointFromCircle(x, y, radius) {
  const dx = x - window.innerWidth/2
  const dy = y - window.innerHeight/2
  const distance = Math.sqrt(dx * dx + dy * dy)
  return [window.innerWidth/2 + dx * radius / distance, window.innerHeight/2 + dy * radius / distance]
}
