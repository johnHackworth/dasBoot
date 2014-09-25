window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var port = function(options) {
    this.options = options;
    this.sector = options.sector;
    this.init();
  };
  port.prototype = {
    init: function() {
      this.name = this.options.name;
    },

  };

  window.boot.models.Port = port;
})();