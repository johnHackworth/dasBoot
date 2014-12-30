window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var nPerson = 0;
  var personFace = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Person, true, options);
    this.backgroundColor = options.backgroundColor || this.backgroundColor;
    this.lineColor = options.lineColor || this.lineColor;
    if(options.highres) {
      this.textureType = 'texturesHighRes';
    }
  };
  personFace.prototype = {
    backgroundColor: 0x99AABB,
    lineColor: 0x1f3C71,
    hasArrivedDestination: function() {
      return true;
    },
    initView: function() {
      this.view = new PIXI.DisplayObjectContainer();
      this.pos = {
        x: this.x,
        y: this.y
      };
      this.headContainer = new PIXI.DisplayObjectContainer();
      this.headview = new PIXI.Sprite(this.assets.textures.head[this.model.headType].standing);
      this.hairview = new PIXI.Sprite(this.assets.textures.hair[this.model.hairType].standing);
      this.hairview.tint = this.model.hairColor;
      this.backgroundView = this.getBackground();
      this.backgroundView.y = this.backgroundView.height * 0.10;

      this.headContainer.addChild(this.backgroundView);
      this.headContainer.addChild(this.headview);
      this.headContainer.addChild(this.hairview);
      this.facialFeaturesView = [];
      for (var i = 0; i < this.model.numberOfFacialFeatures; i++) {
        var featView = new PIXI.Sprite(this.assets.textures.facialFeatures[this.model.facialFeatures[i]].standing);
        this.facialFeaturesView.push(featView);
        if (this.tintedFeatures.indexOf(this.model.facialFeatures[i]) >= 0) {
          featView.tint = this.model.hairColor;
        }
        this.headContainer.addChild(featView);
      }
      this.view.x = this.x || 0;
      this.view.y = this.y || 0;
      // this.headContainer.y = -12;
      // this.headContainer.x = 7;
      this.animate();
      this.view.addChild(this.headContainer);
      if (this.stage) {
        this.stage.addNotVisualEntity(this);
      }
    },
    moveView: function() {
      return;
    },
    getBackground: function() {
      var view = new PIXI.Sprite(this.assets[this.textureType].head[this.model.headType].background[0]);
      view.tint = this.backgroundColor;
      return view;
      // var width = Math.floor(this.headview.width * 0.75);
      // var view = new PIXI.Graphics();
      // view.beginFill(this.backgroundColor);
      // view.lineStyle(5, this.lineColor);
      // view.drawCircle(this.headview.width / 2, this.headview.width * 0.60, width);
      // view.endFill();
      // return view;
    },
    tick: function() {
      this.animate();
    }
  };
  window.boot.models.PersonFace = personFace;
})();
