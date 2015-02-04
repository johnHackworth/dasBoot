window.boot = window.boot || {};
window.boot.directors = window.boot.directors || {};

window.boot.directors.main = function() {
  this.init();
};

window.boot.directors.main.prototype = {

  init: function(stage) {
    window.boot.width = boot.config.width;
    // if (window.boot.width < 1050) {
    //   window.boot.width = 1050;
    // }

    document.getElementById('loader').remove();

  },
  initializeWorld: function() {
    if (this.world) {
      return;
    }
    this.world = new window.boot.models.World();
    this.world.getWorldFromArray(window.boot.worldMap);
    this.world.createPorts(window.boot.worldMap.ports);
    // this.world.getRandomShips();
    window.world = this.world;
    this.world.player = new boot.dataModels.Player({
      world: this.world
    });
    var port = null;
    for (var i in this.world.ports) {
      if (this.world.ports[i].country.name == 'Germany') {
        port = this.world.ports[i];
      }
    }
    this.world.player.sector = port.sector;
    // this.initializeTestShip();
    this.initializePersons();
    this.world.postInit();
  },
  initializeTestShip: function() {
    var port = this.world.ports[0];
    var ship = this.world.getRandomShip(port.country);
    this.world.addVehicleToSector(ship, port.sector.x, port.sector.y);
    ship.path = [];
    ship.origin = port;
    port.sector.addNewShip(ship);
  },
  initializePersons: function() {
    for (var i = 0; i < 7; i++) {
      var person = new window.boot.dataModels.Person({});
      this.world.player.addPerson(person);
    }
  },
  initSectors: function() {
    this.stage = new window.boot.stages.sectorsStage();
  },
  startScreen: function() {
    this.stage = new window.boot.stages.startStage();
    this.stage.init({});
    boot.currentStage.engine.running = true;
  },
  startSectors: function() {
    this.initSectors();
    this.stage.init({});
    this.initializeWorld();
    window.boot.currentStage.initUI({
      world: this.world
    });
    boot.currentStage.engine.running = true;
  },
  startBoatView: function(options) {
    options = options || {};
    this.stage = new window.boot.stages.bootStage();
    this.stage.init({});

    this.initializeWorld();
    this.world.playerBoat = new window.boot.models.EarlyUboat({
      world: this.world,
      player: this.world.player
    });
    this.world.playerBoat.sector = this.world.player.sector;
    for (var i in this.world.player.people) {
      var person = new window.boot.models.Person({
        stage: boot.currentStage,
        model: this.world.player.people[i]
      });
      this.world.playerBoat.addPerson(person);
    }
    window.boot.currentStage.initHud({
      world: this.world,
      sector: this.world.player.sector,
      assault: options.assault
    });
    // this.initEncounters(options);
    boot.currentStage.engine.running = true;
  },
  startCrewView: function(options) {
    options = options || {};
    this.stage = new window.boot.stages.crewStage();
    this.stage.init({});

    window.boot.currentStage.initHud({
      world: this.world,
      sector: this.world.player.sector,
      assault: options.assault
    });
    // this.initEncounters(options);
    boot.currentStage.engine.running = true;
  },
  startWorldView: function(options) {
    options = options || {};
    this.stage = new window.boot.stages.worldStage();
    this.stage.init({});

    window.boot.currentStage.initHud({
      world: this.world,
      sector: this.world.player.sector,
      assault: options.assault
    });
    // this.initEncounters(options);
    boot.currentStage.engine.running = true;
  }

};
window.boot.mainDirector = new boot.directors.main();
window.boot.mainDirector.startScreen();
// window.boot.mainDirector.startSectors();
