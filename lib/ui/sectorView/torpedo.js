window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var torpedo = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.sea = options.sea;
    this.target = options.target;
    this.origin = options.origin;
    this.init();
  };
  torpedo.prototype = {
    counter: 0,
    explosiveAmount: 300,
    speed: 60,
    init: function() {
      this.origin.trigger('torpedoFired');
      this.path = [];
      this.path.push({
        x: window.boot.width / 2,
        y: 250
      });


      this.distanceToTarget = this.sea.combatSimulator.getDistance(this.origin, this.target);
      this.originalDistance = this.distanceToTarget;
      this.fireSolution = this.sea.combatSimulator.getFireSolution(this.origin, this.target);

      this.stage.addNotVisualEntity(this);
      this.renderView();
    },
    getPercentageToTarget: function() {
      return 1 - (this.distanceToTarget / this.originalDistance);
    },
    tick: function(counter, active) {
      if (!active) return;
      this.counter++;
      if (!this.exploded && this.counter % 20 === 0) {
        this.distanceToTarget -= Math.floor(this.speed / 3);
        this.renderView();
        if (this.distanceToTarget <= 0) {
          this.explode();
        }
      }
      if (this.removalTime) {
        this.removalTime -= 1;
        this.view.alpha = this.removalTime / 1000;
        if (!this.removalTime) {
          this.stage.removeEntity(this);
        }
      }
    },
    renderView: function() {
      var color = 0xFFFFFF;
      this.clearView();
      this.view = new PIXI.Graphics();
      this.view.clear();
      this.view.beginFill(color);
      var step = 20;
      this.yPosition = 250 - (250 - this.target.view.y - this.target.view.height) * this.getPercentageToTarget();
      var xPositionTarget = this.target.view.x + this.target.view.width / 2;
      this.xPosition = window.boot.width / 2 + (xPositionTarget - window.boot.width / 2) * this.getPercentageToTarget();
      this.path.push({
        x: this.xPosition,
        y: this.yPosition
      });
      if (this.path.length > 500) {
        this.path.shift();
      }

      this.view.moveTo(this.path[0].x, this.path[0].y);
      for (var i = 0, l = this.path.length; i < l; i++) {
        step = step - 0.08;
        if (step < 1) {
          step = 1;
        }
        this.view.lineTo(this.path[i].x + step, this.path[i].y);
      }

      for (var ll = this.path.length - 1; ll; ll--) {
        this.view.lineTo(this.path[ll - 1].x, this.path[ll - 1].y);
      }

      this.view.endFill();
      this.view.alpha = 0.8;
      this.stage.addViewAfter(this.view, this.sea.seaView);
    },
    clearView: function() {
      if (this.view) {
        this.stage.removeView(this.view);
      }
    },
    explode: function() {
      this.exploded = true;
      if (Math.randInt() < this.fireSolution) {
        this.addExplosionHit();
        this.target.hitBy(this);
      } else {
        this.addExplosionFail();
      }
      this.removalTime = 1000;

    },
    addExplosionFail: function() {
      var size = 5;
      this.explosion = new pixEngine.ParticleGenerator({
        stage: this.stage,
        origin: {
          x: this.xPosition,
          y: this.yPosition
        },
        colors: [0xFFFFFF, 0x33CCFF, 0x8888FF],
        size: size,
        randomSize: size,
        speed: 0.1,
        duration: 100,
        direction: 3 * Math.PI / 2,
        spread: Math.PI / 4,
        delayRandom: 500,
        amount: 100,
        randomDuration: 100,
        fadding: false,
        gravity: -1,
        opacity: 1,
        randomOpacity: 0.6
      });
    },
    addExplosionHit: function() {
      var size = 3;
      this.explosion = new pixEngine.ParticleGenerator({
        stage: this.stage,
        origin: {
          x: this.xPosition,
          y: this.yPosition - 20
        },
        colors: [0xFFCC00, 0xFF5511, 0xFFFFAA],
        size: size,
        amount: 150,
        randomSize: size,
        speed: 1,
        duration: 100,
        delayRandom: 500,
        randomDuration: 60,
        fadding: false,
        gravity: 1,
        opacity: 0.5,
        randomOpacity: 0.6
      });
    }
  };
  window.boot.models.Torpedo = torpedo;
})();