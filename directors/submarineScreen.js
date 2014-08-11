window.boot = window.boot || {};
window.boot.stages = window.boot.stages || {};

window.boot.stages.bootStage = function(options) {
  pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
  this.options = options;
};


window.boot.stages.bootStage.prototype = {
  init: function(options) {

    window.boot.currentStage = new pixEngine.Stage({
      width: window.boot.config.width,
      height: window.boot.config.height,
      assets: [
        'assets/vehicles/warship1.png',
        'assets/vehicles/sub1.png',
        'assets/people/body_m_1_side_1.png',
        'assets/people/body_m_1_side_2.png',
        'assets/people/body_m_1.png',
        'assets/people/head_m_1_side.png',
        'assets/people/head_m_2.png',
        'assets/people/head_m_3.png',
        'assets/people/head_m_4.png',
        'assets/people/head_m_5.png',
      ],
      init: function(stage) {
        var self = this;
        this.world = options.world;
        // this.world = new moletube.models.World({
        //   stage: this
        // });
        // this.engine.addEntity(this.world);
        this.sector = options.world.playerBoat.sector;
        this.playerBoat = options.world.playerBoat;
        this.world = options.world;
        this.hudLayout = new window.boot.ui.HudLayout({
          stage: this,
          world: this.world
        });
        document.getElementById('loader').remove();
      }
    });

    window.boot.currentStage.init();
  }
};