window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var thirtiesDestroyer = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.EarlyDestroyer, true, options);
  };
  thirtiesDestroyer.prototype = {
    maxSpeed: 50,
    baseWidth: 200,
    baseHeight: 45,
    cannonPositions: [{
      x: 120,
      y: 30
    }],
    deepChargePositions: [{
      x: 10,
      y: 30
    }],
    assets: {
      side: 'assets/vehicles/1930Destroyer_1_side.png'
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
      this.weapons.deepCharge = [
        new boot.models.DeepChargeLauncher({
          stage: this.stage,
          boat: this,
          position: this.deepChargePositions[0]
        })
      ];
    }
  };

  window.boot.models.ThirtiesDestroyer = thirtiesDestroyer;
})();