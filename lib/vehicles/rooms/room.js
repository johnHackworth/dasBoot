window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var room = function(options) {
    this.layoutPos = options.layoutPos;
    this.init(options);
  };
  room.prototype = {
    counter: 0,
    positionAmount: 4,
    type: 'room',
    roomWidth: 120,
    roomHeight: 60,
    viewX: 0,
    viewY: 0,
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
      this.view = new PIXI.Sprite.fromImage(this.assets.background);
      this.view.x = this.viewX;
      this.view.y = this.viewY;
      this.view.width = this.roomWidth;
      this.view.height = this.roomHeight;
      if (options.stage.firstAmbient) {
        options.stage.addViewBefore(this.view, options.stage.firstAmbient);
      } else {
        options.stage.addVisualEntity(this.view, options.after);
      }
      this.initLightView(options);
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
            x: 15 + this.viewX + this.positionWidth * i - size.x,
            y: this.viewY + this.roomHeight - size.y
          };
        }
      }
    },
    addView: function(view) {
      this.view = view;
    },
    tick: function() {
      this.counter++;
      if (this.counter % 10 === 0 && this.viewLighting && Math.random() > 0.60) {
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
    }
  };

  window.boot.models.Room = room;
})();