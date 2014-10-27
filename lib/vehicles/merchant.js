window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var merchant = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.EarlyBattleship, true, options);
  };
  merchant.prototype = {
    effortPerTurn: 10,
    npc: true,
    maxSpeed: 30,
    baseWidth: 160,
    baseHeight: 35,
    cannonPositions: [{
      x: 200,
      y: 80
    }],
    counter: 0,
    direction: 1,
    type: 'boat',
    assets: {
      side: 'assets/vehicles/merchant_1_side.png'
    },
    initWeapons: function() {
      this.weapons = {};
      this.weapons.cannons = [];
    }
  };

  window.boot.models.Merchant = merchant;
})();