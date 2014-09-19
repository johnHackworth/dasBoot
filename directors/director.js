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
    this.world = new window.boot.models.World();
    this.testStartSectors();

  },
  testStartSectors: function() {
    this.stage = new window.boot.stages.sectorsStage();
    this.stage.init({});
    this.world.getWorldFromArray(window.boot.worldMap);
    this.world.getRandomShips();
    window.world = this.world;
    this.world.player = new boot.dataModels.Player({
      world: this.world
    });
    this.world.player.sector = this.world.sectors[0][0];
    this.world.playerBoat = new window.boot.models.EarlyUboat({
      world: this.world,
      player: this.world.player
    });
    window.boot.currentStage.initUI({
      world: this.world
    });
    boot.currentStage.engine.running = true;
  },
  testStartSubmarine: function() {
    this.stage = new window.boot.stages.bootStage();
    this.stage.init({});
    this.world.getPlainSeaWorld();
    window.world = this.world;
    this.world.playerBoat = new window.boot.models.EarlyUboat({
      world: this.world
    });
    this.world.playerBoat.sector = this.world.sectors[0][0];


    for (var i = 0; i < 6; i++) {
      var person = new window.boot.models.Person({
        stage: boot.currentStage
      });
      this.world.playerBoat.addPerson(person);
    }
    window.boot.currentStage.initHud({
      world: this.world,
      sector: this.world.sectors[0][0]
    });
    boot.currentStage.engine.running = true;
  }

};

window.boot.mainDirector = new boot.directors.main();