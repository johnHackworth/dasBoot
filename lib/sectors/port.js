window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var portSector = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Sector, true, options);
  };
  portSector.prototype = {
    type: 'sea',
    isPort: true,
    baseColor: 0xEEFFFF,
    getPort: function() {
      for (var i in this.world.ports) {
        if (this.world.ports[i].sector === this) {
          return this.world.ports[i];
        }
      }
    }
  };

  window.boot.models.PortSector = portSector;
})();