import DebugWindow from './src/DebugWindow.js';

window.onload = () => {
    setTimeout(() => {
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);
        document.addEventListener("mouseover", onMouseUp);
        const fader = document.querySelector('.fader');
        fader.style.transition = 'opacity .2s ease-out';
        fader.style.opacity = '0';
        startRenderLoop();
        setTimeout(() => {
            fader.parentElement.removeChild(fader);
        }, 250);
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

const debugOverlay = new DebugWindow();

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

const puck = {
    x: center.x,
    y: center.y,
    r: 20,
    velocity: {
        x: 0,
        y: 0
    },
    needAnimateInertia: false
};

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

function drawPuck ({x, y, r}) {
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

function toTableCoords (coords) {
    return {
        x: coords['clientX'] - canvasRect.x,
        y: coords['clientY'] - canvasRect.y
    };
}

/**
 * Рендеринг
 */
let framesCounter = 0;

function renderLoop () {
    framesCounter++;

    // Расчет длины кадра в ms
    frameTime.curr = performance.now() - frameTime.prev;
    frameTime.prev = performance.now();

    if (framesCounter % 5 === 0) {
        debugOverlay.render({
            fps: `${(1000 / frameTime.curr).toPrecision(2)} fps`,
            timeBetweenFrames: `${frameTime.curr.toPrecision(2)} ms`,
            timeBetweenMouseMoves: `${mouseMoveTime.curr.toPrecision(2)} ms`,
            puckVelocityX: `${puck.velocity.x.toPrecision(2)} px/frame`,
            puckVelocityY: `${puck.velocity.y.toPrecision(2)} px/frame`,
            manipulatorVelocityX: `${(manipulatorTwo.velocity.x * frameTime.curr).toPrecision(2)} px/frame`,
            manipulatorVelocityY: `${(manipulatorTwo.velocity.y * frameTime.curr).toPrecision(2)} px/frame`
        });
    }

    // console.log(manipulatorTwo.velocity.x);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGameTable();

    // Разрешение коллизии
    if (Math.hypot((manipulatorTwo.x - puck.x), (manipulatorTwo.y - puck.y)) <= manipulatorTwo.r + puck.r) {
        // puck.velocity.x = manipulatorTwo.velocity.x * frameTime.curr;
        // puck.velocity.y = manipulatorTwo.velocity.y * frameTime.curr;

        puck.velocity.x = Math.sign(manipulatorTwo.velocity.x) * .8 * frameTime.curr;
        puck.velocity.y = Math.sign(manipulatorTwo.velocity.y) * .8 * frameTime.curr;
        // console.warn(manipulatorTwo.velocity, puck.velocity);
    }

    // Отскакивание шайбы от границ
    if (puck.x - puck.r <= 20 || puck.x + puck.r >= 780) {
        puck.velocity.x = -puck.velocity.x;
    }
    if (puck.y - puck.r <= 20 || puck.y + puck.r >= 480) {
        puck.velocity.y = -puck.velocity.y;
    }

    // Ограничение движения шайбы за пределы границ стола
    puck.x = Math.max(20 + puck.r, Math.min(puck.x += puck.velocity.x *= VELOCITY_DECREASE_FACTOR, 780 - puck.r));
    puck.y = Math.max(20 + puck.r, Math.min(puck.y += puck.velocity.y *= VELOCITY_DECREASE_FACTOR, 480 - puck.r));

    drawPuck(puck);
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
    const newPosX = object.x + (mouseCoords.currentX - mouseCoords.startX);
    const newPosY = object.y + (mouseCoords.currentY - mouseCoords.startY);

    object.x = Math.max(20 + object.r, Math.min(newPosX, 780 - object.r));
    object.y = Math.max(20 + object.r, Math.min(newPosY, 480 - object.r));
}

function onMouseMove (e) {
    // Время между вызоввами mouseMove
    mouseMoveTime.curr = performance.now() - mouseMoveTime.prev;
    mouseMoveTime.prev = performance.now();

    // Переходим в координаты стола
    mouseCoords.currentX = toTableCoords(e).x;
    mouseCoords.currentY = toTableCoords(e).y;

    setCoordsWithinBorders(manipulatorTwo);

    // console.log(mouseMoveTime.curr);

    manipulatorTwo.velocity.x = (mouseCoords.currentX - mouseCoords.startX) / mouseMoveTime.curr;
    manipulatorTwo.velocity.y = (mouseCoords.currentY - mouseCoords.startY) / mouseMoveTime.curr;

    // console.log(manipulatorTwo.velocity.x);

    mouseCoords.startX = mouseCoords.currentX;
    mouseCoords.startY = mouseCoords.currentY;
}

function onMouseDown (e) {
    // Если ткнули в манипулятор
    if (Math.hypot(e.clientX - canvasRect.x - manipulatorTwo.x, e.clientY - canvasRect.y - manipulatorTwo.y) <= manipulatorTwo.r) {
        mouseMoveTime.prev = performance.now();

        mouseCoords.startX = toTableCoords(e).x;
        mouseCoords.startY = toTableCoords(e).y;

        canvas.addEventListener('mousemove', onMouseMove);
    }
}

function onMouseUp () {
    manipulatorTwo.velocity.x = 0;
    manipulatorTwo.velocity.y = 0;
    canvas.removeEventListener("mousemove", onMouseMove);
}