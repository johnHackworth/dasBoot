window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var controlGauge = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.x = options.x;
    this.y = options.y;
    this.sea = options.sea;
    this.boat = this.stage.playerBoat;
    this.container = options.container;
    this.init();
  };
  controlGauge.prototype = {
    intendedDeep: 0,
    assets: {
      background: 'assets/ui/controlGauge.png',
      actualIndicator: 'assets/ui/controlGaugePointer.png',
    },
    width: 150,
    init: function() {
      this.addView();
    },

    addView: function() {
      this.view = new PIXI.Sprite.fromImage(this.assets.background);
      this.view.x = this.x;
      this.view.y = this.y;
      this.view.height = this.width;
      this.view.width = this.width;
      this.view.interactive = (true);
      this.view.click = this.setStance.bind(this);
      this.container.addChild(this.view);
      this.addGauges();
    },
    addGauges: function() {
      this.actualIndicator = new PIXI.Sprite.fromImage(this.assets.actualIndicator);

      this.actualIndicator.height = 10;
      this.actualIndicator.width = this.width / 3 - 10;
      this.actualIndicator.x = this.x + this.width / 2;
      this.actualIndicator.y = this.y + this.width / 2 - this.actualIndicator.height / 2;
      this.actualIndicator.anchor.set(0.05, 0.5);
      this.container.addChild(this.actualIndicator);
      this.adjustGaugesRotation();
    },
    adjustGaugesRotation: function() {
      if (this.boat.stance === 'ahead') {
        this.actualIndicator.rotation = 0;
      } else if (this.boat.stance === 'back') {
        this.actualIndicator.rotation = Math.PI;
      } else if (this.boat.stance === 'attack') {
        this.actualIndicator.rotation = Math.PI / 4;
      } else if (this.boat.stance === 'defense') {
        this.actualIndicator.rotation = 3 * Math.PI / 4;
      } else {
        this.actualIndicator.rotation = Math.PI / 2;
      }
    },
    setStance: function(ev) {
      var top = 140;
      var position = ev.getLocalPosition(this.view);

      var angle = -1 * Math.atan2(150 - position.x, 150 - position.y) - Math.PI / 2;
      console.log(angle);
      if (angle >= -1 && angle < 0.15) {
        this.boat.stance = 'ahead';
      } else if (angle >= 0.15 && angle < 1.15) {
        this.boat.stance = 'attack';

      } else if (angle >= 1.15 || angle < -4.30) {
        this.boat.stance = 'stop';

      } else if (angle >= -4.30 && angle < -3.35) {
        this.boat.stance = 'defense';

      } else if (angle >= -3.35 && angle < -2.20) {
        this.boat.stance = 'back';

      }
    }
  };
  window.boot.ui.ControlGauge = controlGauge;
})();