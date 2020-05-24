import Vec from "./math/Vec.js";

export default class Stick {

    /**
     * @param {Vec} position
     * @param radius
     */
    constructor (position, radius) {
        this.position = position;
        this.radius = radius;
        this.velocity = new Vec(0, 0);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * 0.4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

}