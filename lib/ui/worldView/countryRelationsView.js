window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var countryRelationsList = function(options) {
    this.container = options.container;
    this.world = options.world;
    this.countries = options.world.nations;
    this.stage = options.stage;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.click = options.click;
    this.countryViews = [];
    this.init();
  };
  countryRelationsList.prototype = {
    init: function() {
      this.countryListContainer = new PIXI.DisplayObjectContainer();
      this.container.addChild(this.countryListContainer);
      this.processCountries();
    },
    createCountryView: function(country, x, y) {
      var self = this;
      var countryView = new window.boot.ui.CountryBadge({
        country: country,
        x: x,
        y: y,
        stage: this.stage,
        stance: this.getDiplomaticStance(country),
        container: this.countryListContainer
      });
      this.countryViews.push(countryView);
      //   model: personModel,
      //   showRank: true,
      //   x: x,
      //   y: y
      // });
      // personFace.initView();
      // personFace.view.scale.x = 0.75;
      // personFace.view.scale.y = 0.75;
      // personFace.view.interactive = true;
      // personFace.view.buttonMode = true;
      // personFace.view.click = function() {
      //   self.click(personModel);
      // };
      // this.faces.push(personFace);
      // this.facesListContainer.addChild(personFace.view);
    },
    clear: function() {
      var n = 0;
      for (var i in this.countryViews) {
        this.countryListContainer.removeChild(this.countryViews[i].view);
      }
    },
    processCountries: function() {
      var n = 0;
      for (var i = 0; i < this.countries.length; i++) {
        this.createCountryView(this.countries[i], this.x, this.y + i * 70);
        n++;
        if (n > 10) {
          return;
        }
      }
    },
    getDiplomaticStance: function(country) {
      var playerNation = this.world.player.country;
      if (playerNation.allies.indexOf(country) >= 0) {
        return 'ally';
      }
      if (playerNation.enemies.indexOf(country) >= 0) {
        return 'enemy';
      }
      return 'neutral';
    }

  };
  window.boot.ui.CountryRelationsList = countryRelationsList;
})();