window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var port = function(options) {
    this.options = options;
    this.sector = options.sector;
    this.model = options.model;
    this.country = options.country;
    this.color = options.country.color;
    this.init();
  };
  port.prototype = {
    init: function() {
      this.originShips = [];
      this.destinationShips = [];
      this.name = this.model.name;
    },
    getActiveShips: function() {
      return this.originShips.length + this.destinationShips.length;
    },


  };

  window.boot.models.Port = port;
})();