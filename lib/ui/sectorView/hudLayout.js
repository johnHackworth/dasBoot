window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var hudLayout = function(options) {
    this.stage = options.stage;
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
        stage: this.stage
      });
    },
    addSeaView: function() {
      this.seaView = new window.boot.ui.SeaView({
        sector: this.sector,
        stage: this.stage,
        submarineView: this.playerView
      });
    },
  };
  window.boot.ui.HudLayout = hudLayout;
})();