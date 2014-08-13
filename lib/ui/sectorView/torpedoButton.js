window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var torpedoButton = function(options) {
    this.stage = options.stage;
    this.x = options.x;
    this.y = options.y;
    this.tube = options.tube;
    this.n = options.n;
    this.init();
  };
  torpedoButton.prototype = {
    init: function() {
      this.addTitle();
      this.addButton();
    },
    addTitle: function() {
      this.tubename = this.stage.addText('Torpedo ' + this.n, {
        x: this.x,
        y: this.y - 20,
        fontSize: '10px',
        color: '#333333'
      }, this.destroyables);
    },
    addButton: function() {
      this.torpedoButton = new PIXI.Sprite.fromImage('assets/buttons/torpedoButton.png');
      this.torpedoButton.position.x = this.x;
      this.torpedoButton.position.y = this.y;
      this.torpedoButton.height = 33;
      this.torpedoButton.width = 100;
      this.torpedoButton.setInteractive(true);
      this.stage.addVisualEntity(this.torpedoButton);

      this.torpedoButton.click = this.loadTorpedo.bind(this);
    },
    addFireButton: function() {
      this.torpedoButton = new PIXI.Sprite.fromImage('assets/buttons/fireTorpedo.png');
      this.torpedoButton.position.x = this.x;
      this.torpedoButton.position.y = this.y;
      this.torpedoButton.height = 33;
      this.torpedoButton.width = 100;
      this.torpedoButton.setInteractive(true);
      this.stage.addVisualEntity(this.torpedoButton);

      this.torpedoButton.click = this.fireTorpedo.bind(this);
    },
    loadTorpedo: function() {
      this.stage.removeView(this.torpedoButton);
      this.paintProgress();
      this.tube.loadTorpedo();
    },
    paintProgress: function() {
      var self = this;
      var torpedoTubeViewWidth = 100;
      this.background = this.stage.addBackground(this.x, this.y, 100, 20, '#333333', 1);
      this.progress = this.stage.addBackground(this.x, this.y, 1, 20, 0x000000, 1);
      this.tube.on('loading', function(percentage) {
        self.stage.removeView(self.progress);
        self.progress = self.stage.addBackground(self.x, self.y, 100 * percentage, 20, 0x000000, 1);
      });
      this.tube.on('loaded', this.torpedoReady.bind(this));
    },
    torpedoReady: function() {
      this.stage.removeView(this.progress);
      this.stage.removeView(this.background);
      this.addFireButton();
    },
    fireTorpedo: function() {

    }
  };
  window.boot.ui.TorpedoButton = torpedoButton;
})();