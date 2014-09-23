window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var mapViewButton = function(options) {
    pixEngine.utils.extend.call(this, boot.ui.Button, true, options);
  };
  mapViewButton.prototype = {
    buttonImage: 'assets/buttons/mapViewButton.png',
    action: function() {
      boot.mainDirector.testStartSectors();
    },
  };
  window.boot.ui.MapViewButton = mapViewButton;
})();