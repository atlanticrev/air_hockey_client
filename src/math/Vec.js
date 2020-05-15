export default class Vec {

    /**
     * @param args
     */
    constructor (...args) {
        this.x = args[0];
        this.y = args[1];
        this.z = args[2] || 0;
        this.w = args[2] || 1; // Homogeneous coordinate
    }

    /**
     * @param {Vec} a
     * @param {Vec} b
     * @return {number}
     */
    static dot (a, b) {
        return a.x * b.x + a.y * b.y;
    }

    static cross (a, b) {}

    /**
     * @param {Vec} a
     * @param {Vec} b
     * @return {Vec}
     */
    static add (a, b) {
        return new Vec(a.x + b.x, a.y + b.y);
    }

    /**
     * @param {Vec} a
     * @param {Vec} b
     * @return {Vec}
     */
    static sub (a, b) {
        return new Vec(a.x - b.x, a.y - b.y);
    }

    /**
     * @param {Vec} a
     * @param {Vec} b
     * @return {Number}
     */
    static dist (a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

}