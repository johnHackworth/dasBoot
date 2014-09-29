window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var land = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Sector, true, options);
  };
  land.prototype = {
    type: 'land',
    baseColor: 0xFFFFFF
  };

  window.boot.models.LandSector = land;
})();
