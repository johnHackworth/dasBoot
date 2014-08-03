window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var boat = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Vehicle, true, options);

  };
  boat.prototype = {
    type: 'boat',
    assets: {
      layout: 'assets/vehicles/test2.jpg'
    },
    init: function() {}
  };

  window.boot.models.Boat = boat;
})();