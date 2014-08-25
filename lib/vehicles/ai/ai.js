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
    tick: function(counter, active) {
      if (!active) return;
      this.searchEnemy();
      this.boat.stance = 'attack';
      this.manageBoat();
    },
    searchEnemy: function() {

    },
    manageBoat: function() {
      if (this.boat.stance === 'attack') {
        this.manageOffensive();
      }
    },
    manageOffensive: function() {
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
    }
  };

  window.boot.models.AI = ai;
})();