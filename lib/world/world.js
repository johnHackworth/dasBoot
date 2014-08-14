window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var world = function(options) {};
  world.prototype = {
    tileHeight: window.boot.config.tileWidth,
    assets: [],
    sectors: [],
    nations: [],
    vehicles: [],
    init: function() {
      this.createNations();
    },
    addVehicleToSector: function(vehicle, x, y) {
      if (vehicle.currentSector) {
        vehicle.currentSector.remove(vehicle);
      }
      this.sectors[x][y].addVehicle(vehicle);
    },
    getPlainSeaWorld: function() {
      for (var i = 0; i < 20; i++) {
        this.sectors[i] = [];
        for (var j = 0; j < 20; j++) {
          this.sectors[i][j] = new window.boot.models.DeepSeaSector({
            x: i,
            y: j
          });
          var boat = new window.boot.models.EarlyBattleship({
            world: this,
            stage: this.stage
          });
          this.addVehicleToSector(boat, i, j);
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

    }
  };

  window.boot.models.World = world;
})();