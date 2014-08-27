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
      var distanceModificator = 1 - ((distance - 1000) / 7000);
      if (distance < 1000) {
        distanceModificator = 1;
      }
      if (distance > 8000) {
        distanceModificator = 0;
      }

      var visibleChange = Math.floor((deepthModificator + distanceModificator) / 2);
      boat.enemyLocated = Math.random() < visibleChange;
      return boat.enemyLocated;
    },
    getFireSolution: function(origin, target) {
      var distance = this.getDistance(origin, target);
      var gunnerWork = origin.getGunnerWork();
      var distanceSolution = 30 * (10000 - distance) / 10000;
      if (distance > 10000) {
        distanceSolution = 0;
      }

      var gunnerSolution = 30 * Math.floor(gunnerWork) / 100;

      var positionSolution = 0.4 * (origin.positionalAdvantageAttack - target.positionalAdvantageDefense);

      if (!gunnerWork) {
        return 0;
      }
      return Math.floor(distanceSolution + positionSolution + gunnerSolution);
    },
    getDistance: function(origin, target) {
      return target.distance || origin.distance;
    },
    getPlayerBoatMovement: function() {
      var stance = this.playerBoat.stance;
      var motorPower = this.playerBoat.getMotorPower();
      var pilotHability = this.playerBoat.getHelmsmanWork();

      var speed = this.playerBoat.maxSpeed * (2 * motorPower + pilotHability) / 300;
      if (this.playerBoat.deep > 10) {
        speed = this.playerBoat.maxSpeedUnderwater * (2 * motorPower + pilotHability) / 300;
      }
      if (stance === 'ahead') {
        return -1 * speed;
      } else if (stance === 'back') {
        return speed;
      } else if (stance === 'attack') {
        return -1 * Math.floor(speed / 2);
      } else if (stance === 'defense') {
        return Math.floor(speed / 2);
      }
      return 0;
    },
    setPositions: function() {

      for (var i in this.sea.sector.vehicles) {
        var boat = this.sea.sector.vehicles[i];
        if (boat.npc && boat.type === 'boat') {
          window.b = boat;
          var distanceVariation = this.resolveStancesDistance(boat, this.playerBoat);
          boat.distance += Math.floor(distanceVariation / 6);
          if (boat.distance < 50) {
            boat.distance = 50;
          }
        }
      }
    },
    resolveStancesDistance: function(boat, player) {
      var playerBoatMovement = this.getPlayerBoatMovement();
      var distanceVariation = playerBoatMovement;
      if (boat.stance === 'attack') {
        distanceVariation -= boat.getMaxSpeed();
      }
      if (boat.stance === 'back') {
        distanceVariation += boat.getMaxSpeed();
      }
      return distanceVariation;
    },
    boatManiovres: function(boat) {
      for (var i in this.sea.sector.vehicles) {
        this.maniovring(this.sea.sector.vehicles[i]);
      }
    },
    maniovring: function(boat) {
      var maniovres = 0;
      if (boat.stance === 'attack') {
        maniovres = boat.getManiovres();
        boat.positionalAdvantageAttack += maniovres / 10;
        boat.positionalAdvantageDefense -= (boat.maniovrability - maniovres) / 10;
      }
      if (boat.stance === 'defence') {
        maniovres = boat.getManiovres();
        boat.positionalAdvantageDefense += maniovres / 10;
        boat.positionalAdvantageAttack -= (boat.maniovrability - maniovres) / 10;
      }
      if (boat.positionalAdvantageAttack > 100) {
        boat.positionalAdvantageAttack = 100;
      }
      if (boat.positionalAdvantageAttacking < -100) {
        boat.positionalAdvantageAttacking = -100;
      }
      if (boat.positionalAdvantageDefense > 100) {
        boat.positionalAdvantageDefense = 100;
      }
      if (boat.positionalAdvantageDefense < -100) {
        boat.positionalAdvantageDefense = -100;
      }
    }
  };

  window.boot.models.CombatSimulator = combatSimulator;
})();