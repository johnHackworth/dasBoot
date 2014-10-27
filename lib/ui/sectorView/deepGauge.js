window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var deepGauge = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.x = options.x;
    this.y = options.y;
    this.sea = options.sea;
    this.boat = this.stage.playerBoat;
    this.init();
  };
  deepGauge.prototype = {
    intendedDeep: 0,
    assets: {
      background: 'assets/ui/deepGauge.png',
      actualIndicator: 'assets/ui/pointerRed.png',
      targetIndicator: 'assets/ui/pointerGrey.png'
    },
    width: 150,
    init: function() {
      this.intendedDeep = this.boat.deep;
      this.addView();
    },

    addView: function() {
      this.view = new PIXI.Sprite.fromImage(this.assets.background);
      this.view.x = this.x;
      this.view.y = this.y;
      this.view.height = this.width;
      this.view.width = this.width;
      this.view.interactive = (true);
      this.view.click = this.setDeep.bind(this);
      this.stage.addVisualEntity(this.view);
      this.addGauges();
    },
    addGauges: function() {
      this.actualIndicator = new PIXI.Sprite.fromImage(this.assets.actualIndicator);

      this.actualIndicator.height = 20;
      this.actualIndicator.width = this.width / 2 - 10;
      this.actualIndicator.x = this.x + this.width / 2;
      this.actualIndicator.y = this.y + this.width / 2 - this.actualIndicator.height / 2;
      this.actualIndicator.anchor.set(0.05, 0.5);
      this.stage.addVisualEntity(this.actualIndicator);

      this.targetIndicator = new PIXI.Sprite.fromImage(this.assets.targetIndicator);
      this.targetIndicator.anchor.set(0.05, 0.5);
      this.targetIndicator.height = 20;
      this.targetIndicator.width = this.width / 2 - 10;
      this.targetIndicator.position.x = this.x + this.width / 2;
      this.targetIndicator.y = this.y + this.width / 2 - this.targetIndicator.height / 2;

      this.stage.addVisualEntity(this.targetIndicator);
      this.adjustGaugesRotation();
    },
    adjustGaugesRotation: function() {
      var origin = -1.35 * Math.PI;
      var end = 0.35 * Math.PI;
      var difference = end - origin;
      var deep = origin + difference * this.boat.deep / 260;
      var intended = origin + difference * this.intendedDeep / 260;
      this.actualIndicator.rotation = deep;
      this.targetIndicator.rotation = intended;
    },
    setDeep: function(ev) {
      var top = 140;
      var position = ev.getLocalPosition(this.view);

      var angle = -1 * Math.atan2(150 - position.x, 150 - position.y) - Math.PI / 2;
      var origin = -1.35 * Math.PI;
      var end = 0.35 * Math.PI;
      if (angle < origin || angle > end) {
        this.intendedDeep = 0;
        return;
      }

      var difference = end - origin;
      var angleDifference = angle - origin;
      this.intendedDeep = 260 * angleDifference / difference;
    }
  };
  window.boot.ui.DeepGauge = deepGauge;
})();