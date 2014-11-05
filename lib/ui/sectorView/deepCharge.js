window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var projectile = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.sea = options.sea;
    this.submarineView = options.submarineView;
    this.weapon = options.weapon;
    this.target = options.target;
    this.origin = options.origin;
    this.primedDeep = options.deep;
    this.container = options.container;
    this.init();
  };
  projectile.prototype = {
    assets: "assets/objects/projectile.png",
    counter: 0,
    explosiveAmount: 400,
    speed: 800,
    zenitAltitude: 100,
    init: function() {
      this.origin.trigger('deepChargyFired');

      this.view = new PIXI.Sprite.fromImage(this.assets);

      this.deep = 0;

      this.distanceToTarget = this.sea.combatSimulator.getDistance(this.origin, this.target);

      this.stage.addNotVisualEntity(this);
      this.container.addChild(this.view);
      this.renderView();
    },
    tick: function(counter, active) {
      if (!active) return;
    },
    renderView: function() {},
    clearView: function() {
      if (this.view) {
        this.container.removeChild(this.view);
      }
    },
  };
  window.boot.models.DeepCharge = projectile;
})();