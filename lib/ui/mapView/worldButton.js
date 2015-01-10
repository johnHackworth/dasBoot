window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var worldViewButton = function(options) {
    pixEngine.utils.extend.call(this, boot.ui.Button, true, options);
  };
  worldViewButton.prototype = {
    baseTint: 0xDDDDFF,
    overTint: 0x9999FF,
    clickable: true,
    fontName: 'germania',
    marginX: 38,
    marginY: 8,
    fontColor: '#556655',
    text: 'WORLD VIEW',
    buttonImage: 'assets/buttons/metalButton.png',
    action: function() {
      boot.mainDirector.startWorldView();
    },
  };
  window.boot.ui.WorldViewButton = worldViewButton;
})();