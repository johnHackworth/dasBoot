window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var torpedoTube = function(options) {
    this.init(options);
  };
  torpedoTube.prototype = {
    init: function(options) {
      this.torpedoRoom = options.torpedoRoom;
      this.stage = options.stage;
      this.stage.addNonVisualEntity(this);
    }
  };

  window.boot.models.TorpedoTube = torpedoTube;
})();