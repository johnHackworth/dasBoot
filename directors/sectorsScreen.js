window.boot = window.boot || {};
window.boot.stages = window.boot.stages || {};

window.boot.stages.sectorsStage = function(options) {
  pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
  this.options = options;
};


window.boot.stages.sectorsStage.prototype = {
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
        }
      });
      window.boot.currentStage.init();
    }
    window.boot.currentStage.initUI = function(options) {
      this.playerBoat = options.world.playerBoat;

      this.world = options.world;
      this.hudLayout = new boot.ui.MapLayout({
        stage: this,
        world: this.world,
        sector: this.sector
      });
      setTimeout(this.hudLayout.notificationDispatcher.showFirstMessage.bind(this.hudLayout.notificationDispatcher), 500);
    };

  }
};