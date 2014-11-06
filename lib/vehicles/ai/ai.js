window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var ai = function(options) {
    this.init(options);
  };
  ai.prototype = {
    stances: {
      'attack': {
        behaviour: 'searchEnemy',
        manage: 'manageOffensive'
      },
      'fly': {
        behaviour: 'searchEnemy',
        manage: 'manageOffensive'
      },
      'defend': {
        behaviour: 'searchEnemy',
        manage: 'manageOffensive'
      },
      'neutral': {
        behaviour: 'searchEnemy',
        manage: 'manageOffensive'
      },
      'back': {
        behaviour: 'searchEnemy',
        manage: 'manageOffensive'
      },
      'ahead': {
        behaviour: 'searchEnemy',
        manage: 'manageOffensive'
      }
    },
    init: function(options) {
      this.boat = options.boat;
      this.enemy = options.enemy;
      this.boat.lookingForEnemies = false;
      if (Math.randInt() < 50) {
        this.boat.stance = 'ahead';
      } else {
        this.boat.stance = 'back';
      }
    },
    tick: function(counter, active) {
      if (!active) return;
      this.behave();
      this.manageBoat();
    },
    behave: function() {
      var behaviour = this.stances[this.boat.stance].behaviour;
      this[behaviour]();
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
    manageOffensive: function() {
      if (this.boat.enemyLocated && this.enemy.deep <= 20 && this.boat.npc) {
        this.shootSurface();
      }
      if (this.boat.enemyLocated && this.enemy.deep > 20 && this.boat.npc) {
        this.shootSurface(); // change for hedgedog
      }
      if (!this.boat.enemyLocated && this.boat.npc) {
        this.shootDeepcharges(); // change for hedgedog
      }
    },
    shootSurface: function() {
      if (this.boat.enemyLocated && this.boat.npc) {
        for (var i in this.boat.weapons.cannons) {
          if (Math.randInt() > 15) {
            this.boat.weapons.cannons[i].load();
          }
          if (this.boat.weapons.cannons[i].status == 'ready') {
            this.boat.fire(this.boat.weapons.cannons[i]);
            this.boat.weapons.cannons[i].status = 'empty';
          }
        }
      }
    },
    shootDeepcharges: function() {
      if (this.boat.npc) {
        for (var i in this.boat.weapons.deepCharge) {
          if (Math.randInt() > 15) {
            this.boat.weapons.deepCharge[i].load();
          }
          if (this.boat.weapons.deepCharge[i].status == 'ready') {
            this.boat.launchCharge(this.boat.weapons.deepCharge[i]);
            this.boat.weapons.deepCharge[i].status = 'empty';
          }
        }
      }
    },
    needManiovring: function() {
      return Math.randInt() > this.boat.positionalAdvantageAttack;
    }
  };

  window.boot.models.AI = ai;
})();