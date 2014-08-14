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
      this.addWeaponsHud();
    },
    addSky: function() {
      this.stage.addBackground(0, 000, 1050, 150, 0x77AAFF, 1);
    },
    addSea: function() {
      this.stage.addBackground(0, 100, 1050, 150, 0x0066AA, 1);
    },
    addShips: function() {
      for (var i in this.sector.vehicles) {
        if (this.sector.vehicles[i].type === 'boat') {
          this.addBoat(this.sector.vehicles[i]);
        }
      }
    },
    addBoat: function(boat) {
      this.stage.addVisualEntity(boat.view);
      boat.stage = this.stage;
      boat.view.x = 120;
      boat.view.y = 80;
      boat.view.width = 200;
      boat.view.height = 50;
      boat.view.setInteractive(true);
      boat.view.click = this.selectBoat.bind(this, boat);
      // (
      // boat.assets.layout, {
      //     x: 50,
      //     y: 80,
      //     scale: 0.7,
      //     centered: false
      //   });
    },
    addWeaponsHud: function() {
      this.weaponsHud = new window.boot.ui.WeaponsLayout({
        stage: this.stage
      });
    },
    selectBoat: function(boat) {
      if (this.selected) {
        this.selected.unselect();
      }
      boat.select();
      this.selected = boat;
    }
  };
  window.boot.ui.SeaView = ui;
})();