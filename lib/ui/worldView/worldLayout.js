window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var worldLayout = function(options) {
    this.stage = options.stage;
    this.world = options.world;
    this.player = this.world.player;
    this.init();
    window.crew = this;
  };
  worldLayout.prototype = {
    viewing: 'crew',
    init: function() {
      this.removables = [];
      this.mainContainer = new PIXI.DisplayObjectContainer();
      this.stage.addVisualEntity(this.mainContainer);
      this.addMapButton();
      this.addCountries();
    },
    clear: function() {
      while (this.removables.length) {
        var rem = this.removables.pop();
        if (rem.clear) {
          rem.clear();
        }
      }
      this.stage.removeEntity(this.mainContainer);
    },
    addMapButton: function() {
      this.mapViewButton = new window.boot.ui.Button({
        stage: this.stage,
        width: 200,
        action: function() {
          boot.mainDirector.startSectors();
        },
        x: boot.config.width - 230,
        y: 5,
        text: 'Map View',
        buttonImage: 'assets/buttons/metalButton.png'
      });
      this.removables.push(this.mapViewButton);
    },

    refresh: function() {
      this.clear();
      this.init();
    },
    addCountries: function() {
      this.countryContainer = new PIXI.DisplayObjectContainer();
      this.countryList = new boot.ui.CountryRelationsList({
        container: this.countryContainer,
        world: this.world,
        stage: this.stage,
        x: 10,
        y: 120,
      });
      this.removables.push(this.countryList);
      this.mainContainer.addChild(this.countryContainer);
    }

  };
  window.boot.ui.WorldLayout = worldLayout;
})();