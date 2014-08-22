window.pixEngine = window.pixEngine || {};

pixEngine.ParticleGenerator = function(options) {
  this.stage = options.stage;
  this.origin = options.origin;
  this.speed = options.speed || 10;
  this.randomSpeed = options.randomSpeed || 0;
  this.colors = options.colors;
  this.amount = options.amount || 20;
  this.randomAmount = options.randomAmount || 0;
  this.size = options.size || 10;
  this.opacity = options.opacity || 1;
  this.randomOpacity = options.randomOpacity || 0;
  this.randomSize = options.randomSize || 0;
  this.duration = options.duration || 100;
  this.randomDuration = options.randomDuration || 0;
  this.gravity = options.gravity || 10;
  this.fadding = options.fadding;
  this.delay = options.delay || 0;
  this.delayRandom = options.delayRandom || 0;
  this.direction = options.direction || 0;
  this.spread = options.spread || 2 * Math.PI;
  this.init();
};
pixEngine.ParticleGenerator.prototype = {
  init: function() {
    this.initParticles();
  },
  initParticles: function() {
    this.view = [];
    var randomAmount = 1 * Math.randInt(this.randomAmount);
    this.createParticle();
    for (var n = this.amount + randomAmount; n; n--) {
      setTimeout(this.createParticle.bind(this), this.delay + Math.randInt(this.delayRandom));
    }
    this.stage.addEntity(this);
  },
  getRandomColor: function() {
    var n = Math.randInt(this.colors.length);
    return this.colors[n];
  },
  createParticle: function() {
    var particle = new PIXI.Graphics();
    particle.clear();
    particle.beginFill(this.getRandomColor());
    var size = this.size + (1 * Math.randInt(this.randomSize));
    var center = {
      x: this.origin.x - size / 2,
      y: this.origin.y - size / 2
    };
    particle.moveTo(center.x, center.y);
    var speed = this.speed + (1 * this.randomSpeed);

    particle.direction = (this.direction + this.spread / 2) - this.spread * Math.random();

    particle.velocity = {
      x: Math.cos(particle.direction) * speed,
      y: Math.sin(particle.direction) * speed
    };
    particle.duration = this.duration + (1 * Math.randInt(this.randomDuration));



    particle.lineTo(center.x + size, center.y);
    particle.lineTo(center.x + size, center.y + size);
    particle.lineTo(center.x, center.y + size);
    particle.lineTo(center.x, center.y);
    particle.endFill();
    particle.alpha = this.opacity + (Math.random() * this.randomOpacity);
    particle.fadding = this.fadding ? particle.alpha / particle.duration : 0;
    particle.viewType = 'particle';
    this.stage.addVisualEntity(particle);
    this.view.push(particle);
  },
  tick: function(counter) {
    var removables = [];
    for (var i in this.view) {
      this.view[i].x += this.view[i].velocity.x;
      this.view[i].y += this.view[i].velocity.y;
      this.view[i].velocity.y += this.gravity / 600;
      this.view[i].alpha -= this.view[i].fadding;
      this.view[i].duration--;
      if (!this.view[i].duration) {
        removables.push(this.view[i]);
      }
    }
    this.removeDeprecated(removables);
  },
  removeDeprecated: function(removables) {
    while (removables.length) {
      var particle = removables.pop();
      this.view.removeElement(particle);
      this.stage.removeView(particle);
    }
    if (!this.view.length) {
      this.view = null;
      this.stage.removeEntity(this);
    }

  }
};