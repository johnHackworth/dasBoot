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
    counter: 0,
    direction: 1,
    type: 'boat',
    assets: {
      side: 'assets/vehicles/earlyBattleship_side.png',
      front: 'assets/vehicles/earlyBattleship_front.png'
    },
    initWeapons: function() {
      this.weapons = {};
      this.weapons.cannons = [
        new boot.models.Cannon({
          stage: this.stage,
          boat: this,
        }),
        new boot.models.Cannon({
          stage: this.stage,
          boat: this,
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
    fire: function(cannon) {
      if (this.sea) {
        this.sea.createProjectile({
          origin: this,
          target: this.stage.playerBoat
        });
        cannon.status = 'empty';
      }
    }
  };

  window.boot.models.EarlyBattleship = earlyBattleship;
})();