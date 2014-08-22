window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var combatSimulator = function(options) {
    this.init(options);
  };
  combatSimulator.prototype = {
    init: function(options) {
      this.sea = options.sea;
      this.playerBoat = options.sea.stage.playerBoat;
      this.boats = options.sea.boats;
    },
    getFireSolution: function(origin, target) {
      var distance = this.getDistance(origin, target);
      var gunnerWork = origin.getGunnerWork();
      var distanceSolution = 30 * (10000 - distance) / 10000;
      if (distance > 10000) {
        distanceSolution = 0;
      }
      var gunnerSolution = 60 * Math.floor(gunnerWork) / 100;
      if (!gunnerWork) {
        return 0;
      }

      return Math.floor(distanceSolution + gunnerSolution);
    },
    getDistance: function(origin, target) {
      return target.distance || origin.distance;
    },
    setPositions: function() {
      for (var i in this.sea.sector.vehicles) {
        var boat = this.sea.sector.vehicles[i];
        if (boat.npc && boat.type === 'boat') {
          var distanceVariation = this.resolveStancesDistance(boat, this.playerBoat);
          boat.distance += Math.floor(distanceVariation / 6);
          if (boat.distance < 50) {
            boat.distance = 50;
          }
        }
      }
    },
    resolveStancesDistance: function(boat, player) {
      var distanceVariation = 0;
      if (boat.stance === 'attack') {
        distanceVariation -= boat.maxSpeed;
      }
      if (boat.stance === 'runAway') {
        distanceVariation += boat.maxSpeed;
      }
      if (player.stance === 'attack') {
        distanceVariation -= player.maxSpeed;
      }
      if (player.stance === 'runAway') {
        distanceVariation += playermaxSpeed;
      }
      return distanceVariation;
    }
  };

  window.boot.models.CombatSimulator = combatSimulator;
})();