window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var hydro = function(options) {
    this.init(options);
  };
  hydro.prototype = {
    assets: {
      background: 'assets/ui/hydrophoneBackground.png',
    },
    init: function(options) {
      this.sea = options.sea;
      this.stage = options.stage;
      this.container = options.container;
      this.x = options.x;
      this.y = options.y;
      this.sea = options.sea;
      this.paintBackground();
    },
    paintBackground: function() {
      var texture = PIXI.Texture.fromImage(this.assets.background);
      var texture2 = new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 1200, 250));

      this.view = new PIXI.Sprite(texture2);
      this.view.x = 0;
      this.view.y = 0;
      this.container.addChild(this.view);
    }

  };

  window.boot.ui.HydrophoneScreen = hydro;
})();