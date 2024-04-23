import CookieManager from '/script/CookieManager.js'

const url = new URL(window.location.href)
const storageManager = new CookieManager()
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const p = document.querySelector('p')

const LINEWIDTH = 2
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'grey', 'black']

resizeCanvas()
window.addEventListener('resize', resizeCanvas, false)
function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
window.addEventListener("beforeunload", function(){
  this.clearInterval(updateInterval)
  storageManager.removeItem(index)
  return null
})

let oldItems
let index  = nextIndex()
url.searchParams.set('i', index)
window.history.replaceState(null, null, url)

const updateInterval = setInterval(function() {
  updatePoint(index)

  if (oldItems !== storageManager.getRawItems()) {
    oldItems = storageManager.getRawItems()
    drawConnectionLines(storageManager.getAllItems())
  }
}, 10)

function nextIndex() {
  let i = 0
  while(storageManager.getItem(i) !== null) {
    i++
  }
  return i
}

function updatePoint(key) {
  const point = {
    x: window.screenX + window.innerWidth/2,
    y: window.screenY + window.innerHeight/2,
  }
  storageManager.addItem(key, point)
}

function drawConnectionLines(positions) {
  clearCanvas()
  for (const position of positions) {
    const radius0 = calculateRadius(position.key)
    drawCircle(xPosition(position.value.x), yPosition(position.value.y), radius0)

    for (const otherPosition of positions) {
      if (position.key === otherPosition.key) {
        break
      }
      const radius1 = calculateRadius(otherPosition.key)
  
      const point0 = findClosestPointFromCircle(xPosition(position.value.x), yPosition(position.value.y), xPosition(otherPosition.value.x), yPosition(otherPosition.value.y), radius1)
      const point1 = findClosestPointFromCircle(xPosition(otherPosition.value.x), yPosition(otherPosition.value.y), xPosition(position.value.x), yPosition(position.value.y), radius0)
      drawLine(point0.x, point0.y, point1.x, point1.y)
    }
  }
}

function drawLine(x0, y0, x1, y1) {
  ctx.lineWidth = LINEWIDTH
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
}

function drawCircle(x, y, radius) {
  ctx.lineWidth = LINEWIDTH
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.stroke()
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function findClosestPointFromCircle(xPoint, yPoint, xCircle, yCircle, radius) {
  const dx = xPoint - xCircle
  const dy = yPoint - yCircle
  const distance = Math.sqrt(dx * dx + dy * dy)
  return {
    x: xCircle + dx * radius / distance,
    y: yCircle + dy * radius / distance,
  }
}

function xPosition(x){
  return x - window.screenX
}
function yPosition(y){
  return y - window.screenY
}
function calculateRadius(number) {
  return 10 * number + 10
}