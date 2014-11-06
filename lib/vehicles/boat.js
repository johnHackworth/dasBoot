window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var boat = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Vehicle, true, options);
    this.model = options.model;
    this.enemy = options.enemy;
    this.init(options);
  };
  boat.prototype = {
    counter: 0,
    positionalAdvantageAttack: 0,
    positionalAdvantageDefense: 0,
    hullStrength: 100,
    maniovrability: 10,
    size: 1,
    deep: 0,
    intendedDeep: 0,
    maxSeed: 30,
    baseWidth: 400,
    baseHeight: 200,
    type: 'boat',
    layoutMap: [],
    topRoom: 0,
    leftRoom: 0,
    assets: {
      layout: 'assets/vehicles/warship1.png'
    },
    init: function(options) {
      var worst = [];
      this.people = worst;
      this.stage = options.stage;
      if (this.npc) {
        this.ai = new window.boot.models.AI({
          boat: this,
          enemy: this.enemy
        });
      }
      this.layout = new window.boot.models.ShipLayout({
        boat: this,
        layout: this.layoutMap
      });
      this.initWeapons();
      this.initView();
    },
    initWeapons: function() {

    },
    wavesAround: function(color, tint) {
      if (!this.view) {
        return;
      }

      var waves = new pixEngine.ParticleGenerator({
        stage: this.stage,
        container: this.container,
        origin: {
          x: this.view.x + Math.floor(this.view.width / 2),
          y: this.view.y + this.view.height + 5
        },
        randomOrigin: {
          x: Math.floor(this.view.width),
          y: 0
        },
        colors: [color],
        size: 5,
        type: 'trapezoid',
        randomSize: 5,
        speed: 0.1,
        delayRandom: 500,
        duration: 150,
        direction: Math.PI + Math.PI / 2,
        spread: Math.PI / 36,
        amount: 1,
        randomDuration: 30,
        bottomY: this.view.y + this.view.height + 5,
        fadding: true,
        gravity: 2,
        opacity: 1,
        randomOpacity: 0,
        tint: tint,
        before: this.selectedHalo
      });

    },
    initView: function() {},
    tick: function(counter, active) {
      if (!active) return;
      this.counter++;
      if (this.counter % 6 == 0) {
        this.checkDeep();
      }
    },
    tickAi: function(counter, active) {
      this.ai.tick(counter, active);
    },
    tickResize: function() {
      if (this.npc && this.counter % 30 === 0) {
        this.renderPosition(this.distance, this.maxY, this.offset);
      }
    },
    tickRooms: function() {
      if (this.counter % 10 === 0 && this.layout) {
        for (var i in this.layout.rooms) {
          for (var j in this.layout.rooms[i]) {
            if (this.layout.rooms[i][j]) {
              this.layout.rooms[i][j].tick();
            }
          }
        }
      }
    },
    addPerson: function(person) {
      this.people.push(person);
      var freeRoom = null;
      for (var i in this.layout.rooms) {
        for (var j in this.layout.rooms[i]) {
          if (this.layout.rooms[i][j] && this.layout.rooms[i][j].hasFreeSpace()) {
            freeRoom = this.layout.rooms[i][j];
            break;
          }
        }
      }
      freeRoom.addPerson(person);
      person.pos = freeRoom.getPosition(person);
      person.boat = this;
    },
    addStage: function(stage) {
      if (!stage) return;
      this.stage = stage;
      if (this.ai) {
        this.ai.enemy = stage.playerBoat;
      }
    },
    getCurrentScale: function() {
      return this.view.width / this.baseWidth;
    },
    getAlphaByDistance: function(distance) {
      if (distance > 15000) {
        return 0;
      }
      var visibilityTimeWeather = this.model.getVisibility();
      var visibilityDistance = 1 - distance / 15000;
      return 0.50 * visibilityDistance + 0.50 * visibilityTimeWeather;
    },
    getSizeByDistance: function(distance) {
      if (distance > 15000) {
        return {
          x: 0,
          y: 0
        };
      }
      var correction = 1 - (distance / (5000));
      if (correction < 0.2) {
        correction = 0.2 * (1 - (distance - 5000) / 10000);
        if (correction < 0.01) {
          correction = 0.01;
        }
      }
      var xSize = Math.floor(this.baseWidth * this.size * correction);
      if (xSize < 5) {
        xSize = 5;
      }
      var ySize = Math.floor(this.baseHeight * this.size * correction);
      if (ySize < 3) {
        ySize = 3;
      }
      return {
        x: xSize,
        y: ySize
      };
    },
    getViewPositionByDistance: function(distance, maxY) {
      var correction = 1 - (distance / (5000));
      if (correction < 0.2) {
        correction = 0.2 * (1 - (distance - 5000) / 10000);
      }
      return Math.floor(maxY * correction) - this.view.height;
    },
    renderPosition: function(distance, maxY, offset) {
      this.maxY = maxY;
      this.offset = offset;
      var size = this.getSizeByDistance(distance);
      this.view.width = size.x;
      this.view.height = size.y;
      this.view.alpha = this.getAlphaByDistance(distance);
      if (this.selectedHalo) {
        this.selectedHalo.width = Math.floor(this.view.width * 0.55);
        this.selectedHalo.height = Math.floor(this.view.width * 0.55);
      }
      var positionY = offset + this.getViewPositionByDistance(distance, maxY);
      this.view.y = positionY;
    },
    getFirstPersonView: function() {
      return this.people[0].view[0];
    },
    adjustUI: function() {
      if (this.selectedHalo) {
        this.selectedHalo.x = Math.floor(this.view.x + (this.view.width - this.selectedHalo.width) / 2);
        this.selectedHalo.y = Math.floor(this.view.y + (this.view.height - this.selectedHalo.height) / 2);
      }
    },
    select: function() {
      this.selectedHalo = new PIXI.Sprite.fromImage('assets/ui/target.png');
      this.selectedHalo.width = Math.floor(this.view.width * 0.55);
      this.selectedHalo.height = Math.floor(this.view.width * 0.55);
      this.container.addChild(this.selectedHalo);
      this.adjustUI();
    },
    unselect: function() {
      this.container.removeChild(this.selectedHalo);
      this.selectedHalo = null;
    },
    fire: function() {

    },
    getGunnerWork: function() {
      return 10;
    },
    getArtilleryWork: function() {
      return 10;
    },
    checkDeep: function() {

    },
    getMaxSpeed: function() {
      return Math.randInt(this.maxSpeed);
    },
    getManiovres: function() {
      return Math.randInt(this.maniovrability);
    }

  };

  window.boot.models.Boat = boat;
})();