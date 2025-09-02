// canvas の生成
const canvas = document.getElementById("draw");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const octx = overlay.getContext("2d");

const thumb = document.getElementById("thumb");
const tctx = thumb.getContext("2d");

const brushView = document.getElementById("brushView");
const bctx = brushView.getContext("2d");

const cursorInfo = document.getElementById("cursorInfo");

// tool state
let mode = "draw";
let drawing = false;
let startX, startY;
let color = document.getElementById("color").value;
let lineWidth = document.getElementById("width").value;
let fillMode = document.getElementById("fillMode").value;


// undo　と　redo　を格納するため用意します。
let history = [];
let redoStack = [];

function saveState() {
    history.push(canvas.toDataURL());
    if (history.length > 50) history.shift();
    redoStack = [];
}

// Mode & Settings
function setMode(m) {
    mode = m;
    document.querySelectorAll(".rowtools button").forEach(b => b.classList.remove("active"));
    const map = { draw: 0, erase: 1, line: 2, rect: 3, circle: 4 };
    if (map[m] !== undefined) {
        document.querySelectorAll(".rowtools button")[map[m]].classList.add("active");
    }
}

document.getElementById("color").addEventListener("input", e => {
    color = e.target.value;
    drawBrushPreview();
});

document.getElementById("width").addEventListener("input", e => {
    lineWidth = e.target.value;
    document.getElementById("wVal").textContent = lineWidth;
    drawBrushPreview();
});

document.getElementById("fillMode").addEventListener("change", e => {
    fillMode = e.target.value;
});

// Mouse 行動
canvas.addEventListener("mousedown", e => {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    if (mode === "draw" || mode === "erase") {
        saveState();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
});

canvas.addEventListener("mousemove", e => {
    const x = e.offsetX, y = e.offsetY;
    cursorInfo.textContent = `x: ${x}, y: ${y}`;

    if (!drawing) return;

    if (mode === "draw" || mode === "erase") {
        ctx.strokeStyle = mode === "erase" ? "#0b0e1d" : color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineTo(x, y);
        ctx.stroke();
    } else {
        octx.clearRect(0, 0, overlay.width, overlay.height);
        octx.strokeStyle = color;
        octx.lineWidth = lineWidth;

        let w = x - startX, h = y - startY;
        if (mode === "line") {
            octx.beginPath();
            octx.moveTo(startX, startY);
            octx.lineTo(x, y);
            octx.stroke();
        }
        if (mode === "rect") {
            if (fillMode === "fill" || fillMode === "both") {
                octx.fillStyle = color;
                octx.fillRect(startX, startY, w, h);
            }
            if (fillMode === "stroke" || fillMode === "both") {
                octx.strokeRect(startX, startY, w, h);
            }
        }
        if (mode === "circle") {
            let w = x - startX;
            let h = y - startY;
            let cx = startX + w / 2;
            let cy = startY + h / 2;

            octx.beginPath();
            octx.ellipse(cx, cy, Math.abs(w) / 2, Math.abs(h) / 2, 0, 0, Math.PI * 2);

            if (fillMode === "fill" || fillMode === "both") {
                octx.fillStyle = color;
                octx.fill();
            }
            if (fillMode === "stroke" || fillMode === "both") {
                octx.strokeStyle = color;
                octx.lineWidth = lineWidth;
                octx.stroke();
            }
        }
    }
});

canvas.addEventListener("mouseup", e => {
    if (!drawing) return;
    drawing = false;

    if (mode === "line" || mode === "rect" || mode === "circle") {
        ctx.drawImage(overlay, 0, 0);
        octx.clearRect(0, 0, overlay.width, overlay.height);
        saveState();
    }
});

canvas.addEventListener("mouseleave", () => { drawing = false; });

// Undo と Redo　の　設定
document.getElementById("undo").addEventListener("click", () => {
    if (history.length > 0) {
        redoStack.push(canvas.toDataURL());
        let img = new Image();
        img.src = history.pop();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
});

document.getElementById("redo").addEventListener("click", () => {
    if (redoStack.length > 0) {
        history.push(canvas.toDataURL());
        let img = new Image();
        img.src = redoStack.pop();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
});


// 保存 と　upload 機能　の　設定をします。
document.getElementById("save").addEventListener("click", () => {
    let a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "canvas.png";
    a.click();
});

document.getElementById("upload").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.src = URL.createObjectURL(file);
});

// Clear 機能を設定します。
function clearCanvas() {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
document.getElementById("clear").addEventListener("click", clearCanvas);

// Grid toggle
const gridCanvas = document.getElementById("grid");
const gctx = gridCanvas.getContext("2d");
let gridOn = false;

document.getElementById("gridToggle").addEventListener("click", e => {
    gridOn = !gridOn;
    e.target.setAttribute("aria-pressed", gridOn);
    drawGrid();
});

function drawGrid() {
    gctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    if (!gridOn) {
        return;
    }

    gctx.strokeStyle = "rgba(255,255,255,0.08)";
    gctx.lineWidth = 1;

    // 縦線
    for (let x = 0; x < gridCanvas.width; x += 20) {
        gctx.beginPath();
        gctx.moveTo(x, 0);
        gctx.lineTo(x, gridCanvas.height);
        gctx.stroke();
    }

    // 横線
    for (let y = 0; y < gridCanvas.height; y += 20) {
        gctx.beginPath();
        gctx.moveTo(0, y);
        gctx.lineTo(gridCanvas.width, y);
        gctx.stroke();
    }
}

// ============================
// Thumbnails + Brush preview
// ============================
function updateThumb() {
    tctx.clearRect(0, 0, thumb.width, thumb.height);
    tctx.drawImage(canvas, 0, 0, thumb.width, thumb.height);
}
setInterval(updateThumb, 500);

function drawBrushPreview() {
    bctx.clearRect(0, 0, brushView.width, brushView.height);
    bctx.beginPath();
    bctx.arc(brushView.width / 2, brushView.height / 2, lineWidth / 2, 0, Math.PI * 2);
    bctx.fillStyle = color;
    bctx.fill();
}
drawBrushPreview();

// ============================
// Shortcuts
// ============================
document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "z") document.getElementById("undo").click();
    if (e.ctrlKey && e.shiftKey && e.key === "Z") document.getElementById("redo").click();

    const map = { p: "draw", e: "erase", l: "line", r: "rect", o: "circle", g: "grid", c: "clear" };
    const k = e.key.toLowerCase();
    if (map[k]) {
        if (map[k] === "grid") document.getElementById("gridToggle").click();
        else if (map[k] === "clear") clearCanvas();
        else setMode(map[k]);
    }
});

