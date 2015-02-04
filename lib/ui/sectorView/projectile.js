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
    this.container = options.container;
    this.init();
  };
  projectile.prototype = {
    assets: "assets/objects/projectile.png",
    counter: 0,
    explosiveAmount: 100,
    speed: 800,
    zenitAltitude: 100,
    init: function() {
      this.origin.trigger('artilleryFired');

      this.view = new PIXI.Sprite.fromImage(this.assets);

      this.distanceToTarget = this.sea.combatSimulator.getDistance(this.origin, this.target);
      this.originalDistance = this.distanceToTarget;
      this.fireSolution = this.sea.combatSimulator.getFireSolution(this.origin, this.target);

      this.zenitAltitude = Math.floor(this.distanceToTarget / 100);
      this.addExplosionFire();
      this.stage.addNotVisualEntity(this);
      this.container.addChild(this.view);
      this.renderView();
    },
    addExplosionFire: function() {
      var size = this.getSize();
      var weaponPos = this.weapon ? {
        x: this.origin.view.x + this.weapon.position.x * this.origin.getCurrentScale(),
        y: this.origin.view.y + this.weapon.position.y * this.origin.getCurrentScale()
      } : {
        x: this.origin.view.width / 2,
        y: 2 * this.origin.view.height / 3
      };
      this.explosion = new pixEngine.ParticleGenerator({
        stage: this.stage,
        origin: {
          x: weaponPos.x,
          y: weaponPos.y
        },
        colors: [0xFF5555, 0xFFCC55, 0xFF8888, 0xCC9977, 0xCCFF99, 0xAA3333, 0xCCCCCC],
        size: size.x,
        randomSize: size.y,
        speed: 0.1 * size.y,
        duration: 100,
        amount: 50,
        randomDuration: 20,
        randomDelay: 100,
        fadding: true,
        gravity: 0.5,
        opacity: 0.6,
        randomOpacity: 0.6,
        delayRandom: 100,
        type: 'pixel'
      });
    },
    addExplosionHit: function() {
      var size = 5;
      this.explosion = new pixEngine.ParticleGenerator({
        stage: this.stage,
        origin: {
          x: this.view.x,
          y: this.impactOnRoom.view.y + Math.floor(this.impactOnRoom.view.height / 2)
        },
        bottomY: this.impactOnRoom.view.y + this.impactOnRoom.view.height,
        colors: [0xFF5555, 0xFFCC55, 0xFF8888, 0xCC9977, 0xCCFF99, 0xAA3333, 0xCCCCCC],
        size: size,
        randomSize: size,
        speed: 0.5,
        duration: 30,
        amount: 10,
        randomDuration: 0,
        fadding: false,
        gravity: 10,
        opacity: 0.6,
        randomOpacity: 0.6,
        delayRandom: 1000,
        type: 'pixel'
      });
    },
    addExplosionWater: function() {
      var size = 6;
      this.explosion = new pixEngine.ParticleGenerator({
        stage: this.stage,
        origin: {
          x: this.view.x,
          y: this.view.y
        },
        bottomY: this.view.y,
        colors: [0xFFFFFF, 0x99FFFF, 0x9999FF],
        size: 1,
        randomSize: size,
        speed: 2,
        direction: Math.PI / 2,
        spread: Math.PI / 4,
        delayRandom: 500,
        duration: 40,
        amount: 100,
        randomDuration: 100,
        fadding: true,
        gravity: 40,
        opacity: 0.6,
        randomOpacity: 0.6,
        type: 'pixel'
      });
    },
    getPercentageToTarget: function() {
      return 1 - (this.distanceToTarget / this.originalDistance);
    },
    tick: function(counter, active) {
      if (!active) return;
      this.counter++;
      if (this.hitting) {
        this.tickHitting();
      } else {
        if (this.counter % 1 === 0) {
          this.distanceToTarget -= Math.floor(this.speed / 60);
          if (this.counter % 10 === 0) {
            if (this.getPercentageToTarget() < 0.5) {
              this.speed -= 5;
            } else {
              this.speed += 10;
            }
          }
          this.renderView();
          if (this.distanceToTarget <= 0) {
            this.hit();
          }

        }
      }
    },
    calculatePoint: function(x) {
      var weaponPos = this.weapon ? {
        x: this.origin.view.x + this.weapon.position.x * this.origin.getCurrentScale(),
        y: this.origin.view.y + this.weapon.position.y * this.origin.getCurrentScale()
      } : {
        x: this.origin.view.width / 2,
        y: 2 * this.origin.view.height / 3
      };

      var origin = {
        x: weaponPos.x,
        y: weaponPos.y
      };
      var targetX = this.target.view ? this.target.view.x : 50;
      var targetY = this.target.view ? this.target.view.y : 250;
      var target = {
        x: targetX,
        y: targetY
      };
      var zenit = {
        x: (target.x + origin.x) / 2,
        y: origin.y - this.zenitAltitude
      };



      // oY = c;
      // zY = a + b + oY;
      // zY - a - oY = b;
      // tY = a * 4 + b * 2 + oY
      // tY = a * 4 + 2 * zY - 2 * a - 2 * oY + oY,
      // tY = 2 * a + 2 * zY - 2 * oY;
      var A = target.y / 2 - zenit.y + origin.y;
      var B = (target.y - origin.y - A * 4) / 2;

      var y = A * x * x + B * x + origin.y;
      return y;
    },
    renderView: function() {
      var targetX = this.target.view ? this.target.view.x : 50;
      var targetY = this.target.view ? this.target.view.y : 250;
      var targetWidth = this.target.view ? this.target.view.width : 100;
      var percentage = this.getPercentageToTarget();
      var yPosition = null;

      var weaponPos = this.weapon ? this.weapon.position : {
        x: this.origin.view.width / 2,
        y: 2 * this.origin.view.height / 3
      };


      var xPositionTarget = targetX + targetWidth / 2;
      var xOrigin = this.origin.view.x + weaponPos.x;
      var xPosition = xOrigin + (window.boot.config.width / 2 - xOrigin) * this.getPercentageToTarget();

      this.view.x = xPosition;
      // this.view.y = yPosition;
      this.view.y = this.calculatePoint(this.getPercentageToTarget() * 2);

      var size = this.getSize();
      this.view.width = size.x;
      this.view.height = size.y;
    },
    clearView: function() {
      if (this.view) {
        this.container.removeChild(this.view);
      }
    },
    getSize: function() {

      var d = this.distanceToTarget / 1000;
      if (d > 7) {
        return {
          x: 1,
          y: 1
        };
      }
      if (d > 5) {
        return {
          x: 1,
          y: 2
        };
      }
      if (d > 3) {
        return {
          x: 2,
          y: 3
        };
      }
      if (d > 1) {
        return {
          x: 3,
          y: 4
        };
      }
      if (d > 0.4) {
        return {
          x: 5,
          y: 6
        };
      }

      return {
        x: 7,
        y: 8
      };
    },
    hit: function() {
      if (this.target.deep <= 30 && Math.randInt() > this.fireSolution) {
        this.impactOnTarget = true;
        var rooms = this.target.getRooms();
        this.impactOnRoom = rooms[Math.randInt(rooms.length)];
      }
      this.createSubmarineViewHit();
      this.hitting = true;
      if (this.impactOnTarget) {
        this.hittingX = 1 - Math.randInt(2);
      } else {
        this.hittingX = 1 - Math.randInt(2);
      }

    },
    tickHitting: function() {
      this.view.y += 10;
      this.view.x += this.hittingX;
      if (this.view.y > this.getMaxY()) {
        this.explode();
      }
    },
    createSubmarineViewHit: function() {
      this.view.x = Math.randInt(this.submarineView.skyView.width);
      var submarine = this.submarineView.submarineBackground;

      if (this.impactOnTarget) {
        this.view.x = this.impactOnRoom.view.x + Math.randInt(this.impactOnRoom.view.width);
      }
      this.view.y = this.submarineView.initSky;
    },
    getMaxY: function() {
      var maxY = this.submarineView.initSea + (this.submarineView.seaView.y || 0);

      return maxY;
    },
    explode: function() {
      this.stage.removeEntity(this);
      this.container.removeChild(this.view);
      if (!this.impactOnTarget) {
        this.addExplosionWater();
      } else {
        this.addExplosionHit();
        this.target.hitBy(this, this.impactOnRoom);
      }
    }
  };
  window.boot.models.Projectile = projectile;
})();