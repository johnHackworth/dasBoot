window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var ui = function(options) {
    this.sector = options.sector;
    this.stage = options.stage;
    this.init();
  };
  ui.prototype = {
    init: function() {
      this.addSky();
      this.addSea();
      this.addShips();
    },
    addSky: function() {
      this.stage.addBackground(0, 100, 600, 100, 0x77AAFF, 1);
    },
    addSea: function() {
      this.stage.addBackground(0, 150, 600, 100, 0x0066AA, 1);
    },
    addShips: function() {
      for (var i in this.sector.vehicles) {
        if (this.sector.vehicles[i].type === 'boat') {
          this.addBoat(this.sector.vehicles[i]);
        }
      }
    },
    addBoat: function(boat) {
      this.stage.addImage(
        boat.assets.layout, {
          x: 50,
          y: 100,
          scale: 1,
          centered: false
        });
    }
  };
  window.boot.ui.SeaView = ui;
})();