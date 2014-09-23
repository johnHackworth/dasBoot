window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var boatViewButton = function(options) {
    pixEngine.utils.extend.call(this, boot.ui.Button, true, options);
  };
  boatViewButton.prototype = {
    buttonImage: 'assets/buttons/boatViewButton.png',
    action: function() {
      boot.mainDirector.testStartSubmarine();
    },
  };
  window.boot.ui.BoatViewButton = boatViewButton;
})();