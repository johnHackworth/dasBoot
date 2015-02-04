window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var rain = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.container = options.container;
    this.direction = options.direction || 1.3 * Math.PI / 2;
    this.spread = options.spread || 0.5;
    this.is3d = options.is3d || false;
    this.y = options.y || 0;
    this.init();
  };
  rain.prototype = {
    init: function() {
    },
    makeRain: function(intensity) {
      intensity = intensity || 1;
      var modificator3d = 1;
      if(this.is3d) {
        modificator3d = 1+ Math.randInt(4);
      }
      var rain = new pixEngine.ParticleGenerator({
        stage: this.stage,
        container: this.container,
        origin: {
          x: this.container.width / 2,
          y: this.y
        },
        randomOrigin: {
          y: 0,
          x: this.container.width
        },
        colors: [0x009999, 0x0099CC, 0x6699FF],
        size: Math.ceil(3 / modificator3d),
        randomSize: Math.floor(3 / modificator3d),
        speed: Math.ceil((3 + intensity) / modificator3d),
        duration: 40 / modificator3d,
        amount: 10 * intensity,
        direction: this.direction,
        particleRotation: this.direction,
        spread: this.spread,
        randomDuration: 20,
        randomDelay: 10,
        fadding: false,
        gravity: Math.ceil((10) / modificator3d),
        opacity: 0.4,
        randomOpacity: 0.6,
        delayRandom: 100,
        type: 'pixelLine'
      });
    },
  };
  window.boot.models.Rain = rain;
})();