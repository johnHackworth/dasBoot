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
      var color = 0xFFFFFF;
      this.clearView();
      this.view = new PIXI.Graphics();
      this.view.clear();
      this.view.beginFill(color);
      var step = 20;
      var yPosition = 250 - (250 - this.target.view.y - this.target.view.height) * this.getPercentageToTarget();
      var xPositionTarget = this.target.view.x + this.target.view.width / 2;
      var xPosition = window.boot.width / 2 + (xPositionTarget - window.boot.width / 2) * this.getPercentageToTarget();
      this.path.push({
        x: xPosition,
        y: yPosition
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
      this.view.alpha = 1;
      this.stage.addViewAfter(this.view, this.sea.seaView);
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
  window.boot.models.Torpedo = torpedo;
})();