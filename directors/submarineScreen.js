window.boot = window.boot || {};
window.boot.stages = window.boot.stages || {};

window.boot.stages.bootStage = function(options) {
  this.options = options;
  this.init(options);
};

window.boot.stages.bootStage.prototype = {
  init: function(options) {

    window.boot.currentStage = new pixEngine.Stage({
      width: window.boot.config.width,
      height: window.boot.config.height,
      assets: [
        'assets/vehicles/test.jpg'
      ],
      init: function(stage) {
        var self = this;
        // this.world = new moletube.models.World({
        //   stage: this
        // });
        // this.engine.addEntity(this.world);
        this.sector = options.world.playerBoat.sector;
        this.playerBoat = options.world.playerBoat;

        this.hudLayout = new window.boot.ui.HudLayout({
          stage: this
        });
        document.getElementById('loader').remove();
      }
    });

    window.boot.currentStage.init();
  }
};