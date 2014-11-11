window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var boat = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.EarlyBattleship, true, options);
  };
  boat.prototype = {
    effortPerTurn: 10,
    npc: true,
    AIstance: 'civilian',
    maxSpeed: 40,
    baseWidth: 30,
    baseHeight: 10,
    trailDefaultSize: 0.3,
    counter: 0,
    direction: 1,
    type: 'boat',
    assets: {
      side: 'assets/vehicles/lifeboat.png'
    },
    initWeapons: function() {
      this.weapons = {};
      this.weapons.cannons = [];
    }
  };

  window.boot.models.LifeBoat = boat;
})();