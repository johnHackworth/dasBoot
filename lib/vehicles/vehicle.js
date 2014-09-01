window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var vehicle = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.options = options;
    options.world.vehicles.push(this);
  };
  vehicle.prototype = {
    type: 'vehicle',
    assets: [],
    init: function() {},
    addCurrentSector: function(sector) {
      this.sector = sector;
    },
    removeCurrentSector: function() {
      this.sector = null;
    },
    hitBy: function(projectile) {
      var damage = Math.randInt(projectile.explosiveAmount);
      this.hullStrength -= damage;
    }
  };

  window.boot.models.Vehicle = vehicle;
})();