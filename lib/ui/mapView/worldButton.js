window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var worldViewButton = function(options) {
    pixEngine.utils.extend.call(this, boot.ui.Button, true, options);
  };
  worldViewButton.prototype = {
    clickable: true,
    fontName: 'germania',
    marginX: 38,
    marginY: 8,
    baseTint: 0xDDDDDD,
    text: 'World View',
    buttonImage: 'assets/buttons/metalButton.png',
    action: function() {
      boot.mainDirector.startWorldView();
    },
  };
  window.boot.ui.WorldViewButton = worldViewButton;
})();