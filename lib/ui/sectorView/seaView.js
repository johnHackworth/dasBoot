window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var ui = function(options) {
    this.sector = options.sector;
    this.stage = options.stage;
    this.submarineView = options.submarineView;
    this.init();
  };
  ui.prototype = {
    init: function() {
      this.addSky();
      this.addSea();
      this.addWeaponsHud();
      this.initializeCombatSimulator();
      this.addShips();
      this.stage.addNotVisualEntity(this);
    },
    initializeCombatSimulator: function() {
      this.combatSimulator = new window.boot.models.CombatSimulator({
        sea: this
      });
      this.targetView = new window.boot.ui.TargetView({
        stage: this.stage,
        sea: this,
        x: this.weaponsHud.getWidth() + 50,
        y: 200
      });
    },
    addSky: function() {
      this.skyView = this.stage.addBackground(0, 0, window.boot.width, 150, 0x77AAFF, 1);
    },
    addSea: function() {
      this.seaView = this.stage.addBackground(0, 100, window.boot.width, 150, 0x0066AA, 1);
    },
    addShips: function() {
      for (var i in this.sector.vehicles) {
        if (this.sector.vehicles[i].type === 'boat') {
          this.addBoat(this.sector.vehicles[i]);
        }
      }
    },
    addBoat: function(boat) {
      window.b = boat;
      this.stage.addNotVisualEntity(boat);
      this.stage.addViewAfter(boat.view, this.seaView);
      boat.stage = this.stage;
      boat.sea = this;
      boat.view.x = 120;
      boat.view.y = 80;
      boat.distance = 3000 + Math.randInt(3000);
      boat.view.width = 200;
      boat.view.height = 50;
      var distance = this.combatSimulator.getDistance(this.stage.playerBoat, boat);
      boat.renderPosition(distance, 100, 100);
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
        stage: this.stage,
        sea: this
      });
    },
    selectBoat: function(boat) {
      if (this.selected) {
        this.selected.unselect();
      }
      boat.select();
      this.weaponsHud.selectBoat();
      this.targetView.changeTarget(boat);
      this.selected = boat;
    },
    createTorpedo: function(options) {
      var torpedo = new window.boot.models.Torpedo({
        target: this.selected,
        origin: this.stage.playerBoat,
        sea: this,
        stage: this.stage
      });
    },
    createProjectile: function(options) {
      var projectile = new window.boot.models.Projectile({
        target: options.target,
        origin: options.origin,
        sea: this,
        weapon: options.weapon,
        stage: this.stage,
        submarineView: this.submarineView
      });
    },
    tick: function(counter) {
      if (counter % 30 === 0) {
        this.combatSimulator.setPositions();
      }
    }
  };
  window.boot.ui.SeaView = ui;
})();