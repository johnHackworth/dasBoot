window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var weatherIndicator = function(options) {
    this.world = options.world;
    this.x = options.x;
    this.y = options.y;
    this.stage = options.stage;
    this.initialize();
  };
  weatherIndicator.prototype = {
    clickable: true,
    weatherImages: {
      'clear': 'assets/map/sunny.png',
      'foggy': 'assets/map/foggy.png',
      'cloudy': 'assets/map/cloudy.png',
      'storm': 'assets/map/storm.png',
    },
    initialize: function() {
      this.textures = {
        clear: new PIXI.Texture.fromImage(this.weatherImages.clear),
        foggy: new PIXI.Texture.fromImage(this.weatherImages.foggy),
        cloudy: new PIXI.Texture.fromImage(this.weatherImages.cloudy),
        storm: new PIXI.Texture.fromImage(this.weatherImages.storm)
      };
      this.view = new PIXI.Sprite.fromImage(this.weatherImages.clear);
      this.view.scale.x = 0.5;
      this.view.scale.y = 0.5;
      this.view.x = this.x;
      this.view.y = this.y;
      this.stage.addVisualEntity(this.view);
    },
    paintSectorWeather: function(sector) {
      var weather = sector.weather.name;
      this.view.setTexture(this.textures[weather]);
      this.addText(weather);
    },
    addText: function(text) {
      if (this.text) {
        this.stage.removeView(this.text);
      }
      this.text = this.stage.addText(text, {
        x: this.x + this.view.width + 10,
        y: this.y + 14,
        fontSize: '16',
        color: '#FFCCCC',
        fontName: 'specialElite'
      });
    }
  };
  window.boot.ui.WeatherIndicator = weatherIndicator;
})();