export default class Field {

    constructor (padding = 20, radius = 50) {
        this.radius = radius;
        this.padding = padding;
    }

    draw (ctx) {
        ctx.lineWidth = 2;

        // Кромка поля
        ctx.strokeStyle = 'white';
        ctx.strokeRect(this.padding, this.padding, ctx.canvas.width - this.padding * 2, ctx.canvas.height - this.padding * 2);

        // Центральная линия
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width / 2, this.padding);
        ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height - this.padding);
        ctx.stroke();
        ctx.closePath();

        // Центральный круг
        ctx.beginPath();
        ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        // Левый полукруг
        ctx.beginPath();
        ctx.arc(this.padding, ctx.canvas.height / 2, this.radius, -Math.PI / 2, Math.PI / 2, false);
        ctx.stroke();
        ctx.closePath();

        // Правый полукруг
        ctx.beginPath();
        ctx.arc(ctx.canvas.width - this.padding, ctx.canvas.height / 2, this.radius, -Math.PI / 2, Math.PI / 2, true);
        ctx.stroke();
        ctx.closePath();
    }

}