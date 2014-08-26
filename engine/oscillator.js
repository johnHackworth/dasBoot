window.pixEngine = window.pixEngine || {};

pixEngine.Oscillator = function(options) {
  this.stage = options.stage;
  this.width = options.width;
  this.color = options.color;
  this.particleWidth = options.particleWidth || 20;
  this.particleHeight = options.particleHeight || 20;
  this.origin = options.origin;
  this.originY = this.origin.y;
  this.oscillationHeight = options.oscillationHeight || 10;
  this.period = options.period || 10;
  this.after = options.after;
  this.before = options.before;
  this.init();
};
pixEngine.Oscillator.prototype = {
  init: function() {
    this.initParticles();
  },
  initParticles: function() {
    this.view = [];
    var pointer = this.origin.x;
    var max = this.origin.x + this.width;
    while (pointer < max) {
      this.createParticle(pointer);
      pointer += this.particleWidth;
    }

    if (this.after) {
      this.stage.addEntityAfter(this, this.after);
    } else if (this.before) {
      this.stage.addEntityBefore(this, this.before);
    } else {
      this.stage.addEntity(this);
    }
  },
  createParticle: function(pointer) {
    var particle = new PIXI.Graphics();
    particle.clear();
    particle.beginFill(this.color);
    var center = {
      x: pointer,
      y: this.origin.y + this.particleHeight / 2
    };
    this.createSquareParticle(particle, center);
    particle.aggregated = 0;
    particle.endFill();
    particle.viewType = 'particle';
    this.view.push(particle);
  },
  createSquareParticle: function(particle, center) {
    particle.moveTo(center.x, center.y);
    particle.lineTo(center.x + this.particleWidth, center.y);
    particle.lineTo(center.x + this.particleWidth, center.y + this.particleHeight);
    particle.lineTo(center.x, center.y + this.particleHeight);
    particle.lineTo(center.x, center.y);
  },
  tick: function(counter) {
    if (counter % this.period === 0) {
      counter = counter / this.period;
      for (var l = this.view.length; l; l--) {
        this.view[l - 1].aggregated = 1 - Math.randInt(3);
        this.view[l - 1].y = this.origin.y + this.view[l - 1].aggregated + Math.cos(counter + l) * this.oscillationHeight;
      }
    }
  },
  setInactive: function() {
    for (var l = this.view.length; l; l--) {
      this.view[l - 1].visible = false;
    }
  },
  setActive: function() {
    for (var l = this.view.length; l; l--) {
      this.view[l - 1].visible = true;
    }
  }
};