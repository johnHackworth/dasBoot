window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var boatViewButton = function(options) {
    pixEngine.utils.extend.call(this, boot.ui.Button, true, options);
  };
  boatViewButton.prototype = {
    clickable: true,
    fontName: 'germania',
    marginX: 38,
    marginY: 12,
    text: 'Boat View',
    buttonImage: 'assets/buttons/metalButton.png',
    action: function() {
      boot.mainDirector.startBoatView();
    },
  };
  window.boot.ui.BoatViewButton = boatViewButton;
})();