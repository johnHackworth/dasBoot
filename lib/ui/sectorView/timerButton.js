window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var timerButton = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.x = options.x;
    this.y = options.y;
    this.text = 'waiting ...';
    this.init();
  };
  timerButton.prototype = {
    width: 100,
    init: function() {
      this.destroyables = [];
      this.addButton();
    },
    addTitle: function() {
      this.tubename = this.stage.addText(this.text, {
        x: this.x,
        y: this.y + 12,
        fontSize: '10px',
        color: '#333333'
      }, this.destroyables);
    },
    clear: function() {
      while (this.destroyables.length) {
        var destroyable = this.destroyables.shift();
        this.stage.removeView(destroyable);
      }
    },
    addButton: function() {
      this.clear();
      this.timerButton = this.stage.addBackground(this.x, this.y, 100, 30, 0x999999, 1, this.destroyables, null, true);
      this.timerButton.setInteractive(true);
      this.stage.addVisualEntity(this.timerButton);
      this.timerButton.click = this.action.bind(this);
      this.addTitle();
    },
    action: function() {
      alert('a');
    },

    load: function() {
      this.clear();
      this.paintProgress();
    },
    paintProgress: function() {
      this.clear();
      var self = this;
      var torpedoTubeViewWidth = 100;
      this.background = this.stage.addBackground(this.x + 50, this.y, 100, 30, '#333333', 1);
      this.progress = this.stage.addBackground(this.x + 50, this.y, 1, 30, 0x000000, 1);
      this.tube.on('loading', function(percentage) {
        self.stage.removeView(self.progress);
        self.progress = self.stage.addBackground(self.x + 50, self.y, 100 * percentage, 30, 0x000000, 1);
      });
      this.tube.on('loaded', this.torpedoReady.bind(this));
    },
  };
  window.boot.ui.TimerButton = timerButton;
})();