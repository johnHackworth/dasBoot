window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var countryBadge = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.width = options.width || this.width;
    this.height = options.height || this.height;
    this.fontSize = options.fontSize || this.fontSize;
    this.x = options.x;
    this.y = options.y;
    this.stance = options.stance;
    console.log(this.stance);
    this.container = options.container;
    this.country = options.country;
    this.init();
  };
  countryBadge.prototype = {
    fontName: 'specialElite',
    fontSize: '20px',
    height: 60,
    width: 100,
    marginX: 25,
    marginY: 10,
    fontColor: '#FFFFFF',
    buttonImage: '',
    init: function() {
      this.addBadge();
    },
    clear: function() {
      if (this.view) {
        if (this.container) {
          this.container.removeChild(this.view);
        } else {
          this.stage.removeView(this.view);
        }
        this.view = null;
      }
    },
    addBadge: function() {
      this.clear();
      this.view = new PIXI.DisplayObjectContainer();;
      this.flagView = new PIXI.Sprite.fromImage(this.country.flag);
      this.view.x = this.x;
      this.view.y = this.y;
      this.flagView.height = this.height;
      this.flagView.width = this.width;
      this.view.addChild(this.flagView);
      if (this.container) {
        this.container.addChild(this.view);
      } else {
        this.stage.addVisualEntity(this.view);
      }
      this.addText();
    },
    addText: function() {
      this.renderedText = this.stage.addTextToContainer(this.view,
        this.stance, {
          x: 150,
          y: 15,
          fontSize: this.fontSize,
          fontName: this.fontName,
          color: this.fontColor,
          centered: true
        });
    }
  };
  window.boot.ui.CountryBadge = countryBadge;
})();