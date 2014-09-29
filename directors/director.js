window.boot = window.boot || {};
window.boot.directors = window.boot.directors || {};

window.boot.directors.main = function() {
  this.init();
};

window.boot.directors.main.prototype = {

  init: function(stage) {
    window.boot.width = window.innerWidth;
    if (window.boot.width < 1050) {
      window.boot.width = 1050;
    }
    this.testStartSectors();

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
    this.world.player.sector = this.world.ports[0].sector;
    this.initializePersons();
  },
  initializePersons: function() {
    for (var i = 0; i < 20; i++) {
      var person = new window.boot.dataModels.Person({});

      if (i < 7) {
        this.world.player.addPerson(person);
      }
    }
  },
  testStartSectors: function() {
    this.stage = new window.boot.stages.sectorsStage();
    this.stage.init({});

    this.initializeWorld();
    window.boot.currentStage.initUI({
      world: this.world
    });
    boot.currentStage.engine.running = true;
  },
  testStartSubmarine: function() {
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
      sector: this.world.player.sector
    });
    boot.currentStage.engine.running = true;
  }

};

window.boot.mainDirector = new boot.directors.main();