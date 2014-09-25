window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var land = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Sector, true, options);
  };
  land.prototype = {
    type: 'land',
    baseColor: 0x000000
  };

  window.boot.models.LandSector = land;
})();