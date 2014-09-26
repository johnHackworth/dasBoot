window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var room = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.components.HealthBar);
    this.layoutPos = options.layoutPos;
    this.init(options);
    this.order = options.order;
    this.level = options.level;
  };
  room.prototype = {
    counter: 0,
    positionAmount: 4,
    type: 'room',
    hullIntegrity: 100,
    roomWidth: 120,
    roomHeight: 60,
    viewX: 0,
    viewY: 0,
    positionCorrection: 0,
    assets: {
      background: 'assets/rooms/room.png',
    },
    lightingAssets: {
      light: 'assets/rooms/lighting.png'
    },
    init: function() {
      this.people = [];
      this.positionWidth = Math.floor(this.roomWidth / this.positionAmount);
    },
    initView: function(options) {
      this.level = options.level;
      this.layout = options.layout;
      this.view = new PIXI.Sprite.fromImage(this.assets.background);
      this.view.x = this.viewX;
      this.view.y = this.viewY;
      this.view.width = this.roomWidth;
      this.view.height = this.roomHeight;
      this.stage = options.stage;
      if (options.stage.firstAmbient) {
        options.stage.addViewBefore(this.view, options.stage.firstAmbient);
      } else {
        options.stage.addVisualEntity(this.view, options.after);

      }
      options.stage.addNotVisualEntity(this);
      this.initLightView(options);
      this.initHealthBar({
        x: this.viewX + 25,
        y: this.viewY + this.view.height,
        width: this.view.width - 50,
        height: 8,
        attribute: 'hullIntegrity'
      });
    },

    initLightView: function(options) {
      this.viewLighting = new PIXI.Sprite.fromImage(this.lightingAssets.light);
      this.viewLighting.x = this.viewX - this.roomWidth / 4;
      this.viewLighting.y = this.viewY - 10 - this.roomHeight / 4;
      this.viewLighting.alpha = 0.8;
      this.viewLighting.width = this.roomWidth * 1.5;
      this.viewLighting.height = this.roomHeight * 1.5;
      if (!options.stage.firstAmbient) {
        options.stage.firstAmbient = this.viewLighting;
        options.stage.addVisualEntity(this.viewLighting);
      } else {
        options.stage.addViewAfter(this.viewLighting, options.stage.firstAmbient);
      }
    },
    getFixing: function() {
      if (this.hullIntegrity < 100) {

        for (var l = this.people.length; l; l--) {

          if (this.people[l - 1] && this.people[l - 1].isFixer) {
            this.people[l - 1].fix(this);
          }
        }
      }
    },
    fix: function(amount) {
      this.hullIntegrity += amount;
      if (this.hullIntegrity > 100) {
        this.hullIntegrity = 100;
      }
    },
    applyRedLighting: function() {
      this.viewLighting.tint = 0xFF0000;
      this.viewLighting.alpha = 1;
    },
    applyWhiteLighting: function() {
      this.viewLighting.tint = 0xFFFFFF;
      this.viewLighting.alpha = 1;
    },
    addPerson: function(person) {
      for (var i = 0; i < this.positionAmount; i++) {
        if (!this.people[i]) {

          this.people[i] = person;
          person.room = this;
          break;
        }
      }
    },
    removePerson: function(person) {
      for (var i = 0; i < this.positionAmount; i++) {
        if (this.people[i] === person) {
          this.people[i] = null;
          break;
        }
      }
    },
    hasFreeSpace: function() {
      for (var i = 0; i < this.positionAmount; i++) {
        if (!this.people[i]) {
          return true;
        }
      }
      return false;
    },
    getPosition: function(person) {
      var size = {
        x: person.viewWidth ? person.viewWidth / 2 : 0,
        y: person.viewHeight || 0
      };
      for (var i = 0; i < this.positionAmount; i++) {
        if (this.people[i] === person) {
          return {
            x: 15 + this.viewX + this.positionWidth * i - size.x + this.positionCorrection * i,
            y: this.viewY + this.roomHeight - size.y
          };
        }
      }
      return {
        x: Math.floor(this.viewX + this.roomWidth / 2 - size.x / 2),
        y: this.viewY + this.roomHeight - size.y
      };
    },
    addView: function(view) {
      this.view = view;
    },
    tick: function(counter, active) {
      if (!active) return;
      this.counter++;
      if (this.counter % 20 === 0 && this.viewLighting && Math.random() > 0.95) {
        var changes = [-0.1, 0.1];
        var n = Math.floor(Math.random() * changes.length);
        this.viewLighting.alpha += changes[n];
        if (this.viewLighting.alpha >= 1) {
          this.viewLighting.alpha = 1;
        }
        if (this.viewLighting.alpha <= 0.30) {
          this.viewLighting.alpha = 0.30;
        }
      }
      if (this.counter % 90 === 0 && this.hullIntegrity < 99) {
        this.showDamage();
        this.getFixing();
        this.updateHealthBar();
      }
    },
    showDamage: function() {
      if (!this.damageOrigin) {
        this.damageOrigin = {
          x: this.view.x + Math.randInt(this.roomWidth),
          y: this.view.y + Math.randInt(this.roomHeight)
        };
      }
      var damageColors = [0xFFFFFF, 0xFFFFFF, 0xEFEFEF, 0xEDEDED, 0xFEFEFE];
      if (this.hullIntegrity < 50) {
        damageColors = [0xFFFFFF, 0x000099, 0x0033AA, 0x001188, 0xFFFFFF, 0xEFEFEF, 0xEDEDED, 0xFEFEFE];
      }
      var size = Math.ceil(4 * (1 - this.hullIntegrity / 100));
      var explosion = new pixEngine.ParticleGenerator({
        stage: this.stage,
        origin: this.damageOrigin,
        randomOrigin: {
          x: 10,
          y: 10
        },
        bottomY: this.view.y + this.roomHeight,
        topY: this.view.y,
        colors: damageColors,
        size: size,
        randomSize: size,
        speed: 0.3,
        duration: 15 * size,
        delayRandom: 1500,
        amount: 10,
        randomDuration: 5 * size,
        fadding: true,
        gravity: -15,
        opacity: 0.1,
        randomOpacity: 0.6
      });
    },
    getStairsWell: function() {
      return this.layout.getStairsWell(this.level);
    },
    hitPeople: function(damage) {
      for (var l = this.people.length; l; l--) {
        if (this.people[l - 1]) {
          this.people[l - 1].hit(damage);
        }
      }
    }
  };

  window.boot.models.Room = room;
})();