window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var nextTurnButton = function(options) {
    pixEngine.utils.extend.call(this, boot.ui.Button, true, options);
    this.world = options.world;
    this.map = options.map;
  };
  nextTurnButton.prototype = {
    baseTint: 0x99FF99,
    overTint: 0xACFFAC,
    fontName: 'germania',
    marginX: 38,
    marginY: 12,
    fontColor: '#556655',
    clickable: true,
    text: 'Next Turn',
    buttonImage: 'assets/buttons/metalButton.png',
    action: function() {
      if (this.clickable) {
        this.map.nextTurn();
      }
    },

    makeNotClickable: function() {
      this.clickable = false;
      this.button.buttonMode = false;
    },
    makeClickable: function() {
      this.clickable = true;
      this.button.buttonMode = true;
    }
  };
  window.boot.ui.NextTurnButton = nextTurnButton;
})();