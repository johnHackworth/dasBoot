window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var world = function(options) {
    this.init();
  };
  world.prototype = {
    assets: [],
    sectors: [],
    nations: [],
    vehicles: [],
    tileWidth: 40,
    tileHeight: 15,
    init: function() {
      this.createTime();
      this.createNations();
    },
    createTime: function() {
      this.time = new boot.models.TimeController({
        world: this
      });
    },
    addVehicleToSector: function(vehicle, x, y) {
      if (vehicle.currentSector) {
        vehicle.currentSector.remove(vehicle);
      }
      this.sectors[x][y].addVehicle(vehicle);
    },
    getPlainSeaWorld: function() {
      var boatTypes = ['EarlyBattleship', 'EarlyDestroyer'];

      for (var i = 0; i < this.tileWidth; i++) {
        this.sectors[i] = [];
        for (var j = 0; j < this.tileHeight; j++) {
          this.sectors[i][j] = new window.boot.models.DeepSeaSector({
            x: i,
            y: j,
            world: this
          });
          if (Math.randInt() > 90) {
            // window.boot.models.EarlyBattleship, window.boot.models.EarlyDestroyer];
            var boat = new boot.dataModels.Boat({
              type: boatTypes[Math.randInt(boatTypes.length)],
              world: this
            });
            this.addVehicleToSector(boat, i, j);
          }
        }
      }
    },
    getWorldFromArray: function(arrayWorld) {
      var translator = {
        "w": boot.models.DeepSeaSector,
        "l": boot.models.LandSector
      };
      for (var i = 0; i < arrayWorld.length; i++) {
        this.sectors[i] = [];
        for (var j = 0; j < arrayWorld[i].length; j++) {
          this.sectors[i][j] = new translator[arrayWorld[i][j]]({
            x: i,
            y: j,
            world: this
          });
        }
      }
    },
    getRandomShips: function() {
      var boatTypes = [{
        type: 'EarlyBattleship',
        speed: 0.6
      }, {
        speed: 0.5,
        type: 'EarlyDestroyer'
      }];
      for (var i = 0; i < this.sectors.length; i++) {
        for (var j = 0; j < this.sectors[i].length; j++) {
          if (Math.randInt() > 90 && this.sectors[i][j].type === 'sea') {
            var boatType = boatTypes[Math.randInt(boatTypes.length)];
            var boat = new boot.dataModels.Boat({
              type: boatType.type,
              speed: boatType.speed,
              world: this
            });
            this.addVehicleToSector(boat, i, j);
          }
        }
      }
    },
    createNations: function() {
      for (var i in window.boot.data.nations) {
        this.nations.push(new window.boot.models.Nation({
          name: window.boot.data.nations[i].name
        }));
      }
      for (var j in this.nations) {
        for (var k in window.boot.data.nations[this.nations[j].name].allies) {
          var ally = this.nations.lookFor("name", window.boot.data.nations[this.nations[j].name].allies[k]);
          this.nations[j].allies.push(ally);
        }
        for (k in window.boot.data.nations[this.nations[j].name].enemies) {
          var enemy = this.nations.lookFor("name", window.boot.data.nations[this.nations[j].name].allies[k]);
          this.nations[j].enemies.push(enemy);
        }
      }
    },
    nextTurn: function() {
      this.time.nextTurn();
    }
  };

  window.boot.models.World = world;
})();