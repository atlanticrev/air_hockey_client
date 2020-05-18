window.onload = () => {
    setTimeout(() => {
        const fader = document.querySelector('.fader');
        fader.style.transition = 'opacity .5s ease-out';
        fader.style.opacity = '0';
        startRenderLoop();
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);
        document.addEventListener("mouseover", onMouseUp);
        setTimeout(() => {
            fader.parentElement.removeChild(fader);
        }, 1000);
    }, 1000);
};

/**
 * Баги
 */
// @todo При маленькой скорости все равно остается инерция у шайбы
// @todo Подкорректировать расчет скорости
// @todo Манипулятор не должен перекрывать шайбу
// @todo Указать правильные действия при столкновении шайбы с манипулятором
// @todo Движение шайбы при столкновении не совсем верно происходит

/**
 * Начальные установки
 */
const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const canvasRect = canvas.getBoundingClientRect();

const audio = document.querySelector('audio');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

canvas.style.backgroundColor = '#06292f';

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
    x: center.x,
    y: center.y,
    r: 20,
    velocity: {
        x: 0,
        y: 0
    },
    needAnimateInertia: false
};

// const manipulatorOne = {
//     x: center.x - center.x / 2,
//     y: center.y,
//     r: 20,
//     velocity: {
//         x: 0,
//         y: 0
//     },
//     needAnimateInertia: false
// };

const manipulatorTwo = {
    x: center.x + center.x / 2,
    y: center.y,
    r: 25,
    velocity: {
        x: 0,
        y: 0
    },
};

const mouseMoveTime = {
    prev: 0,
    curr: 0
};

const frameTime = {
    prev: 0,
    curr: 0
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

function drawManipulator ({x, y, r}) {
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x, y, r / 2.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

/**
 * Рендеринг
 */
function renderLoop () {
    // Расчет длины кадра в ms
    frameTime.curr = performance.now() - frameTime.prev;
    frameTime.prev = performance.now();

    console.log(manipulatorTwo.velocity.x);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGameTable();

    if (Math.hypot((manipulatorTwo.x - ball.x), (manipulatorTwo.y - ball.y)) <= manipulatorTwo.r + ball.r) {
        ball.velocity.x = manipulatorTwo.velocity.x * frameTime.curr;
        ball.velocity.y = manipulatorTwo.velocity.y * frameTime.curr;
    }

    // Анимация движения шайбы
    if (ball.x - ball.r <= 20 || ball.x + ball.r >= 780) {
        ball.velocity.x = -ball.velocity.x;
    }
    if (ball.y - ball.r <= 20 || ball.y + ball.r >= 480) {
        ball.velocity.y = -ball.velocity.y;
    }

    ball.x = Math.max(20 + ball.r, Math.min(ball.x += ball.velocity.x *= VELOCITY_DECREASE_FACTOR, 780 - ball.r));
    ball.y = Math.max(20 + ball.r, Math.min(ball.y += ball.velocity.y *= VELOCITY_DECREASE_FACTOR, 480 - ball.r));

    drawBall(ball);
    drawManipulator(manipulatorTwo);

    requestAnimationFrame(renderLoop);
}

function startRenderLoop () {
    requestAnimationFrame(() => {
        frameTime.prev = performance.now();
        requestAnimationFrame(() => renderLoop());
    });
}

/**
 * Обработчики
 */
function setCoordsWithinBorders (object) {
    object.x = Math.max(20 + object.r, Math.min(mouseCoords.currentX - mouseCoords.offsetX, 780 - object.r));
    object.y = Math.max(20 + object.r, Math.min(mouseCoords.currentY - mouseCoords.offsetY, 480 - object.r));
}

function onMouseMove (e) {
    // Время между вызоввами mouseMove
    mouseMoveTime.curr = performance.now() - mouseMoveTime.prev;
    mouseMoveTime.prev = performance.now();

    // Переходим в координаты canvas
    mouseCoords.currentX = (e.clientX - canvasRect.x);
    mouseCoords.currentY = (e.clientY - canvasRect.y);

    // Перемещения центра, без поправки
    // ball.x += mouseCoords.currentX - mouseCoords.startX;
    // ball.y += mouseCoords.currentY - mouseCoords.startY;

    setCoordsWithinBorders(manipulatorTwo);

    // ball.velocity.x = mouseCoords.currentX - mouseCoords.startX;
    // ball.velocity.y = mouseCoords.currentY - mouseCoords.startY;
    //
    // mouseCoords.startX = ball.x;
    // mouseCoords.startY = ball.y;

    // console.log(mouseMoveTime.curr);

    manipulatorTwo.velocity.x = (mouseCoords.currentX - mouseCoords.startX) / mouseMoveTime.curr;
    manipulatorTwo.velocity.y = (mouseCoords.currentY - mouseCoords.startY) / mouseMoveTime.curr;

    // console.log(manipulatorTwo.velocity.x);

    mouseCoords.startX = mouseCoords.currentX;
    mouseCoords.startY = mouseCoords.currentY;

    // console.log('moving...');
}

function onMouseDown (e) {
    if (Math.hypot(e.clientX - canvasRect.x - manipulatorTwo.x, e.clientY - canvasRect.y - manipulatorTwo.y) <= manipulatorTwo.r) {
        mouseMoveTime.prev = performance.now();

        mouseCoords.startX = e.clientX - canvasRect.x;
        mouseCoords.startY = e.clientY - canvasRect.y;

        // Сещения от точки касания до середины шайбы
        mouseCoords.offsetX = mouseCoords.startX - manipulatorTwo.x;
        mouseCoords.offsetY = mouseCoords.startY - manipulatorTwo.y;

        canvas.addEventListener('mousemove', onMouseMove);
    }
}

function onMouseUp (e) {
    // console.warn('Current velocity:', ball.velocity);
    canvas.removeEventListener("mousemove", onMouseMove);
}