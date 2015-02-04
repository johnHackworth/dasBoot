window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var merchant2 = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.EarlyBattleship, true, options);
  };
  merchant2.prototype = {
    effortPerTurn: 10,
    influence: 2,
    reputation: 2,
    npc: true,
    maxSpeed: 80,
    baseWidth: 160,
    baseHeight: 32,
    counter: 0,
    direction: 1,
    type: 'boat',
    assets: {
      side: 'assets/vehicles/merchant_2_side.png'
    },
    initWeapons: function() {
      this.weapons = {};
      this.weapons.cannons = [];
    }
  };

  window.boot.models.Merchant2 = merchant2;
})();