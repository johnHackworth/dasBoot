window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var ai = function(options) {
    this.init(options);
  };
  ai.prototype = {
    init: function(options) {
      this.boat = options.boat;
    },
    tick: function() {
      this.boat.stance = 'attack';
    }
  };

  window.boot.models.AI = ai;
})();