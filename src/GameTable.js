import Vec from "./math/Vec.js";

export default class GameTable {

    constructor (tablePadding = 20, circleRadius = 50) {
        this.canvasRect = ctx.canvas.getBoundingClientRect();
        this.circleRadius = circleRadius;
        this.tablePadding = tablePadding;
        this.topLeftBorder = new Vec(this.canvasRect.x + tablePadding, this.canvasRect.y + tablePadding);
        this.bottomRightBorder = new Vec(this.canvasRect.width - tablePadding, this.canvasRect.height - tablePadding);
        this.center = new Vec(this.canvasRect.width / 2, this.canvasRect.height / 2);
    }

    render (ctx) {
        ctx.lineWidth = 2;

        // Кромка поля
        ctx.strokeStyle = 'white';
        ctx.strokeRect(this.topLeftBorder + this.tablePadding, 20, ctx.canvas.width - 20 * 2, ctx.canvas.height - 20 * 2);

        // Центральная линия
        ctx.beginPath();
        ctx.moveTo(this.center.x, 20);
        ctx.lineTo(this.center.x, ctx.canvas.height - 20);
        ctx.stroke();
        ctx.closePath();

        // Центральный круг
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.circleRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        // Левый полукруг
        ctx.beginPath();
        ctx.arc(20, this.center.y, this.circleRadius, -Math.PI / 2, Math.PI / 2, false);
        ctx.stroke();
        ctx.closePath();

        // Правый полукруг
        ctx.beginPath();
        ctx.arc(ctx.canvas.width - 20, this.center.y, this.circleRadius, -Math.PI / 2, Math.PI / 2, true);
        ctx.stroke();
        ctx.closePath();
    }

}