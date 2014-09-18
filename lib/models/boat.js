window.boot = window.boot || {};
window.boot.dataModels = window.boot.dataModels || {};

(function() {
  var boat = function(options) {
    this.options = options;
    this.type = options.type;
    this.init();
  };
  boat.prototype = {
    init: function() {
      this.name = this.options.name;
    },

  };

  window.boot.dataModels.Boat = boat;
})();