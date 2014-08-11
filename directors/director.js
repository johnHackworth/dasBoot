window.boot = window.boot || {};
window.boot.directors = window.boot.directors || {};

window.boot.directors.main = function() {
  this.init();
};

window.boot.directors.main.prototype = {

  init: function(stage) {
    this.world = new window.boot.models.World();
    this.testStart();

  },
  testStart: function() {
    this.world.getPlainSeaWorld();
    window.world = this.world;
    this.world.playerBoat = new window.boot.models.EarlyUboat({
      world: this.world
    });
    this.world.addVehicleToSector(this.world.playerBoat, 0, 0);

    this.stage = new window.boot.stages.bootStage();
    this.stage.init({
      world: this.world
    });
    for (var i = 0; i < 6; i++) {
      var person = new window.boot.models.Person({
        stage: boot.currentStage
      });
      this.world.playerBoat.addPerson(person);
    }
    boot.currentStage.engine.running = true;
  }

};

window.boot.mainDirector = new boot.directors.main();