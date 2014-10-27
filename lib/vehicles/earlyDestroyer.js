window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var earlyDestroyer = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.EarlyBattleship, true, options);
  };
  earlyDestroyer.prototype = {
    effortPerTurn: 10,
    npc: true,
    maxSpeed: 45,
    baseWidth: 200,
    baseHeight: 45,
    cannonPositions: [{
      x: 130,
      y: 25
    }],
    counter: 0,
    direction: 1,
    type: 'boat',
    assets: {
      side: 'assets/vehicles/earlyDestroyer_1_side.png'
    },
    initWeapons: function() {
      this.weapons = {};
      this.weapons.cannons = [
        new boot.models.Cannon({
          stage: this.stage,
          boat: this,
          position: this.cannonPositions[0]
        })
      ];
    }
  };

  window.boot.models.EarlyDestroyer = earlyDestroyer;
})();