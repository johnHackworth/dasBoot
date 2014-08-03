window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var hudLayout = function(options) {
    this.stage = options.stage;
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
      this.stage.addImage(
        this.stage.playerBoat.assets.layout, {
          x: 10,
          y: 300,
          scale: 1,
          centered: false
        });
    },
    addSeaView: function() {
      this.seaView = new window.boot.ui.SeaView({
        sector: this.stage.sector,
        stage: this.stage
      });
    }
  };
  window.boot.ui.HudLayout = hudLayout;
})();