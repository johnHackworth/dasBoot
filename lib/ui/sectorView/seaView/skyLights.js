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
      this.sea = options.sea;
      this.container = options.container;
      this.x = options.x;
      this.y = options.y;
      this.sector = options.sector;
      this.world = options.sector.world;
      this.getPositions();
      this.addView();
    },
    getPositions: function() {
      var time = (this.world.time.getTime()) % 24;
      if (time < 6) {
        this.skyImage = this.assets.night;
        this.x = 200 + Math.randInt(400);
        this.y = -100 + Math.randInt(100);
      } else if (time < 12) {
        this.skyImage = this.assets.day;
        this.x = 200 + Math.randInt(400);
        this.y = 0 + Math.randInt(100);
      } else if (time < 18) {
        this.skyImage = this.assets.day;
        this.x = 400 + Math.randInt(400);
        this.y = -100 + Math.randInt(100);
      } else if (time < 24) {
        this.skyImage = this.assets.night;
        this.x = 400 + Math.randInt(400);
        this.y = 0 + Math.randInt(100);
      }
    },
    addView: function() {
      this.view = new PIXI.Sprite.fromImage(this.skyImage);
      this.view.x = this.x;
      this.view.y = this.y;
      this.view.height = this.width;
      this.view.width = this.width;
      this.view.tint = this.sector.weather.tint;
      this.view.alpha = this.sector.weather.visibility;
      this.container.addChild(this.view);
    },
  };

  window.boot.ui.SkyLights = skyLights;
})();