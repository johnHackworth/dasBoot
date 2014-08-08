window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var boat = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Vehicle, true, options);

  };
  boat.prototype = {
    type: 'boat',
    layoutMap: [],
    topRoom: 0,
    leftRoom: 0,
    assets: {
      layout: 'assets/vehicles/warship1.png'
    },
    init: function() {
      this.layout = new window.boot.models.ShipLayout({
        boat: this,
        layout: this.layoutMap
      });
    }
  };

  window.boot.models.Boat = boat;
})();