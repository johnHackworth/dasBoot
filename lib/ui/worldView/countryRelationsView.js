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
    this.tap = options.click;
    this.countryViews = [];
    this.init();
  };
  countryRelationsList.prototype = {
    playerCountry: null,
    countriesPerColumn: 6,
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
        if (this.countries[i] != this.world.player.country) {
          this.createCountryView(this.countries[i], this.x + 400 * Math.floor(n / this.countriesPerColumn), this.y + n * 95 % (this.countriesPerColumn * 95));
          n++;
        }
      }
    },
    convertToText: function(intValue) {
      if (intValue > 80) {
        return 'Ally';
      }
      if (intValue > 60) {
        return 'Friendly';
      }
      if (intValue > 40) {
        return 'Neutral';
      }
      if (intValue > 20) {
        return 'Wary';
      }
      if (intValue >= 0) {
        return 'Enemy';
      }
    },
    getDiplomaticStance: function(country) {
      var playerNation = this.world.player.country;
      var playerCountryView = this.world.diplomacy.getRelation(playerNation, country);
      var otherCountryView = this.world.diplomacy.getRelation(country, playerNation);
      return [this.convertToText(playerCountryView), this.convertToText(otherCountryView)];

      // if (playerNation.allies.indexOf(country) >= 0) {
      //   return 'ally';
      // }
      // if (playerNation.enemies.indexOf(country) >= 0) {
      //   return 'enemy';
      // }
      // return 'neutral';
    }

  };
  window.boot.ui.CountryRelationsList = countryRelationsList;
})();