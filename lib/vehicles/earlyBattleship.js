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
      side: 'assets/vehicles/earlBattleship_1_side.png',
      front: 'assets/vehicles/earlyBattleship_front.png'
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
      this.frontTexture = new PIXI.Texture.fromImage(this.assets.front);
      this.sideTexture = new PIXI.Texture.fromImage(this.assets.side);
      this.view = PIXI.Sprite.fromFrame(this.assets.side);
    },
    tick: function() {
      this.counter++;
      if (this.counter % 30 === 0) {
        this.view.x += this.direction * (1 - this.distance / 15000);
        this.generateTrail();
      }
      if (this.view.x > 700) {
        this.direction = -1;
      } else {
        this.direction = 1;
      }
      if (Math.random() < 0.01) {
        this.direction = this.direction * -1;
      }
      this.tickResize();
      this.adjustUI();
      if (this.counter % 100 === 0) {
        this.tickAi();
      }

    },
    getTrailSize: function() {
      if (this.distance > 5000) {
        return 1;
      } else if (this.distance > 3000) {
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
        origin: {
          x: this.view.x,
          y: this.view.y + this.view.height
        },
        colors: [0xFFFFFF, 0x99FFFF, 0x9999FF],
        size: size,
        randomSize: size,
        speed: 0.2,
        delayRandom: 500,
        duration: 40,
        direction: Math.PI,
        spread: Math.PI / 16,
        amount: 10,
        randomDuration: 20,
        fadding: true,
        gravity: 1,
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
    }
  };

  window.boot.models.EarlyBattleship = earlyBattleship;
})();