window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var sector = function(options) {
    this.options = options;
    this.world = options.world;
    this.x = options.x;
    this.y = options.y;
    this.init();
  };
  sector.prototype = {
    tileHeight: window.boot.config.tileWidth,
    assets: [],
    vehicles: [],
    init: function() {
      this.vehicles = [];
      this.newShips = [];
      this.toBeRemovedShips = [];
    },
    removeVehicle: function(vehicle) {
      this.vehicles.removeElement(vehicle);
      vehicle.removeCurrentSector();
    },
    addVehicle: function(vehicle) {
      this.vehicles.push(vehicle);
      vehicle.sector = this;
      // vehicle.addCurrentSector(this);
    },
    isSectorAdjacent: function(sector, adjacentDistance) {
      adjacentDistance = adjacentDistance || 1;
      if (
        (Math.abs(sector.x - this.x) <= adjacentDistance) &&
        (Math.abs(sector.y - this.y) <= adjacentDistance)
      ) {
        return true;
      }
      return false;
    },
    adjacentToPlayer: function(useLastPosition) {
      var player = this.world.player;
      var isAdjacent = false;
      if (useLastPosition) {
        return this.adjacentToPlayerDestination();
      } else {
        if (this.isSectorAdjacent(player.sector)) {
          isAdjacent = true;
        }
      }
      return isAdjacent;
    },
    adjacentToPlayerDestination: function() {
      var player = this.world.player;
      var isAdjacent = false;
      if (player.path.length > 0) {
        if (this.isSectorAdjacent(player.path[player.path.length - 1])) {
          isAdjacent = true;
        }
      } else {
        if (this.isSectorAdjacent(player.sector)) {
          isAdjacent = true;
        }
      }

      return isAdjacent;
    },
    guidePlayerHere: function(append) {
      var player = this.world.player;
      player.getPathTo(this, append);
    },
    addNewShip: function(ship) {
      this.newShips.push(ship);
      this.addVehicle(ship);
    },
    addShipToRemoved: function(ship) {
      this.toBeRemovedShips.push(ship);
    }
  };

  window.boot.models.Sector = sector;
})();