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
    },
    manageOffensive: function() {
      if (!this.boat.npc) {
        return;
      }
      this.manageAttack();
    },
    manageAttack: function() {
      if (this.boat.enemyLocated) {
        if (this.boat.enemy.deep <= 30) {
          this.shootSurface();
        } else {
          if (this.boat.distance < 1000) {
            this.shootDeepcharges();
          } else {
            this.shootSurface(); // change for hedgedog
          }
        }
      } else {
        this.shootDeepcharges(); // change for hedgedog
      }
    },
    shootSurface: function() {
      for (var i in this.boat.weapons.cannons) {
        if (Math.randInt() > 15) {
          this.boat.weapons.cannons[i].load();
        }
        if (this.boat.weapons.cannons[i].status == 'ready') {
          this.boat.fire(this.boat.weapons.cannons[i]);
          this.boat.weapons.cannons[i].status = 'empty';
        }
      }
    },
    shootDeepcharges: function() {
      for (var i in this.boat.weapons.deepCharge) {
        if (Math.randInt() > 15) {
          this.boat.weapons.deepCharge[i].load();
        }
        if (this.boat.weapons.deepCharge[i].status == 'ready') {
          this.boat.launchCharge(this.boat.weapons.deepCharge[i]);
          this.boat.weapons.deepCharge[i].status = 'empty';
        }
      }
    },
  };

  window.boot.models.OffensiveAI = ai;
})();