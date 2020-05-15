/**
 * Баги
 */
// @todo Шайба застревает в границах иногда
// @todo Если увести в зажатом состоянии мышь с поля, не срабатывает обработчик отжатия мыши
// @todo При нажатии на шайбу центр шайбы прыгает на координаты курсора мыши
// @todo При маленькой скорости все равно остается инерция
// @todo Подкорректировать расчет скорости

/**
 * Начальные установки
 */
const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const canvasRect = canvas.getBoundingClientRect();

// @todo Нормализовать координаты (-1, 1)
// function normalizeVector (x, y, maxWidth = canvas.width, maxHeight = canvas.height) {
//     return {
//         x: (x / maxWidth - 0.5) * 2,
//         y: (x / maxHeight - 0.5) * 2,
//     };
// }

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

canvas.style.backgroundColor = '#2a60cc';

const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
};

const mouseCoords = {
    startX: null,
    startY: null,
    currentX: null,
    currentY: null,
    endX: null,
    endY: null,
};

const ball = {
    x: 120,
    y: 100,
    r: 20,
    velocity: {
        x: null,
        y: null
    },
    needAnimateInertia: false
};

const VELOCITY_DECREASE_FACTOR = 0.99;

/**
 * Объекты игры
 */
function drawGameTable () {
    ctx.lineWidth = 2;

    // Кромка поля
    ctx.strokeStyle = 'white';
    ctx.strokeRect(20, 20, canvasRect.width - 20 * 2, canvasRect.height - 20 * 2);

    // Центральная линия
    ctx.beginPath();
    ctx.moveTo(center.x, 20);
    ctx.lineTo(center.x, canvasRect.height - 20);
    ctx.stroke();
    ctx.closePath();

    // Центральный круг
    ctx.beginPath();
    ctx.arc(center.x, center.y, 50, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    // Левый полукруг
    ctx.beginPath();
    ctx.arc(20, center.y, 50, -Math.PI / 2, Math.PI / 2, false);
    ctx.stroke();
    ctx.closePath();

    // Правый полукруг
    ctx.beginPath();
    ctx.arc(canvasRect.width - 20, center.y, 50, -Math.PI / 2, Math.PI / 2, true);
    ctx.stroke();
    ctx.closePath();
}

function drawBall ({x, y, r}) {
    ctx.fillStyle = '#cc940b';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

/**
 * Рендеринг
 */
const positionFix = 0;

function renderLoop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGameTable();

    // Анимация инерции
    if (ball.needAnimateInertia) {
        if (ball.x - ball.r <= 20 + positionFix || ball.x + ball.r >= 780 - positionFix) {
            ball.velocity.x = -ball.velocity.x;
            ball.x += ball.velocity.x *= VELOCITY_DECREASE_FACTOR;
        } else if (ball.x - ball.r > 20 + positionFix || ball.x + ball.r < 780 - positionFix) {
            ball.x += ball.velocity.x *= VELOCITY_DECREASE_FACTOR;
        }
        if (ball.y - ball.r <= 20 + positionFix || ball.y + ball.r >= 480 - positionFix) {
            ball.velocity.y = -ball.velocity.y;
            ball.y += ball.velocity.y *= VELOCITY_DECREASE_FACTOR;
        } else if (ball.y - ball.r > 20 + positionFix || ball.y + ball.r < 480 - positionFix) {
            ball.y += ball.velocity.y *= VELOCITY_DECREASE_FACTOR;
        }
    }

    drawBall(ball);

    requestAnimationFrame(renderLoop);
}

// drawGameTable();
// drawBall(ball);
renderLoop();

/**
 * Обработчики
 */
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
document.addEventListener("mouseover", onMouseUp);

function onMouseMove (e) {
    mouseCoords.currentX = e.clientX - canvasRect.x;
    mouseCoords.currentY = e.clientY - canvasRect.y;

    // ball.x += mouseCoords.currentX - mouseCoords.startX;
    // ball.y += mouseCoords.currentY - mouseCoords.startY;

    // @todo Нужна поправка при касании мышкой
    ball.x = Math.max(41, Math.min(mouseCoords.currentX - mouseCoords.offsetX, 759));
    ball.y = Math.max(41, Math.min(mouseCoords.currentY - mouseCoords.offsetY, 459));

    ball.velocity.x = e.clientX - canvasRect.x - mouseCoords.startX;
    ball.velocity.y = e.clientY - canvasRect.y - mouseCoords.startY;

    mouseCoords.startX = ball.x;
    mouseCoords.startY = ball.y;
    // console.log('moving...');
}

function onMouseDown (e) {
    if (Math.hypot(e.clientX - canvasRect.x - ball.x, e.clientY - canvasRect.y - ball.y) <= ball.r) {
        ball.needAnimateInertia = false;
        // console.warn('In ball');
        mouseCoords.startX = e.clientX - canvasRect.x;
        mouseCoords.startY = e.clientY - canvasRect.y;

        // Сещения от точки касания до середины шайбы
        mouseCoords.offsetX = mouseCoords.startX - ball.x;
        mouseCoords.offsetY = mouseCoords.startY - ball.y;

        canvas.addEventListener('mousemove', onMouseMove);
    }
}

function onMouseUp (e) {
    // console.warn('Current velocity:', ball.velocity);
    ball.needAnimateInertia = true;
    canvas.removeEventListener("mousemove", onMouseMove);
}