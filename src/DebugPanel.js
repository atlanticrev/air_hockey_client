export default class DebugPanel {

    constructor () {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('debug-overlay');

        this.overlay.innerHTML = `
            <div class="overlay-body">
              <section class="debug-overlay-section">
                  <div class="debug-overlay-field">
                    <span class="debug-overlay-field-name">fps:</span>
                    <span class="debug-overlay-field-value" id="fps"></span>   
                  </div>
                  <div class="debug-overlay-field">
                    <span class="debug-overlay-field-name">time-between-frames:</span>
                    <span class="debug-overlay-field-value" id="time-between-frames"></span>            
                  </div>
                  <div class="debug-overlay-field">
                    <span class="debug-overlay-field-name">time-between-mouse-moves:</span>
                    <span class="debug-overlay-field-value" id="time-between-mouse-moves"></span>   
                  </div>
              </section>
              <section class="debug-overlay-section">
                  <div class="debug-overlay-field">
                    <span class="debug-overlay-field-name">puck-velocity-x:</span>
                    <span class="debug-overlay-field-value" id="puck-velocity-x"></span>   
                  </div>
                  <div class="debug-overlay-field">
                    <span class="debug-overlay-field-name">puck-velocity-y:</span>
                    <span class="debug-overlay-field-value" id="puck-velocity-y"></span>            
                  </div>
              </section>
              <section class="debug-overlay-section">
                  <div class="debug-overlay-field">
                    <span class="debug-overlay-field-name">manipulator-velocity-x:</span>
                    <span class="debug-overlay-field-value" id="manipulator-velocity-x"></span>   
                  </div>
                  <div class="debug-overlay-field">
                    <span class="debug-overlay-field-name">manipulator-velocity-y:</span>
                    <span class="debug-overlay-field-value" id="manipulator-velocity-y"></span>            
                  </div>
              </section>
            </div>
        `;

        this.timeBetweenFrames = this.overlay.querySelector('#time-between-frames');
        this.timeBetweenMouseMoves = this.overlay.querySelector('#time-between-mouse-moves');
        this.fps = this.overlay.querySelector('#fps');

        this.puckVelocityX = this.overlay.querySelector('#puck-velocity-x');
        this.puckVelocityY = this.overlay.querySelector('#puck-velocity-y');

        this.manipulatorVelocityX = this.overlay.querySelector('#manipulator-velocity-x');
        this.manipulatorVelocityY = this.overlay.querySelector('#manipulator-velocity-y');

        document.body.appendChild(this.overlay);
    }

    render ({timeBetweenFrames, timeBetweenMouseMoves, fps, puckVelocityX, puckVelocityY, manipulatorVelocityX, manipulatorVelocityY}) {
        this.fps.textContent = `${Math.round(fps)} fps`;
        this.timeBetweenFrames.textContent = `${Math.round(timeBetweenFrames)} ms`;
        this.timeBetweenMouseMoves.textContent = timeBetweenMouseMoves;

        this.puckVelocityX.textContent = puckVelocityX;
        this.puckVelocityY.textContent = puckVelocityY;

        this.manipulatorVelocityX.textContent = manipulatorVelocityX;
        this.manipulatorVelocityY.textContent = manipulatorVelocityY;
    }

}