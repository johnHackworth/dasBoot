window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var assaultingBoat = function(options) {
    this.container = options.container;
    this.peopleView = options.peopleView;
    this.stage = options.stage;
    this.initView();
    // this.createSailors();
    this.setPosition(options.x, options.y);
  };
  assaultingBoat.prototype = {
    assets: {
      side: 'assets/vehicles/lifeboatEmpty.png'
    },
    initView: function() {
      this.sideTexture = new PIXI.Texture.fromImage(this.assets.side);
      this.view = PIXI.Sprite.fromFrame(this.assets.side);
      this.container.addChild(this.view);
      this.stage.addNotVisualEntity(this);
    },
    setPosition: function(x, y) {
      this.view.x = x;
      this.view.y = y;
      this.view.width = 200;
      this.view.height = 40;
    },
    tick: function(counter, active) {
      if (!active) return;
      this.counter++;
      this.view.x--;
    },
    getPosition: function(sailor) {
      return {
        x: this.view.x,
        y: this.view.y
      };
    },
    createSailors: function() {
      this.sailors = [];
      var nSailors = Math.randInt(3) + 2;
      for (var n = 0; n < nSailors; n++) {
        var enemy = new window.boot.models.EnemySailor({
          model: new boot.dataModels.Person(),
          room: this,
          stage: this.stage
        });
        this.sailors.push(enemy);
        return enemy;
        // this.peopleView.addPerson(enemy);
      }
    },
    isFullOfWater: function() {
      return false;
    }
  };

  window.boot.models.AssaultingBoat = assaultingBoat;
})();