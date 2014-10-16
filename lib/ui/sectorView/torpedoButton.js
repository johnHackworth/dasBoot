window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var torpedoButton = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.container = options.container;
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
      this.tubename = this.stage.addTextToContainer(this.container, 'Tube  ' + this.n, {
        x: this.x,
        y: this.y + 12,
        fontSize: '10px',
        color: '#333333'
      }, this.destroyables);
    },
    clear: function() {
      if (this.torpedoButton) {
        this.container.removeChild(this.torpedoButton);
        this.torpedoButton = null;
      }
      if (this.fireTorpedoButton) {
        this.container.removeChild(this.fireTorpedoButton);
        this.fireTorpedoButton = null;
      }
      if (this.background) {
        this.container.removeChild(this.background);
        this.background = null;
      }
      if (this.progress) {
        this.container.removeChild(this.progress);
        this.progress = null;
      }
    },
    addButton: function() {
      this.clear();
      this.torpedoButton = new PIXI.Sprite.fromImage('assets/buttons/torpedoButton.png');
      this.torpedoButton.position.x = this.x + 50;
      this.torpedoButton.position.y = this.y;
      this.torpedoButton.height = 33;
      this.torpedoButton.width = this.width;
      this.torpedoButton.setInteractive(true);
      this.container.addChild(this.torpedoButton);
      this.torpedoButton.click = this.load.bind(this);
    },
    addFireButton: function() {
      this.clear();
      this.fireTorpedoButton = new PIXI.Sprite.fromImage('assets/buttons/fireTorpedo.png');
      this.fireTorpedoButton.position.x = this.x + 50;
      this.fireTorpedoButton.position.y = this.y;
      this.fireTorpedoButton.height = 33;
      this.fireTorpedoButton.width = 100;
      this.fireTorpedoButton.setInteractive(true);
      this.container.addChild(this.fireTorpedoButton);
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
    load: function() {
      this.clear();
      this.paintProgress();
      this.tube.loadTorpedo();
    },
    paintProgress: function() {
      this.clear();
      var self = this;
      var torpedoTubeViewWidth = 100;
      this.background = this.stage.addBackgroundToContainer(this.container, this.x + 50, this.y, 100, 30, '#333333', 1);
      this.progress = this.stage.addBackgroundToContainer(this.container, this.x + 50, this.y, 1, 30, 0x000000, 1);
      this.tube.on('loading', function(percentage) {
        self.container.removeChild(self.progress);
        self.progress = self.stage.addBackgroundToContainer(self.container, self.x + 50, self.y, 100 * percentage, 30, 0x000000, 1);
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
      this.tube.emptyTube();
      this.addButton();
    }
  };
  window.boot.ui.TorpedoButton = torpedoButton;
})();