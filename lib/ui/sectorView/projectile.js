window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var projectile = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.sea = options.sea;
    this.target = options.target;
    this.origin = options.origin;
    this.init();
  };
  projectile.prototype = {
    assets: "assets/objects/projectile.png",
    counter: 0,
    speed: 360,
    init: function() {
      this.origin.trigger('artilleryFired');

      this.view = new PIXI.Sprite.fromImage(this.assets);

      this.distanceToTarget = this.sea.combatSimulator.getDistance(this.origin, this.target);
      this.originalDistance = this.distanceToTarget;
      this.fireSolution = this.sea.combatSimulator.getFireSolution(this.origin, this.target);

      this.stage.addEntity(this);
      this.renderView();
    },
    getPercentageToTarget: function() {
      return 1 - (this.distanceToTarget / this.originalDistance);
    },
    tick: function() {
      this.counter++;
      if (this.counter % 20 === 0) {
        this.distanceToTarget -= Math.floor(this.speed / 3);
        this.renderView();
        if (this.distanceToTarget <= 0) {
          this.explode();
        }
      }
    },
    renderView: function() {
      var percentage = this.getPercentageToTarget();
      var yPosition = null;
      if (percentage < 0.50) {
        yPosition = this.origin.view.y - (100 * 2 * percentage);
      } else {
        var wholefall = (250 - (this.origin.view.y - 100));
        var fall = wholefall * 2 * (percentage - 0.50);
        yPosition = this.origin.view.y + fall;
      }
      var xPositionTarget = this.target.view.x + this.target.view.width / 2;
      var xPosition = xPositionTarget + (window.boot.width / 2 - xPositionTarget) * this.getPercentageToTarget();

      this.view.x = xPosition;
      this.view.y = yPosition;
    },
    clearView: function() {
      if (this.view) {
        this.stage.removeView(this.view);
      }
    },
    explode: function() {
      if (Math.randInt() < this.fireSolution) {
        console.log('explode')
      } else {
        console.log('fail')
      }
      this.stage.removeEntity(this);
    }
  };
  window.boot.models.Projectile = projectile;
})();