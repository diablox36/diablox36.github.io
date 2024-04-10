const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const h1 = document.querySelector('h1')
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
resizeCanvas()

h1.textContent = index

checkforNewWindowInterval = setInterval(function () {
  getAllOtherWindows()
  if(oldWindows != windows.toString()) {
    console.log('Other windows at : ' + windows)
    oldWindows = windows.toString()
  }
}, 1000)

window.onbeforeunload = function () {
  deleteCookie(index)
  index = nextIndex()
  setCookie('index',index)
  return null;
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
    document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
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

window.addEventListener('resize', resizeCanvas, false)
window.addEventListener('mouseout', mouseOut)
window.addEventListener("mouseover", mouseIn)
canvas.addEventListener("contextmenu", disableContextMenu)

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

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  draw()
  setCookie(index, positionX + ',' + positionY + ',' + window.innerWidth + ',' +  window.innerHeight)
}
      
function draw() {
  ctx.lineWidth = 5
  ctx.strokeStyle = 'blue'

  ctx.beginPath()
  ctx.moveTo(window.innerWidth/2, window.innerHeight/2);
  ctx.lineTo(0,window.innerHeight/3)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(window.innerWidth/2, window.innerHeight/2, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function disableContextMenu(event) {
  //event.preventDefault();
}
