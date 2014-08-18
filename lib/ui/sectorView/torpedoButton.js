window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var torpedoButton = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.x = options.x;
    this.y = options.y;
    this.tube = options.tube;
    this.sea = options.sea;
    this.n = options.n;
    this.init();
  };
  torpedoButton.prototype = {
    width: 100,
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
    clear: function() {
      if (this.torpedoButton) {
        this.stage.removeView(this.torpedoButton);
        this.torpedoButton = null;
      }
      if (this.fireTorpedoButton) {
        this.stage.removeView(this.fireTorpedoButton);
        this.fireTorpedoButton = null;
      }
      if (this.background) {
        this.stage.removeView(this.background);
        this.background = null;
      }
      if (this.progress) {
        this.stage.removeView(this.progress);
        this.progress = null;
      }
    },
    addButton: function() {
      this.clear();
      this.torpedoButton = new PIXI.Sprite.fromImage('assets/buttons/torpedoButton.png');
      this.torpedoButton.position.x = this.x;
      this.torpedoButton.position.y = this.y;
      this.torpedoButton.height = 33;
      this.torpedoButton.width = this.width;
      this.torpedoButton.setInteractive(true);
      this.stage.addVisualEntity(this.torpedoButton);

      this.torpedoButton.click = this.loadTorpedo.bind(this);
    },
    addFireButton: function() {
      this.clear();
      this.fireTorpedoButton = new PIXI.Sprite.fromImage('assets/buttons/fireTorpedo.png');
      this.fireTorpedoButton.position.x = this.x;
      this.fireTorpedoButton.position.y = this.y;
      this.fireTorpedoButton.height = 33;
      this.fireTorpedoButton.width = 100;
      this.fireTorpedoButton.setInteractive(true);
      this.stage.addVisualEntity(this.fireTorpedoButton);
      this.fireTorpedoButton.click = this.fireTorpedo.bind(this);
      this.changeFireButton();
    },
    activateFireButton: function() {
      if (this.fireTorpedoButton) {
        this.fireTorpedoButton.alpha = 1;
        this.fireTorpedoButton.tint = 0xFFFFFF;
      }
    },
    deactivateFireButton: function() {
      if (this.fireTorpedoButton) {
        this.fireTorpedoButton.alpha = 0.3;
        this.fireTorpedoButton.tint = 0x555555;
      }
    },
    loadTorpedo: function() {
      this.clear();
      this.paintProgress();
      this.tube.loadTorpedo();
    },
    paintProgress: function() {
      this.clear();
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
      this.clear();
      this.addFireButton();
    },
    setReadyToFire: function(ready) {
      this.readyToFire = ready;
      this.changeFireButton();
    },
    changeFireButton: function() {
      if (this.readyToFire) {
        this.activateFireButton();
      } else {
        this.deactivateFireButton();
      }
    },
    fireTorpedo: function() {
      this.trigger('fire');
      this.addButton();
    }
  };
  window.boot.ui.TorpedoButton = torpedoButton;
})();