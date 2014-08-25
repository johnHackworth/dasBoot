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
    isPlayerBoatVisibleFromBoats: function() {
      for (var i in this.boats) {
        this.isPlayerBoatVisibleFrom(this.boats[i]);
      }
    },
    isPlayerBoatVisibleFrom: function(boat) {
      var deep = this.playerBoat.deep;
      var distance = boat.distance;
      var deepthModificator = 1 - (deep - 30) / 50;
      if (deep < 30) {
        deepthModificator = 1;
      }
      if (deep > 80) {
        deepthModificator = 0;
      }
      var distanceModificator = 1 - (distance - 1000 / 6000);
      if (distance < 1000) {
        distanceModificator = 1;
      }
      if (distance > 8000) {
        distanceModificator = 0;
      }

      var visibleChange = Math.floor((deepthModificator + distanceModificator) / 2);
      boat.enemyLocated = Math.randInt() > visibleChange;
      return boat.enemyLocated;
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