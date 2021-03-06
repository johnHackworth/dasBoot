window.boot = window.boot || {};
window.boot.stages = window.boot.stages || {};

window.boot.stages.worldStage = function(options) {
  pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
  this.options = options;
};


window.boot.stages.worldStage.prototype = {
  init: function(options) {
    if (window.boot.currentStage) {
      window.boot.currentStage.destroy();
    } else {
      window.boot.currentStage = new pixEngine.Stage({
        fps: null,
        width: window.boot.config.width,
        height: window.boot.config.height,
        assets: [],
        init: function(stage) {
          var self = this;
          document.getElementById('loader').remove();
        }
      });
      window.boot.currentStage.init();
    }
    window.boot.currentStage.initHud = function(options) {
      this.playerBoat = options.world.playerBoat;

      this.world = options.world;
      this.worldLayout = new boot.ui.WorldLayout({
        stage: this,
        world: this.world,
        sector: this.sector
      });
    };

  }
};