window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var sectorTile = function(options) {
    this.stage = options.stage;
    this.sector = options.sector;
    this.sector.tile = this;
    this.mapLayout = options.mapLayout;
    this.yPosition = options.y;
    this.xPosition = options.x;
    this.x = this.xPosition * this.tileWidth + this.xPosition * 1;
    this.y = this.yPosition * this.tileHeight + this.yPosition * 1;
    this.init();
  };
  sectorTile.prototype = {
    tileWidth: 32,
    tileHeight: 42,
    init: function() {
      this.addWaterBackground();
      this.addShips();
      // this.addPlayerMarker();
    },
    addWaterBackground: function() {

      this.view = this.stage.addBackground(this.x, this.y, this.tileWidth, this.tileHeight, 0x77AAFF, 1, [], null, true);
      this.view.setInteractive(true);
      this.view.click = this.clickOnSector.bind(this);
    },
    clickOnSector: function(event) {
      var hasShift = this.stage.keyManager.isPressed(this.stage.keyManager.SHIFT);
      if (this.sector.adjacentToPlayer(hasShift)) {
        this.mapLayout.clearPlayerPath();
        this.sector.guidePlayerHere(hasShift);
        this.mapLayout.refreshPlayerPath();
      }
    },
    addPathMarker: function() {
      this.removePathMarker();
      var tile = this;
      this.pathMarker = new PIXI.Graphics();
      this.pathMarker.beginFill(0xFFFFFF);
      this.pathMarker.drawCircle(tile.x + tile.tileWidth / 2, tile.y + tile.tileHeight / 2, Math.floor(tile.tileWidth / 8));
      this.pathMarker.endFill();
      this.stage.addViewAfter(this.pathMarker, this.view);
    },
    removePathMarker: function() {
      if (this.pathMarker) {
        this.stage.removeView(this.pathMarker);
        this.pathMarker = null;
      }
    },
    addToPath: function() {
      this.inPath = true;
      this.addPathMarker();
    },

    addShips: function() {
      this.markers = [];
      for (var i in this.sector.vehicles) {
        var vehicleMarker = new boot.ui.ShipMarker({
          x: this.x + Math.floor(this.tileWidth / 4) + Math.randInt(this.tileWidth / 2),
          y: this.y + Math.floor(this.tileHeight / 4) + Math.randInt(this.tileHeight / 2),
          stage: this.stage,
          ship: this.sector.vehicles[i]
        });
        this.markers.push(vehicleMarker);
      }
    }
  };
  window.boot.ui.SectorTile = sectorTile;
})();