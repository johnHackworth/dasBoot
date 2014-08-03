window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var nation = function(options) {
    this.options = options;
    this.init();
  };
  nation.prototype = {
    tileHeight: window.boot.config.tileWidth,
    assets: [],
    sectors: [],
    init: function() {
      this.name = this.options.name;

      this.allies = [];
      this.enemies = [];
    },

  };

  window.boot.models.Nation = nation;
})();