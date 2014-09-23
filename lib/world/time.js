window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var time = function(options) {
    this.options = options;
    this.world = options.world;
    this.init();
  };
  time.prototype = {
    turn: 0,
    init: function() {},
    nextTurn: function() {
      for (var i in this.world.sectors) {
        for (var ii in this.world.sectors[i]) {
          var sector = this.world.sectors[i][ii];
          for (var j in sector.vehicles) {
            sector.vehicles[j].think();
            this.isVehicleVisibleToPlayer(sector.vehicles[j]);
            if (sector.vehicles[j].path && sector.vehicles[j].path.length && Math.randInt() < sector.vehicles[j].speed) {
              sector.vehicles[j].destination = sector.vehicles[j].path.shift();
            }
          }
        }
      }
      if (this.world.player.path && this.world.player.path.length) {
        this.world.player.destination = this.world.player.path.shift();
      }
      this.turn++;
    },
    isVehicleVisibleToPlayer: function(vehicle) {
      var isAdjacent = vehicle.sector.isSectorAdjacent(this.world.player.sector);
      if (isAdjacent || vehicle.sector === this.world.player.sector) {
        vehicle.lastKnowPosition = this.turn;
      }
    }
  };

  window.boot.models.TimeController = time;
})();