window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var ai = function(options) {
    this.init(options);
  };
  ai.prototype = {
    init: function(options) {
      this.boat = options.boat;
      this.enemy = options.enemy;
      this.boat.lookingForEnemies = false;
      this.offensiveAI = new window.boot.models.OffensiveAI(options);
      this.stanceAI = new window.boot.models.StanceAI(options);
    },
    setEnemy: function(enemy) {
      this.enemy = enemy;
      this.offensiveAI.enemy = enemy;
      this.stanceAI.enemy = enemy;
    },
    tick: function(counter, active) {
      if (!active) return;
      if (counter % 60 === 0 && Math.randInt() > 60) {
        this.boat.stance = this.stanceAI.getStance(this);
      }
      this.behave();
    },
    behave: function() {
      var manager = this.getFullStance(this.boat.stance);
      if (manager.ia) {
        this[manager.ia][manager.behaviour]();
      } else {
        this[manager.behaviour]();
      }
    },
    searchEnemy: function() {
      if (this.boat.enemyLocated) {
        if (this.needManiovring()) {
          this.boat.stance = 'attack';
        } else {
          this.boat.stance = 'ahead';
        }
      }
    },
    manageBoat: function() {
      var behaviour = this.stances[this.boat.stance].manage;
      this[behaviour]();
    },
    needManiovring: function() {
      return Math.randInt() > this.boat.positionalAdvantageAttack;
    },
    getFullStance: function(stanceName) {
      return this.stanceAI.stances[stanceName];
    },
    doNothing: function() {

    }
  };

  window.boot.models.AI = ai;
})();