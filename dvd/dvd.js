let canvas, ctx;
let img = new Image();
let x = 100, y = 100;
let dx = 2, dy = 2;
let imgWidth = 100, imgHeight = 60;
let hue = 0;
let imageLoaded = false;

// Get URL parameters
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const speed = parseFloat(params.get('speed')) || 2;
    const size = parseFloat(params.get('size')) || 150;
    return { speed, size };
}

function init() {
    const { speed, size } = getURLParams();
    dx = speed;
    dy = speed;
    imgWidth = size;
    imgHeight = size * 0.6; // maintain aspect ratio
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Set default DVD logo text if no image
    if (!imageLoaded) {
        drawDefaultLogo();
    }
    
    animate();
}

function loadImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            img.onload = function() {
                const { size } = getURLParams();
                const maxSize = size;
                const ratio = Math.min(maxSize / img.width, maxSize / img.height);
                imgWidth = img.width * ratio;
                imgHeight = img.height * ratio;
                imageLoaded = true;
                document.getElementById('image-input').style.display = 'none';
            };
        };
        reader.readAsDataURL(file);
    }
}

function drawDefaultLogo() {
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillText('DVD', x, y);
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update position
    x += dx;
    y += dy;
    
    // Bounce off edges
    if (x + imgWidth >= canvas.width || x <= 0) {
        dx = -dx;
        hue = Math.random() * 360;
    }
    if (y + imgHeight >= canvas.height || y <= 0) {
        dy = -dy;
        hue = Math.random() * 360;
    }
    
    // Draw image or text
    if (imageLoaded && img.complete) {
        // Apply color filter
        ctx.save();
        ctx.filter = `hue-rotate(${hue}deg)`;
        ctx.drawImage(img, x, y, imgWidth, imgHeight);
        ctx.restore();
    } else {
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillText('DVD', x, y);
    }
    
    requestAnimationFrame(animate);
}

// Resize canvas when window resizes
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
