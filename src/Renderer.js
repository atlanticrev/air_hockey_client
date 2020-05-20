export default class Renderer {

    constructor (canvas, table, puck, manipulator, debugPanel) {
        this.framesCounter = 0;

        this.canvas = canvas;
        this.table = table;
        this.puck = puck;
        this.manipulator = manipulator;
        this.debugPanel = debugPanel;

        this.mouseMoveTime = {
            t0: 0,
            t1: 0
        };

        this.frameTime = {
            t0: 0,
            t1: 0
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

        if (this.framesCounter % 5 === 0) {
            this.debugPanel.render({
                fps:                   `${(1000 / this.frameTime.t1).toPrecision(2)} fps`,
                timeBetweenFrames:     `${this.frameTime.t1.toPrecision(2)} ms`,
                timeBetweenMouseMoves: `${this.mouseMoveTime.curr.toPrecision(2)} ms`,
                puckVelocityX:         `${this.puck.velocity.x.toPrecision(2)} px/frame`,
                puckVelocityY:         `${this.puck.velocity.y.toPrecision(2)} px/frame`,
                manipulatorVelocityX:  `${(this.manipulator.velocity.x * this.frameTime.t1).toPrecision(2)} px/frame`,
                manipulatorVelocityY:  `${(this.manipulator.velocity.y * this.frameTime.t1).toPrecision(2)} px/frame`
            });
        }

        // console.log(manipulator.velocity.x);

        // Разрешение коллизии
        if (Math.hypot((this.manipulator.x - this.puck.x), (this.manipulator.y - this.puck.y)) <= this.manipulator.r + this.puck.r) {
            // this.puck.velocity.x = this.manipulator.velocity.x * frameTime.curr;
            // this.puck.velocity.y = this.manipulator.velocity.y * frameTime.curr;

            this.puck.velocity.x = Math.sign(this.manipulator.velocity.x) * .8 * this.frameTime.t1;
            this.puck.velocity.y = Math.sign(this.manipulator.velocity.y) * .8 * this.frameTime.t1;
            // console.warn(manipulator.velocity, this.puck.velocity);
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
        this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.table.draw();
        this.puck.draw();
        this.manipulator.draw();

        requestAnimationFrame(this.renderLoop);
    }

    inRange(min, max, value) {
        return Math.max(min, Math.min(value, max));
    }

}

Renderer.VELOCITY_DECREASE_FACTOR = .98;