export default class Canvas {

    constructor (selector) {
        this.canvas = document.querySelector(`${selector}`);
        this.ctx = canvas.getContext('2d');
        this.canvasRect = canvas.getBoundingClientRect();
        this.canvas.width = canvas.clientWidth;
        this.canvas.height = canvas.clientHeight;

        this.canvas.style.backgroundColor = '#06292f';
    }

    normalizeVector (x, y, maxWidth = this.canvas.width, maxHeight = this.canvas.height) {
        return {
            x: (x / maxWidth - 0.5) * 2,
            y: (x / maxHeight - 0.5) * 2,
        };
    }

    clear () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}