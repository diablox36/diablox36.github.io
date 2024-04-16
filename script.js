const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const h1 = document.querySelector('h1')
const LINECOLOR = 'black'
const FILLCOLOR = 'whitesmoke'
const LINEWIDTH = 6
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'grey', 'black']

let mouseOutInterval
let checkforNewWindowInterval
let positionX = window.screenX
let positionY = window.screenY
let windows = []
let oldWindows
let index


if(checkCookie('index')) {
  index = nextIndex()
} else {
  index = 0
}
setCookie('index', index)
redrawCanvas()

h1.textContent = index

checkforNewWindowInterval = setInterval(function () {
  getAllOtherWindows()
  if(oldWindows != windows.toString()) {
    console.log(windows)
    oldWindows = windows.toString()
    redrawCanvas()
  }
}, 1000)

window.onbeforeunload = function () {
  deleteCookie(index)
  index = nextIndex()
  setCookie('index',index)
  return null
}

function setCookie(cookieName, cookieValue) {
  document.cookie = cookieName + "=" + cookieValue + "; SameSite=Strict"
}

function getCookie(cookieName) {
  const cookies = document.cookie.split(';')
  for(let i = 0; i < cookies.length; i++) {
    cookies[i] = cookies[i].trim() 

    if(cookies[i].startsWith(cookieName + "=")) {
      return cookies[i].substring(cookieName.length + 1)
    }
  }
}

function checkCookie(cookieName) {
  const cookieValue = getCookie(cookieName)
  if(cookieValue === undefined) {
    return false
  } else {
    return true
  }
}

function deleteCookie(cookieName) {
  if (checkCookie(cookieName)) {
    document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT"
  }
}

function getAllOtherWindows() {
  windows = []
  const cookies = document.cookie.split(';')
  for(let i = 0; i < cookies.length; i++) {
    cookies[i] = cookies[i].trim()
    if(!cookies[i].startsWith('index') && !cookies[i].startsWith(index)) {
      windows.push([cookies[i].split('=')[0], cookies[i].split('=')[1]])
    }
  }
}

function nextIndex() {
  let i = 0
  while(checkCookie(i)) {
    i++
  }
  return i
}

window.addEventListener('resize', redrawCanvas, false)
window.addEventListener('mouseout', mouseOut)
window.addEventListener("mouseover", mouseIn)
//window.addEventListener("contextmenu", disableContextMenu)

function mouseOut() {
  mouseOutInterval = setInterval(function () {
    if(window.screenX != positionX || window.screenY != positionY) {
      positionX = window.screenX
      positionY = window.screenY
      setCookie(index, positionX + ',' + positionY + ',' + window.innerWidth + ',' + window.innerHeight)
    }
  }, 250)
}

function mouseIn() {
  clearInterval(mouseOutInterval)
}

function redrawCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const width = window.innerWidth
  const height = window.innerHeight
  const xGlobal = window.screenX - height/2
  const yGlobal = window.screenY - width/2

  ctx.lineWidth = LINEWIDTH
  ctx.strokeStyle = colors[index % colors.length]
  setCookie(index, positionX + ',' + positionY + ',' + width + ',' +  height)

  const radius = 10 + index * 20
  drawCircle(width/2, height/2, radius)
  
  for(const w of windows) {
    ctx.strokeStyle = colors[w[0] % colors.length]
    const radius = 10 + w[0] * 20
    drawCircle(width/2, height/2, radius)

    const x = w[1].split(',')[0]
    const y = w[1].split(',')[1]
    const widthWindow = w[1].split(',')[2]
    const heightWindow = w[1].split(',')[3]


    drawLineBetweenEdgeCirle(xGlobal + (x - heightWindow/2 ), yGlobal + (y - widthWindow/2 ), width/2, height/2, radius)
  }
}

function drawCircle(x, y, radius) {
  ctx.beginPath()
  ctx.arc(x, y,radius, 0, 2 * Math.PI)
  ctx.stroke()
}

function drawLineBetweenEdgeCirle(xPoint, yPoint, xCircle, yCircle, radius) {
  ctx.beginPath()
  ctx.moveTo(xPoint,yPoint)
  const point = findClosestEdgePoint(xPoint,yPoint, xCircle, yCircle, radius)
  ctx.lineTo(point[0], point[1])
  ctx.stroke()
}

function findClosestEdgePoint(xPoint, yPoint, xCircle, yCircle, radius) {
  const dx = xPoint - xCircle
  const dy = yPoint - yCircle
  const distance = Math.sqrt(dx * dx + dy * dy)
  return [xCircle + dx * radius / distance, yCircle + dy * radius / distance]
}

function disableContextMenu(event) {
  event.preventDefault()
}
