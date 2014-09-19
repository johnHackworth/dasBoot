window.boot = window.boot || {};
window.boot.dataModels = window.boot.dataModels || {};

(function() {
  var player = function(options) {
    this.options = options;
    this.type = options.type;
    this.init();
  };
  player.prototype = {
    init: function() {
      this.name = this.options.name;
      this.path = [];
    },
    getPathTo: function(sector, append) {
      if (!append) {
        this.path = [];
      }
      if (!this.path.length || this.path[this.path.length - 1] != sector) {
        this.path.push(sector);
      }
    }

  };

  window.boot.dataModels.Player = player;
})();