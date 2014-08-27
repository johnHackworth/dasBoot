window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var movementSimulator = function(options) {
    this.stage = options.stage;
    this.submarineView = options.submarineView;
    this.boat = options.boat;
    this.deepGauge = options.deepGauge;
    this.init(options);
  };
  movementSimulator.prototype = {
    className: 'movementSimulator',
    init: function(options) {

    },
    tick: function(counter, active) {
      if (!active) return;
      if (counter % 10 === 0) {
        if (this.deepGauge.intendedDeep != this.boat.deep) {
          this.changeDeep();
        }
      }
      this.submarineRotation(counter);
    },
    changeDeep: function() {
      var motorPower = this.boat.getMotorPower();
      var pilotHability = this.boat.getHelmsmanWork();
      var speed = this.boat.sinkingSpeed * (motorPower + 2 * pilotHability) / 300;
      this.boatGoingDown = 0;
      if (this.boat.deep > this.deepGauge.intendedDeep) {
        this.boat.deep -= speed / 60 * 10;
        this.boatGoingDown = -1;
      }
      if (this.boat.deep < this.deepGauge.intendedDeep) {
        this.boatGoingDown = 1;
        this.boat.deep += speed / 60 * 10;
      }
      if (Math.abs(Math.abs(this.boat.deep) - Math.abs(this.deepGauge.intendedDeep)) < 0.01) {
        this.boat.deep = this.deepGauge.intendedDeep;
      }
      if (this.deepGauge.intendedDeep < 5) {
        this.deepGauge.intendedDeep = 0;
        if (this.boat.deep < 2) {
          this.boat.deep = 0;
        }
      }
    },
    submarineRotation: function(counter) {
      if (!this.boatGoingDown) {
        this.submarineView.assignSumarineRotation(counter, 0.02, 10);
        this.currentCounterRotation = counter % 800;
      } else if (this.boatGoingDown == -1) {
        if (this.currentCounterRotation > 204) {
          this.currentCounterRotation--;
        }
        if (this.currentCounterRotation < 204) {
          this.currentCounterRotation++;
        }
        this.submarineView.assignSumarineRotation(this.currentCounterRotation, 0.03, 10);
      } else if (this.boatGoingDown == 1) {
        if (this.currentCounterRotation > 581) {
          this.currentCounterRotation--;
        }
        if (this.currentCounterRotation < 581) {
          this.currentCounterRotation++;
        }
        this.submarineView.assignSumarineRotation(this.currentCounterRotation, 0.03, 10);
        // going up
      }
    }
  };

  window.boot.models.MovementSimulator = movementSimulator;
})();