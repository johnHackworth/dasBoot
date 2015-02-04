window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var mapViewButton = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    pixEngine.utils.extend.call(this, boot.ui.TimerButton, true, options);
  };
  mapViewButton.prototype = {
    waitingText: "Can't leave yet",
    goText: "Leave now",
    // buttonImage: 'assets/buttons/mapViewButton.png',
    action: function() {
      if (this.progress >= 100) {
        this.trigger('exit');
      }
    },
  };
  window.boot.ui.MapViewButton = mapViewButton;
})();