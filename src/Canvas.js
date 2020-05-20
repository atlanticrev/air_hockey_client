import Vec from "./math/Vec";

export default class Canvas {

    constructor (selector) {
        this.canvas = document.querySelector(`${selector}`);
        this.ctx = this.canvas.getContext('2d');

        this.canvasRect = this.canvas.getBoundingClientRect();

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.canvas.style.backgroundColor = '#06292f';
    }

    normalizeVector (x, y, maxWidth = this.canvas.width, maxHeight = this.canvas.height) {
        return new Vec((x / maxWidth - 0.5) * 2, (y / maxHeight - 0.5) * 2);
    }

    clear () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getCenterPos () {
        return new Vec(this.canvas.width / 2, this.canvas.height / 2);
    }

}