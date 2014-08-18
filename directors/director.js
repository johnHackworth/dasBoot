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
    this.testStart();

  },
  testStart: function() {
    this.stage = new window.boot.stages.bootStage();
    this.stage.init({});
    this.world.getPlainSeaWorld();
    window.world = this.world;
    this.world.playerBoat = new window.boot.models.EarlyUboat({
      world: this.world
    });
    this.world.addVehicleToSector(this.world.playerBoat, 0, 0);


    for (var i = 0; i < 6; i++) {
      var person = new window.boot.models.Person({
        stage: boot.currentStage
      });
      this.world.playerBoat.addPerson(person);
    }
    window.boot.currentStage.initHud({
      world: this.world
    });
    boot.currentStage.engine.running = true;
  }

};

window.boot.mainDirector = new boot.directors.main();