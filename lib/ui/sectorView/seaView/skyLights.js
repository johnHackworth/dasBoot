window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var skyLights = function(options) {
    this.init(options);
  };
  skyLights.prototype = {
    width: 150,
    height: 150,
    assets: {
      day: 'assets/objects/sun.png',
      night: 'assets/objects/moon.png',
    },
    init: function(options) {
      this.view = [];
      this.sea = options.sea;
      this.container = options.container;
      this.stage = options.stage;
      this.x = options.x;
      this.originX = this.x;
      this.y = options.y;
      this.originY = this.y;
      this.sector = options.sector;
      this.world = options.sector.world;
      if (!options.onlyStars) {
        this.getPositions();
        this.addView();
        this.addSpecialViews();
      } else {
        this.addOnlyStars();
      }
    },
    getPositions: function() {
      var time = (this.world.time.getTime()) % 24;
      if (time < 6) {
        this.skyImage = this.assets.night;
        this.x = this.originX + 200 + Math.randInt(400);
        this.y = this.originY - 100 + Math.randInt(100);
      } else if (time < 12) {
        this.skyImage = this.assets.day;
        this.x = this.originX + 200 + Math.randInt(400);
        this.y = this.originY + 0 + Math.randInt(100);
      } else if (time < 18) {
        this.skyImage = this.assets.day;
        this.x = this.originX + 400 + Math.randInt(400);
        this.y = this.originY - 100 + Math.randInt(100);
      } else if (time < 24) {
        this.skyImage = this.assets.night;
        this.x = this.originX + 400 + Math.randInt(400);
        this.y = this.originY + 0 + Math.randInt(100);
      }
    },
    addView: function() {
      var view = new PIXI.Sprite.fromImage(this.skyImage);
      view.x = this.x;
      view.y = this.y;
      view.height = this.width;
      view.width = this.width;
      view.tint = this.sector.weather.skyTint;
      view.alpha = this.sector.weather.visibility;
      this.container.addChild(view);
      this.view.push(view);
    },
    addStars: function() {
      var stasts = new pixEngine.ParticleGenerator({
        stage: this.stage,
        container: this.container,
        type: 'pixelCircle',
        origin: {
          x: this.originX + Math.floor(boot.config.width / 2),
          y: this.originY + 50
        },
        tint: this.sector.weather.skyTint,
        randomOrigin: {
          x: this.originX + boot.config.width,
          y: this.originY + 90
        },
        colors: [0xFFFFFF, 0xFFFFEE, 0xEEFFFF],
        size: 1,
        randomSize: 2,
        speed: 0,
        duration: 500,
        direction: 0, // Math.PI + Math.random() * Math.PI,
        spread: 0,
        delayRandom: 20,
        amount: 1,
        randomAmount: 30,
        randomDuration: 45000,
        brittle: 0.99,
        gravity: -0.00000001,
        opacity: 0.7,
        randomOpacity: 0.3
      });

      // for (var i = 0; i < numberOfStars; i++) {
      //   var size = Math.randInt(2) + 1;
      //   var view = this.stage.addBackgroundToContainer(this.container, 0, 0, size, size, 0xFFFFFF, 1);
      //   view.x = Math.randInt(boot.config.width);
      //   view.y = Math.randInt(150);
      //   view.tint = this.sector.weather.tint;
      //   view.alpha = this.sector.weather.visibility;
      //   this.view.push(view);
      // }
    },
    addWaterReflections: function() {
      for (var i = 0; i < 5; i++) {
        var waterReflections = new pixEngine.ParticleGenerator({
          stage: this.stage,
          container: this.container,
          type: 'pixelLine',
          origin: {
            x: this.x + 150 - i * 15,
            y: 175 - i * 7
          },
          lineFactor: 20,
          tint: this.sector.weather.tint,
          randomOrigin: {
            x: 0,
            y: 0
          },
          colors: [0xFFFFFF],
          size: 150 - i * 30,
          randomSize: 2,
          speed: 0,
          duration: 55500,
          direction: 0, // Math.PI + Math.random() * Math.PI,
          spread: 0,
          delayRandom: 20,
          amount: 1,
          randomAmount: 0,
          randomDuration: 45000,
          brittle: 0.98,
          gravity: -0.00000001,
          opacity: 0.1,
          randomOpacity: 0
        });
      }
    },
    addOnlyStars: function() {
      var time = (this.world.time.getTime()) % 24;
      if (time < 6 || time >= 18) {
        this.addStars();
      }
    },
    addSpecialViews: function() {
      var time = (this.world.time.getTime()) % 24;
      if (time < 6 || time >= 18) {
        this.addStars();
      }
      if (this.sector.weather.name === 'clear') {
        this.addWaterReflections();
      }
    }
  };

  window.boot.ui.SkyLights = skyLights;
})();