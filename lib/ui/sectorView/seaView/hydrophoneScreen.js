window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var hydro = function(options) {
    this.init(options);
  };
  hydro.prototype = {
    init: function(options) {
      this.sea = options.sea;
      this.stage = options.stage;
      this.container = options.container;
      this.x = options.x;
      this.y = options.y;
      this.sea = options.sea;
    },

  };

  window.boot.ui.HydrophoneScreen = hydro;
})();