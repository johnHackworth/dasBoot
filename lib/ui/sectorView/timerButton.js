window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var timerButton = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.x = options.x;
    this.y = options.y;
    this.progressContainer = options.progressContainer;
    this.progressAttribute = options.progressAttribute;
    this.progressTop = options.progressTop;
    this.init();
  };
  timerButton.prototype = {
    waitingText: 'waiting ...',
    goText: 'go',
    width: 100,
    progress: 0,
    progressColor: 0xFFFF99,
    progressCompleteColor: 0x99FF99,
    init: function() {
      this.destroyables = [];
      this.addButton();
    },
    addTitle: function() {
      var text = this.waitingText;
      if (this.progress >= 100) {
        text = this.goText;
      }
      this.tubename = this.stage.addText(text, {
        x: this.x,
        y: this.y + 10,
        fontSize: '10px',
        color: '#333333'
      }, this.destroyables);
      this.tubename.x = this.x + Math.floor((100 - this.tubename.width) / 2);
    },
    clear: function() {
      while (this.destroyables.length) {
        var destroyable = this.destroyables.shift();
        this.stage.removeView(destroyable);
      }
    },
    addButton: function(percentage) {
      this.clear();
      this.timerButton = this.stage.addBackground(this.x, this.y, 100, 30, 0x999999, 1, this.destroyables, null, true);
      this.timerButton.interactive = true;
      this.stage.addVisualEntity(this.timerButton);
      this.timerButton.click = this.action.bind(this);
      this.timerButton.tap = this.action.bind(this);
      this.progress = Math.floor(100 * percentage) || 1;
      var progressColor = this.progressColor;
      if (this.progress >= 100) {
        progressColor = this.progressCompleteColor;
      }
      this.buttonProgress = this.stage.addBackground(this.x, this.y, this.progress, 30, progressColor, 1, this.destroyables, null, true);

      this.addTitle();
    },
    action: function() {
      alert('a');
    },
    paintProgress: function(percentage) {
      this.clear();
      this.addButton(percentage);
    },
  };
  window.boot.ui.TimerButton = timerButton;
})();