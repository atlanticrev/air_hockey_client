import Vec from "./math/Vec.js";

class Puck {

    /**
     * @param {Vec} centerXY
     * @param radius
     */
    constructor (centerXY, radius) {
        this.centerXY = centerXY;
        this.radius = radius;
        this.velocityXY = new Vec(0, 0);
        this.animateInertia = false;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render (ctx) {
        ctx.fillStyle = '#cc940b';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(this.centerXY.x, this.centerXY.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

}

Puck.VELOCITY_DECREASE_FACTOR = 0.98;