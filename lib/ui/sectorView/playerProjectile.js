window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var projectile = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.sea = options.sea;
    this.weapon = options.weapon;
    this.target = options.target;
    this.origin = options.origin;
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
      this.stage.addEntity(this);
      this.renderView();
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
        x: this.originX + this.weapon.position.x * this.origin.getCurrentScale(),
        y: this.originY + this.weapon.position.y * this.origin.getCurrentScale()
      } : {
        x: 0,
        y: 2 * 0 / 3
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
      this.originX = Math.floor(boot.config.width / 2);
      this.originY = 300;
      var weaponPos = this.weapon ? this.weapon.position : {
        x: this.originX,
        y: this.originY
      };


      var xPositionTarget = targetX + targetWidth / 2;
      var xOrigin = this.originX;
      var xPosition = xOrigin + (window.boot.width / 2 - xOrigin) * this.getPercentageToTarget();

      this.view.x = xPosition;
      // this.view.y = yPosition;
      this.view.y = this.calculatePoint(this.getPercentageToTarget() * 2);

      var size = this.getSize();
      this.view.width = size.x;
      this.view.height = size.y;
    },
    clearView: function() {
      if (this.view) {
        this.stage.removeView(this.view);
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
    },
  };
  window.boot.models.PlayerProjectile = projectile;
})();