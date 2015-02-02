window.boot = window.boot || {};
window.boot.stages = window.boot.stages || {};

window.boot.stages.startStage = function(options) {
  pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
  this.options = options;
};


window.boot.stages.startStage.prototype = {
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
          this.initHud();
        }
      });
      setTimeout(window.boot.currentStage.init.bind(window.boot.currentStage), 200);
    }
    window.boot.currentStage.initHud = function(options) {
      this.background = new PIXI.Sprite.fromImage('assets/map/mapBackground.png');
      this.background.x = 0;
      this.background.y = 0;
      this.background.width = boot.config.width - 0;
      this.background.height = boot.config.height - 0;
      this.background.interactive = true;
      this.background.buttonMode = true;
      this.background.click = boot.mainDirector.startSectors.bind(boot.mainDirector);
      this.addVisualEntity(this.background);
      this.text = this.addText('', {
        x: 600,
        y: 200,
        fontSize: '28px',
        fontName: 'handwrite',
        color: '#555555',
        center: true
      });
      this.text = this.addText('', {
        x: 600,
        y: 200,
        fontSize: '28px',
        fontName: 'germania',
        color: '#555555',
        center: true
      });
      setTimeout(boot.mainDirector.startSectors.bind(boot.mainDirector), 100);
    };

  }
};