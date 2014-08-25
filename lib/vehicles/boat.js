window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var boat = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Vehicle, true, options);
    this.init(options);
  };
  boat.prototype = {
    counter: 0,
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
          boat: this
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
    initView: function() {},
    tick: function(counter, active) {
      if (!active) return;
      this.counter++;
      // this.tickRooms();
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
      if (this.selectedHalo) {
        this.selectedHalo.width = this.view.width + 2;
        this.selectedHalo.height = this.view.height + 2;
      }
      var positionY = offset + this.getViewPositionByDistance(distance, maxY);
      this.view.y = positionY;
    },
    getFirstPersonView: function() {
      return this.people[0].view[0];
    },
    adjustUI: function() {
      if (this.selectedHalo) {
        this.selectedHalo.x = this.view.x - 1;
        this.selectedHalo.y = this.view.y - 1;
      }
    },
    select: function() {
      this.selectedHalo = new PIXI.Sprite.fromImage('assets/ui/selected.png');
      this.selectedHalo.width = this.view.width + 2;
      this.selectedHalo.height = this.view.height + 2;
      this.stage.addVisualEntity(this.selectedHalo);
      this.adjustUI();
    },
    unselect: function() {
      this.stage.removeView(this.selectedHalo);
      this.selectedHalo = null;
    },
    fire: function() {

    },
    getGunnerWork: function() {
      return 10;
    },
    checkDeep: function() {

    }

  };

  window.boot.models.Boat = boat;
})();