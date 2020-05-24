import Vec from "./math/Vec.js";
import Renderer from "./Renderer.js";
import Field from "./Field.js";
import Puck from "./Puck.js";
import Stick from "./Stick.js";
import DebugPanel from "./DebugPanel.js";

export default class Game {

    constructor () {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'game';
        this.ctx = this.canvas.getContext('2d');

        document.body.appendChild(this.canvas);

        this.rect = this.canvas.getBoundingClientRect();

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.objects = {
            field: new Field(),
            puck: new Puck(new Vec(this.canvas.width * 0.5, this.canvas.height * 0.5), 20),
            stick: new Stick(new Vec(this.canvas.width * 0.75 , this.canvas.height * 0.5), 25),
            debugPanel: new DebugPanel()
        };

        this.renderer = new Renderer({
            ctx: this.ctx,
            objects: this.objects
        });

        this.renderer.startRenderLoop();
    }

}