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
    this.primedDeep = options.deep || 50;
    this.container = options.container;
    this.initY = options.initY;
    this.init();
  };
  projectile.prototype = {
    verticalSpeed: 1,
    assets: "assets/objects/deepCharge.png",
    counter: 0,
    explosiveAmount: 400,
    deep: 0,
    maxSize: 16,
    init: function() {
      this.origin.trigger('deepChargyFired');
      window.dc = this;
      this.view = new PIXI.Sprite.fromImage(this.assets);

      this.deep = 0;

      this.distanceToTarget = this.origin.distance;
      this.view.y = this.initY;
      this.view.x = Math.randInt(window.boot.config.width);
      this.view.width = this.getSizeByDistance();
      this.view.height = this.getSizeByDistance();
      this.view.tint = this.getColorByDistance();
      this.stage.addNotVisualEntity(this);
      this.container.addChild(this.view);
      this.renderView();
    },
    getColorByDistance: function() {
      if (this.distanceToTarget > 2000) {
        return 0x000055;
      }
      if (this.distanceToTarget > 1500) {
        return 0x446699;
      }
      if (this.distanceToTarget > 1000) {
        return 0x5599CC;
      }
      if (this.distanceToTarget > 500) {
        return 0x55AADD;
      }
      return 0x55BBFF;
    },
    getSizeByDistance: function() {
      var size = this.maxSize * (2000 - this.distanceToTarget) / 2000;
      if (size < 1) {
        size = 1;
      }
      return size;
    },
    tick: function(counter, active) {
      if (!active || this.exploded) return;
      if ((counter + 3) % 6 === 0) {
        this.moveDown();
        this.renderView();
        this.checkDepth();
        if (Math.randInt() > 70) {
          this.addBubbles();
        }
      }
    },
    renderView: function() {
      var topDeep = this.submarineView.getCurrentTopDeep();
      var diff = this.deep - topDeep;
      this.view.y = this.submarineView.initSky + diff * 4;
      console.log(this.deep, this.view.y);
    },
    moveDown: function() {
      this.deep += this.verticalSpeed;
    },
    clearView: function() {
      if (this.view) {
        this.container.removeChild(this.view);
      }
    },
    checkDepth: function() {
      if (this.deep > this.primedDeep) {
        this.explode();
      }
    },
    explode: function() {
      this.exploded = true;
      this.addExplosion();
      if (this.hasHit()) {
        this.submarineView.deepChargeHit(this);
      }
      this.clearView();
    },
    hasHit: function() {
      return true;
    },
    addBubbles: function() {
      this.bubbles = new pixEngine.ParticleGenerator({
        container: this.container,
        stage: this.stage,
        origin: {
          x: this.view.x + Math.floor(this.view.width / 2),
          y: this.view.y + Math.floor(this.view.height / 2)
        },
        randomOrigin: {
          x: 5,
          y: 2
        },
        colors: [this.getColorByDistance()],
        size: Math.ceil(this.getSizeByDistance() / 5),
        randomSize: 1,
        speed: 0.1,
        direction: 3 * Math.PI / 2,
        spread: 2 * Math.PI,
        delayRandom: 300,
        duration: 200,
        amount: 1,
        randomAmount: 5,
        randomDuration: 100,
        fadding: true,
        gravity: -2,
        opacity: 0.3,
        randomOpacity: 0.6
      });
    },
    addExplosion: function() {
      this.explosion = new pixEngine.ParticleGenerator({
        container: this.container,
        stage: this.stage,
        origin: {
          x: this.view.x,
          y: this.view.y
        },
        randomOrigin: {
          x: 40 * Math.floor(this.getSizeByDistance() / this.maxSize),
          y: 40 * Math.floor(this.getSizeByDistance() / this.maxSize)
        },
        colors: [0xFFFFFF, 0xEEFFFF, 0x99FFFF, 0x9999FF, 0x555599, 0xEEEEFF],
        size: Math.ceil(this.getSizeByDistance() / 10),
        randomSize: Math.ceil(this.getSizeByDistance() / 2),
        type: 'square',
        speed: 0.5,
        direction: 3 * Math.PI / 2,
        spread: 2 * Math.PI,
        delayRandom: 1000,
        duration: 300,
        amount: 130 * Math.floor(this.getSizeByDistance() / this.maxSize),
        randomDuration: 100,
        fadding: true,
        gravity: -5,
        opacity: 0.6,
        randomOpacity: 0.6
      });
    }
  };
  window.boot.models.DeepCharge = projectile;
})();