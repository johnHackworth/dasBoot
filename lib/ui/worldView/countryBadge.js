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
    this.container = options.container;
    this.country = options.country;
    this.init();
  };
  countryBadge.prototype = {
    fontName: 'specialElite',
    fontSize: '20px',
    fontSizeLabel: '12px',
    height: 60,
    width: 100,
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
      this.view = new PIXI.DisplayObjectContainer();
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
      this.addTexts();
    },
    addTexts: function() {
      this.name = this.stage.addTextToContainer(this.view,
        this.country.name, {
          x: 50,
          y: 60,
          fontSize: '12px',
          fontName: this.fontName,
          color: this.fontColor,
          centered: true
        });

      this.renderedText = this.stage.addTextToContainer(this.view,
        this.stance[0], {
          x: 180,
          y: 15,
          fontSize: this.fontSize,
          fontName: this.fontName,
          color: this.getColor(this.stance[0]),
          centered: true
        });
      this.renderedLabel = this.stage.addTextToContainer(this.view,
        '(your view)', {
          x: 180,
          y: 40,
          fontSize: this.fontSizeLabel,
          fontName: this.fontName,
          color: this.fontColor,
          centered: true
        });
      this.renderedText2 = this.stage.addTextToContainer(this.view,
        this.stance[1], {
          x: 300,
          y: 15,
          fontSize: this.fontSize,
          fontName: this.fontName,
          color: this.getColor(this.stance[1]),
          centered: true
        });
      this.renderedLabel = this.stage.addTextToContainer(this.view,
        '(their view)', {
          x: 300,
          y: 40,
          fontSize: this.fontSizeLabel,
          fontName: this.fontName,
          color: this.fontColor,
          centered: true
        });
    },
    getColor: function(stance) {
      var colors = {
        "Ally": '#00BB00',
        'Friendly': '#AADD88',
        'Neutral': '#999999',
        'Wary': '#DDAA88',
        'Enemy': '#BB0000'
      };
      return colors[stance];
    }
  };
  window.boot.ui.CountryBadge = countryBadge;
})();