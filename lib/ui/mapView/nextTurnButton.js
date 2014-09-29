window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var nextTurnButton = function(options) {
    pixEngine.utils.extend.call(this, boot.ui.Button, true, options);
    this.world = options.world;
    this.map = options.map;
  };
  nextTurnButton.prototype = {
    buttonImage: 'assets/buttons/nextTurnButton.png',
    action: function() {
      this.world.nextTurn();
      this.map.nextTurn();
    }
  };
  window.boot.ui.NextTurnButton = nextTurnButton;
})();