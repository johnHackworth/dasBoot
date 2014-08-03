window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var sector = function(options) {
    this.options = options;
    this.init();
  };
  sector.prototype = {
    tileHeight: window.boot.config.tileWidth,
    assets: [],
    vehicles: [],
    init: function() {
      this.vehicles = [];
    },
    removeVehicle: function(vehicle) {
      this.vehicles.removeElement(vehicle);
      vehicle.removeCurrentSector();
    },
    addVehicle: function(vehicle) {
      this.vehicles.push(vehicle);
      vehicle.addCurrentSector(this);
    }

  };

  window.boot.models.Sector = sector;
})();