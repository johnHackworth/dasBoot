window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var ui = function(options) {
    this.currentlyVisible = [];
    this.overlayManager = options.overlayManager;
    this.stage = options.stage;
    this.init();
  };
  ui.prototype = {
    init: function() {
      // this.initConstructionButtons();
    },
    initConstructionButtons: function() {

    }
  };
  window.boot.ui.UIManager = ui;
})();