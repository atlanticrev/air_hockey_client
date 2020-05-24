import Game from './src/Game.js';

window.onload = () => {

    /**
     * Баги
     */
    // @todo Поправить "скорость перерисовки" ручки под курсором
    // @todo При маленькой скорости все равно остается инерция у шайбы
    // @todo Подкорректировать расчет скорости
    // @todo Манипулятор не должен перекрывать шайбу
    // @todo Указать правильные действия при столкновении шайбы с манипулятором
    // @todo Движение шайбы при столкновении не совсем верно происходит

    /**
     * Начальные установки
     */
    const game = new Game();

    /**
     * Объекты игры
     */
    // function toTableCoords (coords) {
    //     return {
    //         x: coords['clientX'] - canvas.rect.x,
    //         y: coords['clientY'] - canvas.rect.y
    //     };
    // }

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
        // Время между вызовами mouseMove
        mouseTime.delta = performance.now() - mouseTime.timestamp;
        mouseTime.timestamp = performance.now();

        // Переходим в координаты стола
        mouseCoords.currentX = toTableCoords(e).x;
        mouseCoords.currentY = toTableCoords(e).y;

        setCoordsWithinBorders(stick);

        stick.velocity.x = (mouseCoords.currentX - mouseCoords.startX) / mouseTime.delta;
        stick.velocity.y = (mouseCoords.currentY - mouseCoords.startY) / mouseTime.delta;

        mouseCoords.startX = mouseCoords.currentX;
        mouseCoords.startY = mouseCoords.currentY;
    }

    function onMouseDown (e) {
        // Если ткнули в манипулятор
        if (Math.hypot(e.clientX - canvas.rect.x - stick.x, e.clientY - canvas.rect.y - stick.y) <= stick.r) {
            mouseTime.timestamp = performance.now();

            mouseCoords.startX = toTableCoords(e).x;
            mouseCoords.startY = toTableCoords(e).y;

            canvas.canvas.addEventListener('mousemove', onMouseMove);
        }
    }

    function onMouseUp () {
        stick.velocity.x = 0;
        stick.velocity.y = 0;
        canvas.canvas.removeEventListener("mousemove", onMouseMove);
    }

    setTimeout(() => {
        // canvas.addEventListener('mousedown', onMouseDown);
        // canvas.addEventListener('mouseup', onMouseUp);
        // document.addEventListener("mouseover", onMouseUp);

        const fader = document.querySelector('.fader');
        fader.style.transition = 'opacity .2s ease-out';
        fader.style.opacity = '0';

        setTimeout(() => {
            fader.parentElement.removeChild(fader);
        }, 250);
    }, 1000);

};