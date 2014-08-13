window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var weaponsLayout = function(options) {
    this.stage = options.stage;
    this.weapons = world.playerBoat.weapons;
    this.init();
  };
  weaponsLayout.prototype = {
    init: function() {
      this.initTorpedoTubes();
    },
    initTorpedoTubes: function() {
      this.torpedoTubeViews = [];
      var n = 0;
      for (var i in this.weapons.torpedoes.tubes) {
        this.createTorpedoHud(this.weapons.torpedoes.tubes[n], n);
        n++;
      }
    },
    createTorpedoHud: function(tube, n) {
      var tubeView = new window.boot.ui.TorpedoButton({
        stage: this.stage,
        x: 50 + 110 * n,
        y: 210,
        tube: tube,
        n: n
      });
    }
  };
  window.boot.ui.WeaponsLayout = weaponsLayout;
})();