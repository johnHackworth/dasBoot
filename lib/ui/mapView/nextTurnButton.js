window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var nextTurnButton = function(options) {
    pixEngine.utils.extend.call(this, boot.ui.Button, true, options);
    this.world = options.world;
  };
  nextTurnButton.prototype = {
    buttonImage: 'assets/buttons/nextTurnButton.png',
    action: function() {
      this.world.nextTurn();
    }
  };
  window.boot.ui.NextTurnButton = nextTurnButton;
})();