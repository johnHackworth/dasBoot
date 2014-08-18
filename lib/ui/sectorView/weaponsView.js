window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var weaponsLayout = function(options) {
    this.stage = options.stage;
    this.weapons = world.playerBoat.weapons;
    this.sea = options.sea;
    this.init();
  };
  weaponsLayout.prototype = {
    init: function() {
      this.initTorpedoTubes();
    },
    getWidth: function() {
      var width = 0;
      for (var i in this.torpedoTubeViews) {
        width += 110 + 50;
      }
      return width;
    },
    selectBoat: function() {
      for (var i in this.torpedoTubeViews) {
        this.torpedoTubeViews[i].setReadyToFire(true);
      }
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
        sea: this.sea,
        tube: tube,
        n: n
      });
      this.torpedoTubeViews.push(tubeView);
      tubeView.on('fire', this.sea.createTorpedo.bind(this.sea));
    }
  };
  window.boot.ui.WeaponsLayout = weaponsLayout;
})();