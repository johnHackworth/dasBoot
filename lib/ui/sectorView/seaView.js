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
      this.boats = [];
      this.initSea = 100;
      this.initSeaX = 0;
      this.seaWidth = window.boot.config.width - 0;

      this.addSky();
      this.addSea();
      this.addWeaponsHud();
      this.addShips();
      this.initializeCombatSimulator();
      this.stage.addNotVisualEntity(this);
    },
    initializeCombatSimulator: function() {
      this.combatSimulator = new window.boot.models.CombatSimulator({
        sea: this,
        boats: this.boats
      });
      this.targetView = new window.boot.ui.TargetView({
        stage: this.stage,
        sea: this,
        x: this.weaponsHud.getWidth() + 50,
        y: 200
      });
    },
    addSky: function() {
      this.skyView = this.stage.addBackground(this.initSeaX, 0, this.seaWidth, 150, 0x77AAFF, 1);
    },
    addSea: function() {
      this.seaView = this.stage.addBackground(this.initSeaX, 100, this.seaWidth, 150, 0x006699, 1);

    },
    addShips: function() {
      for (var i in this.sector.vehicles) {
        if (this.sector.vehicles[i].type === 'boat') {
          this.addBoat(this.sector.vehicles[i]);
        }
      }
    },
    addBoat: function(boat) {
      this.boats.push(boat);
      this.stage.addNotVisualEntity(boat);
      this.stage.addViewAfter(boat.view, this.seaView);
      boat.stage = this.stage;
      boat.sea = this;
      boat.view.x = this.initSeaX + 200 + Math.randInt(this.seaWidth - 300);
      boat.view.y = 80;
      boat.distance = 1000 + Math.randInt(3000);

      boat.renderPosition(15000, 100, 100);
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
    tick: function(counter, active) {
      if (!active) return;
      if (counter % 30 === 0) {
        this.combatSimulator.boatManiovres();
        this.combatSimulator.setPositions();
        this.combatSimulator.isPlayerBoatVisibleFromBoats();
      }
      if (counter % 10 === 0 && Math.randInt() < 20) {
        this.reflects();
      }
    },
    reflects: function() {
      var y = 100 + Math.randInt(150);
      var size = Math.floor(15 * y / 250);
      var reflect = new pixEngine.ParticleGenerator({
        stage: this.stage,
        after: this.seaView,
        type: 'line',
        origin: {
          x: Math.randInt(this.seaWidth) + this.initSeaX,
          y: y
        },
        randomOrigin: {
          x: 40,
          y: 20
        },
        colors: [0xFFFFFF, 0x0077BB, 0x0099AA],
        size: size,
        randomSize: size,
        speed: (1 - Math.randInt(3)) * 0.1,
        duration: 450,
        direction: Math.PI, // Math.PI + Math.random() * Math.PI,
        spread: Math.PI / 50,
        delayRandom: 20,
        amount: 1,
        randomAmount: 5,
        randomDuration: 250,
        brittle: 0.97,
        gravity: 0.0011,
        opacity: 0.1,
        randomOpacity: 0.1
      });
    }
  };
  window.boot.ui.SeaView = ui;
})();
