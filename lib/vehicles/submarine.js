window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var submarine = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Boat, true, options);
  };
  submarine.prototype = {
    type: 'submarine',
    assets: {
      layout: 'assets/vehicles/sub1.png'
    }
  };

  window.boot.models.Submarine = submarine;
})();