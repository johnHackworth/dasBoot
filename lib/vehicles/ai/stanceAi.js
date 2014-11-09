window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var ai = function(options) {
    this.init(options);
  };
  ai.prototype = {
    stances: {
      'attack': {
        behaviour: 'manageOffensive',
        ia: 'offensiveAI',
        manage: 'manageOffensive',
        movement: 'halfAhead'
      },
      'fly': {
        behaviour: 'doNothing',
        manage: 'manageOffensive',
        movement: 'fullBack'
      },
      'defend': {
        behaviour: 'doNothing',
        manage: 'manageOffensive',
        movement: 'stand'
      },
      'neutral': {
        behaviour: 'doNothing',
        manage: 'manageOffensive',
        movement: 'stand'
      },
      'back': {
        behaviour: 'doNothing',
        manage: 'manageOffensive',
        movement: 'fullBack'
      },
      'ahead': {
        behaviour: 'doNothing',
        manage: 'manageOffensive',
        movement: 'fullAhead'
      }
    },
    init: function(options) {
      this.boat = options.boat;
      this.enemy = options.enemy;
    },
    getStance: function(ai) {
      if (!this.boat.enemyLocated) {
        return this.getNotLocalizedEnemyStance();
      } else {
        return this.getLocalizedEnemyStance();
      }
    },
    getNotLocalizedEnemyStance: function() {
      if (this.boat.enemyHasBeenLocated) {
        return this.getKnowsAboutEnemyStance();
      } else {
        return this.getNotKnowsAboutEnemyStance();
      }
    },
    getKnowsAboutEnemyStance: function() {
      if (this.boat.hullStrength < 40 && Math.randInt() > this.boat.hullStrength) {
        return 'fly';
      }
      if (this.boat.AIstance === 'offensive') {
        return this.getUnlocalizedEnemyOffensiveStance();
      }
      if (this.boat.AIstance === 'civilian') {
        return 'fly';
      }
      if (this.boat.AIstance === 'defensive') {
        return this.getUnlocalizedEnemyDefensiveStance();
      }
    },
    getUnlocalizedEnemyDefensiveStance: function() {
      if (this.boat.weapons.deepCharge) {
        if (this.boat.distance < 1000) {
          return 'defend';
        } else {
          return 'neutral';
        }
      } else {
        return 'defend';
      }
    },
    getUnlocalizedEnemyOffensiveStance: function() {
      if (this.boat.weapons.deepCharge) {
        if (this.boat.distance < 1000) {
          return 'attack';
        } else {
          return 'ahead';
        }
      } else {
        return 'attack';
      }
    },
    getNotKnowsAboutEnemyStance: function() {
      if (Math.randInt() > 50) {
        return 'ahead';
      } else {
        return 'back';
      }
    },
    getLocalizedEnemyStance: function() {
      if (this.boat.hullStrength < 20 && Math.randInt() > this.boat.hullStrength) {
        return 'fly';
      }

      if (this.boat.AIstance === 'offensive') {
        if (this.boat.distance > this.boat.getMaxAttackDistance()) {
          return 'ahead';
        } else {
          return 'attack';
        }
      }
      if (this.boat.AIstance === 'civilian') {
        return 'fly';
      }
      if (this.boat.AIstance === 'defensive') {
        return 'defend';
      }
    }
  };

  window.boot.models.StanceAI = ai;
})();