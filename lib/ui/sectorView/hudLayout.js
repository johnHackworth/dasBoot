window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var hudLayout = function(options) {
    this.options = options || {};
    this.stage = options.stage;
    this.world = this.stage.world;
    this.sector = options.sector;
    this.init();
  };
  hudLayout.prototype = {
    init: function() {
      this.addTitle();
      this.addPlayerBoat();
      this.addSeaView();
    },
    addTitle: function() {
      this.stage.addText('Sector View', {
        x: 10,
        y: 10,
        fontSize: '40px',
        color: '#FFFFFF'
      });
    },
    addPlayerBoat: function() {
      this.playerView = new window.boot.ui.SubmarineView({
        stage: this.stage,
        sector: this.sector,
        world: this.world,
        assault: this.options.assault
      });
    },
    addSeaView: function() {
      this.seaView = new window.boot.ui.SeaView({
        sector: this.sector,
        stage: this.stage,
        world: this.world,
        submarineView: this.playerView
      });
      this.playerView.sea = this.seaView;
    },
  };
  window.boot.ui.HudLayout = hudLayout;
})();