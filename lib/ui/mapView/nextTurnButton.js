window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var nextTurnButton = function(options) {
    pixEngine.utils.extend.call(this, boot.ui.Button, true, options);
    this.world = options.world;
    this.map = options.map;
  };
  nextTurnButton.prototype = {
    clickable: true,
    buttonImage: 'assets/buttons/nextTurnButton.png',
    action: function() {
      if (this.clickable) {
        this.world.nextTurn();
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