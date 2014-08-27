window.pixEngine = window.pixEngine || {};

pixEngine.ParticleGenerator = function(options) {
  this.options = options;
  this.stage = options.stage;
  this.origin = options.origin;
  this.speed = typeof(options.speed) != "undefined" ? options.speed : 10;
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
  this.fadeInFadeOut = options.fadeInFadeOut;
  this.brittle = options.brittle;
  this.delay = options.delay || 0;
  this.delayRandom = options.delayRandom || 0;
  this.direction = typeof options.direction == 'undefined' ? 0 : options.direction;
  this.spread = options.spread || 2 * Math.PI;
  this.topY = options.topY;
  this.bottomY = options.bottomY;
  this.after = options.after;
  this.before = options.before;
  this.randomOrigin = options.randomOrigin || {
    x: 0,
    y: 0
  };
  this.type = options.type;
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
    this.liveParticles = this.amount + this.randomAmount;
    for (var n = this.amount + randomAmount; n; n--) {
      setTimeout(this.createParticle.bind(this), this.delay + Math.randInt(this.delayRandom));
    }
    if (this.after) {
      this.stage.addEntityAfter(this, this.after);
    } else if (this.before) {
      this.stage.addEntityBefore(this, this.before);
    } else {
      this.stage.addEntity(this);
    }
  },
  getRandomColor: function() {
    var n = Math.randInt(this.colors.length);
    return this.colors[n];
  },
  getRandomOrigin: function() {
    var x = Math.floor(this.randomOrigin.x / 2) - Math.randInt(this.randomOrigin.x);
    var y = Math.floor(this.randomOrigin.y / 2) - Math.randInt(this.randomOrigin.y);
    return {
      x: x,
      y: y
    };
  },
  createParticle: function() {
    if (this.options.debug) {
      debugger;
    }
    if (this.view) {

      var particle = new PIXI.Graphics();
      particle.clear();
      particle.beginFill(this.getRandomColor());
      var size = this.size + (1 * Math.randInt(this.randomSize));
      var randomOrigin = this.getRandomOrigin();
      var center = {
        x: Math.floor(this.origin.x + randomOrigin.x - size / 2),
        y: Math.floor(this.origin.y + randomOrigin.y - size / 2)
      };
      var speed = this.speed + (1 * this.randomSpeed);

      particle.direction = (this.direction + this.spread / 2) - this.spread * Math.random();

      particle.velocity = {
        x: Math.cos(particle.direction) * speed,
        y: Math.sin(particle.direction) * speed
      };
      particle.duration = this.duration + (1 * Math.randInt(this.randomDuration));

      if (this.type == 'hexagon') {
        this.createHexagonParticle(particle, {
          x: 0,
          y: 0
        }, size);
      } else if (this.type == 'trapezoid') {
        this.createTrapezoidParticle(particle, {
          x: 0,
          y: 0
        }, size);
      } else {
        this.createSquareParticle(particle, {
          x: 0,
          y: 0
        }, size);
      }
      particle.endFill();

      if (this.fadeInFadeOut) {
        particle.alphaReached = false;
        particle.alpha = 0;
        particle.alphaGoal = this.opacity + (Math.random() * this.randomOpacity);
        particle.fadding = particle.alphaGoal / particle.duration * 2;
      } else {
        particle.alpha = this.opacity + (Math.random() * this.randomOpacity);
        particle.fadding = this.fadding ? particle.alpha / particle.duration : 0;
      }

      particle.viewType = 'particle';
      if (this.after) {
        this.stage.addViewAfter(particle, this.after);
      } else if (this.before) {
        this.stage.addViewBefore(particle, this.before);
      } else {
        this.stage.addVisualEntity(particle);
      }
      particle.x = center.x;
      particle.y = center.y;
      this.view.push(particle);
    }
  },
  createSquareParticle: function(particle, center, size) {
    particle.moveTo(center.x, center.y);
    particle.lineTo(center.x + size, center.y);
    particle.lineTo(center.x + size, center.y + size);
    particle.lineTo(center.x, center.y + size);
    particle.lineTo(center.x, center.y);
  },
  createHexagonParticle: function(particle, center, size) {
    var cut = size / 4;
    particle.moveTo(center.x, center.y);
    particle.lineTo(center.x + size / 2 - cut, center.y);
    particle.lineTo(center.x + size / 2, center.y + size / 2);
    particle.lineTo(center.x + size / 2 - cut, center.y + size);
    particle.lineTo(center.x - size / 2 + cut, center.y + size);
    particle.lineTo(center.x - size / 2, center.y + size / 2);
    particle.lineTo(center.x - size / 2 + cut, center.y);
    particle.lineTo(center.x, center.y);
  },
  createTrapezoidParticle: function(particle, center, size) {
    var cut = size / 4;
    particle.moveTo(center.x, center.y);
    particle.lineTo(center.x + size / 2 - cut, center.y);
    particle.lineTo(center.x + size / 2, center.y + size / 2);
    particle.lineTo(center.x - size / 2, center.y + size / 2);
    particle.lineTo(center.x - size / 2 + cut, center.y);
    particle.lineTo(center.x, center.y);
  },
  tick: function(counter) {
    if (this.options.debug) {
      debugger;
    }
    var removables = [];
    for (var i in this.view) {
      this.view[i].x += this.view[i].velocity.x;
      this.view[i].y += this.view[i].velocity.y;

      if (this.bottomY && this.view[i].y > this.bottomY) {
        this.view[i].y = this.bottomY;
      }
      // if (this.options.debug) console.log(this.view[i].y, this.topY);
      if (this.topY && this.view[i].y < this.topY) {
        //if (this.options.debug) console.log(this.view[i].y, this.topY);
        this.view[i].y = this.topY;
      }
      this.view[i].velocity.y += this.gravity / 600;
      if (this.fadeInFadeOut) {
        if (this.view[i].alphaReached) {
          this.view[i].alpha -= this.view[i].fadding;
        } else {
          this.view[i].alpha += this.view[i].fadding;
        }
        if (this.view[i].alpha >= this.view[i].alphaGoal) {
          this.view[i].alphaReached = true;
        }
      } else {
        this.view[i].alpha -= this.view[i].fadding;
      }
      if (this.brittle) {
        if (Math.random() > this.brittle) {
          this.view[i].alpha = Math.random() * this.opacity + (Math.random() * this.randomOpacity);
        }
        if (Math.random() > this.brittle) {
          this.view[i].x += 1 - Math.randInt(3);
        }
        if (Math.random() > this.brittle) {
          this.view[i].y += 1 - Math.randInt(3);
        }
      }
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
      this.liveParticles--;
    }
    if (!this.view.length && !this.view.liveParticles) {
      this.view = null;
      this.stage.removeEntity(this);
    }

  }
};