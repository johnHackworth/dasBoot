window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var button = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.action = this.action || options.action;
    this.x = options.x;
    this.y = options.y;
    this.init();
  };
  button.prototype = {
    width: 180,
    height: 40,
    buttonImage: '',
    init: function() {
      this.addButton();
    },
    clear: function() {
      if (this.button) {
        this.stage.removeView(this.button);
        this.button = null;
      }
      if (this.background) {
        this.stage.removeView(this.background);
        this.background = null;
      }
    },
    addButton: function() {
      this.clear();
      this.button = new PIXI.Sprite.fromImage(this.buttonImage);
      this.button.x = this.x;
      this.button.y = this.y;
      this.button.height = this.height;
      this.button.width = this.width;
      this.button.setInteractive(true);
      this.button.buttonMode = true;
      this.button.tint = 0xFFDDDD;
      this.stage.addVisualEntity(this.button);
      this.button.click = this.action.bind(this);
      this.button.mouseover = this.illuminateButton.bind(this);
      this.button.mouseout = this.obscureButton.bind(this);
    },
    illuminateButton: function() {
      this.button.tint = 0xFFFFFF;
    },
    obscureButton: function() {
      this.button.tint = 0xFFDDDD;
    }
  };
  window.boot.ui.Button = button;
})();