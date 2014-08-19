window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var ai = function(options) {
    this.init(options);
  };
  ai.prototype = {
    init: function(options) {
      this.boat = options.boat;
    },
    tick: function() {
      this.boat.stance = 'attack';
      this.boat.enemyLocated = true;
      this.manageBoat();
    },
    manageBoat: function() {
      if (this.boat.stance === 'attack') {
        this.manageOffensive();
      }
    },
    manageOffensive: function() {
      if (this.boat.enemyLocated) {
        for (var i in this.boat.weapons.cannons) {
          if (Math.randInt() > 15) {
            this.boat.weapons.cannons[i].load();
          }
          if (this.boat.weapons.cannons[i].status == 'ready') {
            console.log('FIRE')
            this.boat.fire(this.boat.weapons.cannons[i]);
          }
        }
      }
    }
  };

  window.boot.models.AI = ai;
})();