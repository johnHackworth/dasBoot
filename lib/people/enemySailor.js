window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var nPerson = 0;
  var person = function(options) {
    this.room = options.room;
    pixEngine.utils.extend.call(this, window.boot.models.Person, true, options);
    pixEngine.utils.extend.call(this, window.boot.models.personAI, true, options);
    this.boat = this.stage.playerBoat;
  };
  person.prototype = {
    stance: 'attack',
    npc: true,
    initView: function(extContainer) {
      this.view = new PIXI.DisplayObjectContainer();
      this.headContainer = new PIXI.DisplayObjectContainer();
      this.headview = new PIXI.Sprite(this.assets.textures.head[this.model.headType].standing);
      this.hairview = new PIXI.Sprite(this.assets.textures.hair[this.model.hairType].standing);
      this.hairview.tint = this.model.hairColor;
      this.headview.width = 28;
      this.headview.height = 28;
      this.hairview.width = 29;
      this.hairview.height = 29;
      this.headContainer.addChild(this.headview);
      this.headContainer.addChild(this.hairview);
      this.facialFeaturesView = [];
      for (var i = 0; i < this.model.numberOfFacialFeatures; i++) {
        var featView = new PIXI.Sprite(this.assets.textures.facialFeatures[this.model.facialFeatures[i]].standing);
        this.facialFeaturesView.push(featView);
        featView.width = 29;
        featView.height = 29;
        if (this.tintedFeatures.indexOf(this.model.facialFeatures[i]) >= 0) {
          featView.tint = this.model.hairColor;
        }
        this.headContainer.addChild(featView);
      }

      this.bodyview = new PIXI.Sprite(this.assets.textures.body.standing[0]);
      this.bodyview.tint = 0x0000FF;
      this.bodyview.width = 70 * 60 / 100;
      this.bodyview.height = 60;
      this.pos = {
        x: this.getPosition().x,
        y: this.getPosition().y
      };
      this.currentLevel = this.getLevel();

      this.headContainer.x = 7;
      this.headContainer.y = -12;
      this.view.x = this.pos.x;
      this.view.y = this.pos.y;

      this.view.addChild(this.bodyview);
      this.view.addChild(this.headContainer);
      // this.view.addChild(this.talkContainer);
      this.changeDestination(this.getPosition(this, this.nextDestinations));
      this.stage.addNotVisualEntity(this);
      this.initMoraleMarker();
      // this.initHealthBar({
      //   x: this.bodyview.x + 5,
      //   y: this.bodyview.y - 3,
      //   width: 20,
      //   height: 3,
      //   attribute: 'health',
      //   origin: this.model
      // });
    },
    tick: function(counter, active) {
      window.boot.models.Person.prototype.tick.call(this, counter, active);
      if (counter % 50 === 0) {
        console.log('think')
        this.think();
      }
    }
  };

  window.boot.models.EnemySailor = person;
})();
