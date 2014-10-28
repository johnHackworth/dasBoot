window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var spriteTest = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.components.HealthBar);
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.x = options.x;
    this.y = options.y;
    this.spriteName = options.spriteName || 'tests/sailors.png';
    this.spriteHeight = options.spriteHeight || 100;
    this.spriteWidth = options.spriteWidth || 70;
    this.spriteNumber = options.spriteNumber || 5;
    this.spriteOffset = options.spriteOffset || 0;
    this.spriteTint = options.spriteTint;
    this.step = options.step || 10;
    this.init(options);
  };
  spriteTest.prototype = {
    counter: 0,
    assets: boot.assets.person,
    x: 0,
    y: 0,
    init: function() {
      this.initView();
    },
    initTextures: function() {
      this.spriteSheet = PIXI.Texture.fromImage(this.spriteName);
      this.textures = [];
      for (var i = 0; i < this.spriteNumber; i++) {
        this.textures.push(
          new PIXI.Texture(this.spriteSheet, new PIXI.Rectangle(this.spriteOffset + this.spriteWidth * i, 0, this.spriteWidth, this.spriteHeight))
        );
      }
    },
    initView: function() {
      this.initTextures();

      this.view = new PIXI.Sprite(this.textures[0]);
      this.view.x = this.x;
      this.view.y = this.y;
      if (this.spriteTint) {
        console.log(this.spriteTint);
        this.view.tint = this.spriteTint;
      }

      this.stage.addEntity(this);
    },

    animateMoving: function() {
      var i = null;
      var stepAmount = this.step;
      var animNumber = this.textures.length;
      if ((this.counter % stepAmount === 0)) {
        var step = (Math.floor(this.counter / stepAmount)) % animNumber;
        this.view.setTexture(this.textures[step]);
      }
    },
    tick: function(counter, active) {
      if (!active) return;
      this.counter++;
      this.animateMoving();
    }
  };

  window.boot.models.SpriteTest = spriteTest;
})();