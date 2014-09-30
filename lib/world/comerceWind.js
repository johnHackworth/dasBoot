window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var comerce = function(options) {
    this.options = options;
    this.init();
  };
  comerce.prototype = {
    init: function() {
      this.world = this.options.world;
      this.ports = this.world.ports;
      this.nations = this.world.nations;
      this.stage = this.options.stage;
      this.ships = [];
    },
    nextTurn: function() {
      this.clearShips();
      for (var i in this.world.ports) {
        this.portTurn(this.world.ports[i]);
      }
    },
    clearShips: function() {
      var destroyed = [];
      for (var i in this.ships) {
        if (this.ships[i].destroyed || this.ships[i].arrived) {
          destroyed.push(this.ships[i]);
        }
      }
      for (var j in destroyed) {
        destroyed[j].origin.originShips.removeElement(destroyed[j]);
        destroyed[j].finalDestination.destinationShips.removeElement(destroyed[j]);
        destroyed[j].sector.vehicles.removeElement(destroyed[j]);
        this.ships.removeElement(destroyed[j]);
      }
    },
    portTurn: function(port) {
      var shipsManaged = (port.originShips.length + port.destinationShips.length);
      if (shipsManaged < port.model.comerce) {
        if (Math.randInt() > 50) {
          this.createCommerceShipBearingTo(port);
        } else {
          this.createCommerceShip(port);
        }
      }
    },
    createCommerceShipBearingTo: function(port) {
      var origin = this.world.selectInteroceanicPoint();
      var ship = this.world.getRandomShip(this.world.getRandomCountry());
      this.world.addVehicleToSector(ship, origin.sector.x, origin.sector.y);
      ship.path = this.world.getPathAsSectors(origin.sector, port.sector);
      ship.finalDestination = port;
      ship.origin = origin;
      port.originShips.push(ship);
      port.destinationShips.push(ship);
      this.ships.push(ship);
      origin.sector.addNewShip(ship);
    },
    createCommerceShip: function(port) {
      var destination = this.world.selectRandomPort();
      if (!(Math.randInt < 30 && this.isValidDestination(destination, port))) {
        destination = this.world.selectInteroceanicPoint();
      }
      var ship = this.world.getRandomShip(port.country);
      this.world.addVehicleToSector(ship, port.sector.x, port.sector.y);
      ship.path = this.world.getPathAsSectors(port.sector, destination.sector);
      ship.finalDestination = destination;
      ship.origin = port;
      port.originShips.push(ship);
      port.destinationShips.push(ship);
      this.ships.push(ship);
      port.sector.addNewShip(ship);

    },
    isValidDestination: function(destination, origin) {
      if (destination == origin) {
        return false;
      }
      if (destination.getActiveShips() >= destination.model.commerce) {
        return false;
      }
      return true;
    }

  };

  window.boot.models.ComerceWind = comerce;
})();