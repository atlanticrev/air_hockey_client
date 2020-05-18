export default class Canvas {

    constructor () {
        
    }

    normalizeVector (x, y, maxWidth = canvas.width, maxHeight = canvas.height) {
        return {
            x: (x / maxWidth - 0.5) * 2,
            y: (x / maxHeight - 0.5) * 2,
        };
    }

}