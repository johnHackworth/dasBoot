window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var weather = function(options) {
    this.options = options;
    this.world = options.world;
    this.init();
  };
  weather.prototype = {
    skyState: [{
      name: "clear",
      visibility: 1,
      skyColor: 0x77AAFF,
      skyTint: 0xFFFFFF,
      defaultSea: 3,
      chances: [30, 70]
    }, {
      name: "cloudy",
      visibility: 0.6,
      skyColor: 0x888888,
      skyTint: 0x888888,
      defaultSea: 7,
      chances: [30, 15]
    }, {
      name: "foggy",
      visibility: 0.2,
      skyColor: 0x778899,
      skyTint: 0x999999,
      defaultSea: 5,
      chances: [20, 10]
    }, {
      name: "storm",
      visibility: 0.1,
      skyColor: 0x666666,
      skyTint: 0x777777,
      defaultSea: 10,
      chances: [20, 5]
    }],
    init: function() {
      this.assignWeatherToSectors();
    },
    isWinter: function() {
      var yearDay = Math.floor(world.time.turn % 4) % 365;
      if (yearDay < 90 || yearDay > 275) {
        return true;
      }
      return false;
    },
    getRandomState: function() {
      var selector = this.isWinter() ? 1 : 0;
      var diceRoll = Math.randInt();
      var selected = null;
      var i = 0;
      var aggregated = 0;
      while (!selected) {
        var chances = this.skyState[i].chances[selector];
        aggregated += chances;
        if (aggregated > diceRoll) {
          selected = this.skyState[i];
        }
        i++;
      }

      var skyState = selected;
      skyState.seaState = Math.randInt(skyState.defaultSea);
      if (this.isWinter() && skyState.name == 'clear' && Math.randInt() > 80) {
        return this.getRandomState();
      } else if (!this.isWinter() && skyState.name != 'clear' && Math.randInt() > 80) {
        return this.getRandomState();
      }
      skyState.tint = this.world.time.getTint();
      return skyState;
    },
    assignWeatherToSectors: function() {
      for (var x in this.world.sectors) {
        for (var y in this.world.sectors[x]) {
          this.world.sectors[x][y].weather = this.getRandomState();
        }
      }
    },
    nextTurn: function() {
      this.assignWeatherToSectors();
    }
  };

  window.boot.models.WeatherController = weather;
})();