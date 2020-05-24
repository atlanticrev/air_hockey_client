import Vec from "./math/Vec.js";

export default class Renderer {

    constructor ({ctx, objects}) {
        this.framesCounter = 0;

        this.ctx = ctx;

        this.field = objects.field;
        this.puck = objects.puck;
        this.stick = objects.stick;

        this.debugPanel = objects.debugPanel;

        this.mouseTime = {
            t0: 0,
            t1: 0
        };

        this.frameTime = {
            t0: 0,
            t1: 0
        };

        this.mouseCoords = {
            position0: new Vec(),
            position1: new Vec(),
        };
    }

    startRenderLoop () {
        requestAnimationFrame(() => {
            this.frameTime.t0 = performance.now();
            requestAnimationFrame(() => this.renderLoop());
        });
    }

    renderLoop () {
        this.framesCounter++;

        // Расчет длины кадра в ms
        this.frameTime.t1 = performance.now() - this.frameTime.t0;
        this.frameTime.t0 = performance.now();

        // Вывод в debug панель
        if (this.framesCounter % 5 === 0) {
            this.debugPanel.render({
                fps:                   1000 / this.frameTime.t1,
                timeBetweenFrames:     this.frameTime.t1,
                timeBetweenMouseMoves: this.mouseTime.t1,
                puckVelocityX:         this.puck.velocity.x,
                puckVelocityY:         this.puck.velocity.y,
                stickVelocityX:        this.stick.velocity.x * this.frameTime.t1,
                stickVelocityY:        this.stick.velocity.y * this.frameTime.t1
            });
        }

        // Разрешение коллизии
        if (Vec.dist(this.stick.position, this.puck.position) <= this.stick.r + this.puck.r) {
            // this.puck.velocity.x = this.stick.velocity.x * this.frameTime.t1;
            // this.puck.velocity.y = this.stick.velocity.y * this.frameTime.t1;

            this.puck.velocity = this.stick.velocity.mulScalar(this.frameTime.t1);

            // this.puck.velocity.x = Math.sign(this.stick.velocity.x) * .8 * this.frameTime.t1;
            // this.puck.velocity.y = Math.sign(this.stick.velocity.y) * .8 * this.frameTime.t1;
            // console.warn(stick.velocity, this.puck.velocity);
        }

        // Отскакивание шайбы от границ
        if (this.puck.x - this.puck.r <= 20 || this.puck.x + this.puck.r >= 780) {
            this.puck.velocity.x = -this.puck.velocity.x;
        }
        if (this.puck.y - this.puck.r <= 20 || this.puck.y + this.puck.r >= 480) {
            this.puck.velocity.y = -this.puck.velocity.y;
        }

        // Ограничение движения шайбы за пределы границ стола
        this.puck.x = Math.max(20 + this.puck.r, Math.min(this.puck.x += this.puck.velocity.x *= Renderer.VELOCITY_DECREASE_FACTOR, 780 - this.puck.r));
        this.puck.y = Math.max(20 + this.puck.r, Math.min(this.puck.y += this.puck.velocity.y *= Renderer.VELOCITY_DECREASE_FACTOR, 480 - this.puck.r));

        // Отрисовка сцены
        this.clear();
        this.field.draw(this.ctx);
        this.puck.draw(this.ctx);
        this.stick.draw(this.ctx);

        requestAnimationFrame(() => this.renderLoop());
    }

    // inRange(min, max, value) {
    //     return Math.max(min, Math.min(value, max));
    // }

    clear () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    // toTableCoords (coords) {
    //     return {
    //         x: coords['clientX'] - canvas.rect.x,
    //         y: coords['clientY'] - canvas.rect.y
    //     };
    // }

}

Renderer.VELOCITY_DECREASE_FACTOR = .98;