window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var deepSea = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Sector, true, options);
  };
  deepSea.prototype = {
    type: 'sea',
    baseColor: 0x000000
  };

  window.boot.models.DeepSeaSector = deepSea;
})();