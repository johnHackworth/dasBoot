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
      var deepthModificator = 1 - (deep - 30) / 80;
      if (deep < 30) {
        deepthModificator = 1;
      }
      if (deep > 110) {
        deepthModificator = 0;
      }
      var distanceModificator = 1 - ((distance - 4000) / 12000);
      if (distance < 4000) {
        distanceModificator = 1;
      }
      if (distance > 12000) {
        distanceModificator = 0;
      }
      var searchingModificator = boat.lookingForEnemies ? 3 : 1;

      var visibleChange = searchingModificator * Math.floor((deepthModificator + distanceModificator) / 2);
      boat.enemyLocated = Math.random() < visibleChange;
      if (boat.enemyLocated) {
        boat.lookingForEnemies = 10000;
      }
      return boat.enemyLocated;
    },
    getFireSolution: function(origin, target) {
      if (!target) {
        return 0;
      }
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
    getAccuracyToTarget: function(origin, target) {
      var distance = this.getDistance(origin, target);
      var gunnerWork = origin.getArtilleryWork();
      var distanceSolution = 50 * (10000 - distance) / 10000;
      if (distance > 10000) {
        distanceSolution = 0;
      }

      var gunnerSolution = 50 * Math.floor(gunnerWork) / 100;


      if (!gunnerWork) {
        return 0;
      }
      return Math.floor(distanceSolution + gunnerSolution);
    },
    getDistance: function(origin, target) {
      if (!target) {
        return 0;
      }
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
      for (var i in this.boats) {
        var boat = this.boats[i];
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
    },
    canPlayerLeave: function() {
      for (var i in this.boats) {
        if (this.isPlayerBoatVisibleFrom(this.boats[i]) && !this.boats[i].destroyed) {
          return false;
        }
      }
      return true;
    }
  };

  window.boot.models.CombatSimulator = combatSimulator;
})();