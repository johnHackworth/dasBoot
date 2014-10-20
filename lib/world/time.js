window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var time = function(options) {
    this.options = options;
    this.world = options.world;
    this.init();
  };
  time.prototype = {
    beginDate: '05/05/1936',
    turn: 0,
    tints: {
      0: 0x555555,
      6: 0xCCBBBB,
      12: 0xFFFFFF,
      18: 0xDDDDCC
    },
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
      this.world.movingPlayers = 6;
      this.turn++;
    },
    isVehicleVisibleToPlayer: function(vehicle) {
      var isAdjacent = vehicle.sector.isSectorAdjacent(this.world.player.sector);
      if (isAdjacent || vehicle.sector === this.world.player.sector) {
        vehicle.lastKnowPosition = this.turn;
      }
    },
    getDate: function() {
      var day = Math.floor(this.turn / 4);
      var date = new Date(this.beginDate);
      date.setDate(day);
      return date;
    },
    getTime: function() {
      return 6 * (this.turn % 4);
    },
    getTint: function() {
      return this.tints[this.getTime()];
    },
    getVisibility: function(sector) {
      var visibility = sector.weather.visibility;
      var hour = this.getTime();
      var top = (hour + 6) % 24;
      var relativeLight = 0;
      if (hour > 12) { // increasing
        relativeLight = hour / 12;
      } else { // decreasing
        relativeLight = 1 - (hour % 12) / 12;
      }
      return visibility * relativeLight;
    }
  };

  window.boot.models.TimeController = time;
})();
