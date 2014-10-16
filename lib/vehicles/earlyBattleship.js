window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var earlyBattleship = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Boat, true, options);
  };
  earlyBattleship.prototype = {
    effortPerTurn: 10,
    npc: true,
    maxSpeed: 40,
    baseWidth: 400,
    baseHeight: 150,
    cannonPositions: [{
      x: 90,
      y: 80
    }, {
      x: 245,
      y: 80
    }],
    counter: 0,
    direction: 1,
    type: 'boat',
    assets: {
      side: 'assets/vehicles/earlBattleship_1_side.png'
    },
    initWeapons: function() {
      this.weapons = {};
      this.weapons.cannons = [
        new boot.models.Cannon({
          stage: this.stage,
          boat: this,
          position: this.cannonPositions[0]
        }),
        new boot.models.Cannon({
          stage: this.stage,
          boat: this,
          position: this.cannonPositions[1]
        })
      ];
    },
    initView: function() {
      this.sideTexture = new PIXI.Texture.fromImage(this.assets.side);
      this.view = PIXI.Sprite.fromFrame(this.assets.side);
    },
    tick: function(counter, active) {
      if (!active) return;
      if (this.hullStrength <= 0) {
        return this.sink();
      }
      this.counter++;
      if (this.counter % 60 === 0) {
        this.view.x += this.direction * (1 - this.distance / 15000);
        this.generateTrail();
      }
      if ((this.view.x + this.view.width) > boot.config.width - 200) {
        this.direction = -1;
      } else {
        this.direction = 1;
      }
      if (Math.random() < 0.01) {
        this.direction = this.direction * -1;
      }
      if (this.lookingForEnemies) {
        this.lookingForEnemies--;
      }
      this.tickResize();
      this.adjustUI();

      if (this.counter % 50 === 0) {
        this.tickAi(counter, active);
      }
      if (this.counter % 90 === 0 && this.hullStrength < 90) {
        this.showDamage();
      }
      if (this.counter % 20 === 0) {
        this.wavesAround(0x006699, this.model.sector.weather.tint);
      }
    },
    getTrailSize: function() {
      if (this.distance > 3000) {
        return 1;
      } else if (this.distance > 2000) {
        return 2;
      } else if (this.distance > 1000) {
        return 3;
      } else {
        return 4;
      }
    },
    generateTrail: function() {
      var size = this.getTrailSize();
      this.trail = new pixEngine.ParticleGenerator({
        stage: this.stage,
        container: this.container,
        after: this.sea.seaView,
        origin: {
          x: this.view.x,
          y: this.view.y + this.view.height
        },
        colors: [0xFFFFFF, 0x99FFFF, 0x9999FF],
        size: size,
        type: 'trapezoid',
        randomSize: size,
        speed: 0.01 * size,
        delayRandom: 500,
        duration: 2000,
        direction: Math.PI,
        spread: Math.PI / 36,
        amount: 1,
        randomDuration: 20,
        fadding: true,
        gravity: 0.001,
        opacity: 0.1,
        randomOpacity: 0.6
      });
    },
    fire: function(cannon) {
      if (this.sea) {
        this.sea.createProjectile({
          origin: this,
          weapon: cannon,
          target: this.stage.playerBoat
        });
        cannon.status = 'empty';
      } else {
        cannon.status = 'empty';
      }
    },
    showDamage: function() {
      if (!this.damageOrigin) {
        this.damageOrigin = {
          x: this.hitZone || Math.randInt(this.view.width),
          y: this.view.height
        };
      }
      var size = Math.ceil(2 * (1 - this.hullStrength / 100));
      size = Math.ceil(size * (1 - this.distance / 10000));
      if (size < 1) {
        size = 1;
      }
      var explosion = new pixEngine.ParticleGenerator({
        stage: this.stage,
        container: this.container,
        origin: {
          x: this.view.x + this.damageOrigin.x,
          y: this.view.fixedY ? this.view.fixedY : this.view.y + this.damageOrigin.y - 10
        },
        randomOrigin: {
          x: 1 * size,
          y: 20
        },
        colors: [0x333333, 0x666666, 0x333333, 0xEDEDED, 0x555555, 0x222222, 0x553333, 0x666666, 0x777777],
        size: size,
        randomSize: size,
        speed: 0.01,
        duration: 250 * size,
        delayRandom: 1500,
        // type: 'hexagon',
        amount: 1,
        randomDuration: 250 * size,
        fadding: true,
        gravity: -0.1 * 5 * (1 - this.distance / 10000),
        opacity: 0.3,
        randomOpacity: 0.3
      });
    },
    sink: function() {
      this.destroyed = true;
      this.model.destroyed = true;
      this.timeSinking = this.timeSinking ? this.timeSinking++ : 1;
      if (!this.mask) {
        this.container.removeChild(this.view);
        this.view.fixedY = this.view.y + Math.floor(this.view.height * 0.5);
        var myMask = new PIXI.Graphics();
        myMask.beginFill();
        myMask.moveTo(this.view.x, this.view.y);
        myMask.lineTo(this.view.x + this.view.width + 100, this.view.y);
        myMask.lineTo(this.view.x + this.view.width + 100, this.view.y + this.view.height);
        myMask.lineTo(this.view.x, this.view.y + this.view.height);
        myMask.lineTo(this.view.x, this.view.y);
        myMask.endFill();
        this.mask = myMask;
        this.stage.addVisualEntity(myMask);
        this.stage.addVisualEntity(this.view);
        this.view.mask = this.mask;
      }
      this.counter++;
      if (this.counter % 90 === 0 && this.hullStrength < 90) {
        this.showDamage();
      }
      if (this.counter % 30 === 0) {
        if (this.view.rotation > -0.5) {
          this.view.rotation -= this.timeSinking > 50 ? 0.03 : 0.005;
        }
        this.view.y += this.timeSinking > 50 ? 0.2 : 1;
        this.showWaterSinking();
      }
    },
    showWaterSinking: function() {

      var size = Math.ceil(5 * (1 - this.distance / 10000));
      var torbelline = new pixEngine.ParticleGenerator({
        stage: this.stage,
        container: this.container,
        origin: {
          x: this.view.x + Math.floor(this.view.width / 2),
          y: this.view.fixedY + Math.floor(this.view.height * 0.9)
        },
        before: this.view,
        randomOrigin: {
          x: Math.floor(this.view.width),
          y: this.view.height
        },
        colors: [0xFFFFFF, 0x00CCFF, 0x99EEFF, 0xEEEEEE, 0xEEEEFF],
        size: size,
        topY: this.view.fixedY - Math.floor(this.view.height / 2),
        bottomY: this.view.fixedY + Math.floor(this.view.height / 2),
        randomSize: size,
        speed: 0.01,
        duration: 250 * size,
        delayRandom: 2500,
        type: 'trapezoid',
        amount: 2,
        randomDuration: 250 * size,
        fadding: true,
        gravity: 0.001,
        opacity: 0.1,
        randomOpacity: 0.2
      });
    }
  };

  window.boot.models.EarlyBattleship = earlyBattleship;
})();