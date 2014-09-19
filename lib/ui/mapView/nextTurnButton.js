window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var nextTurnButton = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.world = options.world;
    this.x = options.x;
    this.y = options.y;
    this.init();
  };
  nextTurnButton.prototype = {
    width: 150,
    height: 50,
    init: function() {
      this.addButton();
    },
    clear: function() {
      if (this.nextTurnButton) {
        this.stage.removeView(this.nextTurnButton);
        this.nextTurnButton = null;
      }
      if (this.background) {
        this.stage.removeView(this.background);
        this.background = null;
      }
    },
    addButton: function() {
      this.clear();
      this.nextTurnButton = new PIXI.Sprite.fromImage('assets/buttons/nextTurnButton.png');
      this.nextTurnButton.x = this.x;
      this.nextTurnButton.y = this.y;
      this.nextTurnButton.height = this.height;
      this.nextTurnButton.width = this.width;
      this.nextTurnButton.setInteractive(true);
      this.nextTurnButton.buttonMode = true;
      this.nextTurnButton.tint = 0xFFDDDD;
      this.stage.addVisualEntity(this.nextTurnButton);
      this.nextTurnButton.click = this.nextTurn.bind(this);
      this.nextTurnButton.mouseover = this.illuminateButton.bind(this);
      this.nextTurnButton.mouseout = this.obscureButton.bind(this);
    },
    illuminateButton: function() {
      this.nextTurnButton.tint = 0xFFFFFF;
    },
    obscureButton: function() {
      this.nextTurnButton.tint = 0xFFDDDD;
    },
    nextTurn: function() {
      this.world.nextTurn();
    },
  };
  window.boot.ui.NextTurnButton = nextTurnButton;
})();