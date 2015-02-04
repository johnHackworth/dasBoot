window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var deepChargeLauncher = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init(options);
  };
  deepChargeLauncher.prototype = {
    counter: 0,
    effortToLoad: 500,
    effortLoaded: 0,
    maxViewSize: 10,
    assets: 'assets/objects/deepCharge.png',
    status: 'empty',
    init: function(options) {
      this.boat = options.boat;
      this.position = options.position;
      this.stage = window.boot.currentStage;
      this.container = options.container;
      this.stage.addNotVisualEntity(this);
    },
    load: function() {
      if (this.status === 'empty') {
        this.status = 'loading';
        this.effortLoaded = 0;
      }
    },
    tick: function(counter, active) {
      if (!active) return;
      if (counter % 3 === 0 && this.upperView) {
        this.moveDeepCharge();
      }
      // console.log(counter % this.maxViewSize  );
      if (this.status === 'loading' && (this.counter % this.maxViewSize === 0)) {
        this.workOnLoading();
      }
    },
    workOnLoading: function() {
      var effort = this.boat.effortPerTurn || 1;
      this.effortLoaded += effort;
      var percentage = this.effortLoaded / this.effortToLoad;
      this.trigger('loading', percentage);
      if (this.effortLoaded > this.effortToLoad) {
        this.loadComplete();
        return;
      }
    },
    loadComplete: function() {
      this.status = 'ready';
      this.effortLoaded = this.effortToLoad;
      this.trigger('loaded');
    },
    launch: function() {
      this.upperView = new PIXI.Sprite.fromImage(this.assets);

      this.boat.container.addChild(this.upperView);
      this.upperView.x = this.boat.view.x; // + this.position.x;
      this.upperView.y = this.boat.view.y; //+ this.position.y;
      this.upperView.width = this.upperViewSize();
      this.upperView.height = this.upperViewSize();
    },
    moveDeepCharge: function() {
      var movedown = Math.floor(this.upperViewSize() / 5) + 1;
      this.upperView.y += movedown;
      if ((this.upperView.y + this.upperView.height) > (this.boat.view.y + this.boat.view.height)) {

        this.deepChargeSplash(this.upperView.x + Math.floor(this.upperView.width / 2), this.upperView.y + this.upperView.height);
        this.boat.container.removeChild(this.upperView);
        this.upperView = null;
      }
    },

    upperViewSize: function() {
      return Math.floor(this.maxViewSize - (this.boat.distance / 1000));
    },
    deepChargeSplash: function(x, y) {
      this.particleSpeed = this.particleSpeed || 0.5;
      this.splash = new pixEngine.ParticleGenerator({
        stage: this.stage,
        container: this.boat.container,
        origin: {
          x: x,
          y: y
        },
        randomOrigin: {
          x: 5,
          y: 0,
        },
        colors: [0xFFFFFF, 0x33CCFF, 0x8888FF],
        size: 2,
        randomSize: 2,
        speed: this.particleSpeed * (this.upperViewSize() / this.maxViewSize),
        duration: 100,
        direction: 3 * Math.PI / 2,
        spread: Math.PI / 4,
        delayRandom: 500,
        amount: 100,
        randomDuration: 100,
        fadding: true,
        gravity: 10 * (this.upperViewSize() / this.maxViewSize),
        opacity: 1,
        randomOpacity: 0.6,
        bottomY: this.boat.view.y + this.boat.view.height
      });
    }
  };

  window.boot.models.DeepChargeLauncher = deepChargeLauncher;
})();