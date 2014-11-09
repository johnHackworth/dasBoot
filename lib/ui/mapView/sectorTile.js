window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var sectorTile = function(options) {
    this.stage = options.stage;
    this.sector = options.sector;
    this.sector.tile = this;
    this.mapLayout = options.mapLayout;
    this.origin = options.origin;
    this.yPosition = options.y;
    this.xPosition = options.x;
    this.tileWidth = options.tileWidth || this.tileWidth;
    this.tileHeight = options.tileHeight || this.tileHeight;
    this.x = this.origin.x + this.tileWidth / 2 + this.xPosition * this.tileWidth + this.xPosition * 1;
    this.y = this.origin.y + this.tileHeight / 2 + this.yPosition * this.tileHeight + this.yPosition * 1;
    this.init();
  };
  sectorTile.prototype = {
    tileWidth: 32,
    tileHeight: 42,
    init: function() {
      this.markers = [];
      this.addWaterBackground();
      if (this.xPosition == 32 && this.yPosition == 8) window.sec = this;
      // console.log('a', this.x, this.y)
    },
    addWaterBackground: function() {
      this.view = this.stage.addSquare(this.x, this.y, this.tileWidth, this.tileHeight, 0x333333, 0.2, [], null, this.sector.type == 'sea');
      if (this.sector.type == 'sea') {
        this.view.interactive = true;
        this.view.click = this.clickOnSector.bind(this);
      }
    },
    clickOnSector: function(event) {
      if (this.sector.type != 'sea') {
        return;
      }
      var hasShift = this.stage.keyManager.isPressed(this.stage.keyManager.SHIFT);
      // if (this.sector.adjacentToPlayer(hasShift)) {

      this.mapLayout.clearPlayerPath();
      this.sector.guidePlayerHere(hasShift);
      this.mapLayout.refreshPlayerPath();
      // }
    },
    getCenter: function() {
      return {
        x: this.x + this.tileWidth / 2,
        y: this.y + this.tileHeight / 2
      };
    },
    addPathMarker: function() {
      // this.removePathMarker();
      // this.pathMarker = new PIXI.Graphics();
      // this.pathMarker.beginFill(0xFFFFFF);
      // this.pathMarker.drawCircle(this.getCenter().x, this.getCenter().y, Math.floor(this.tileWidth / 8));
      // this.pathMarker.endFill();
      // this.pathMarker.alpha = 0.3;
      // this.stage.addViewAfter(this.pathMarker, this.view);
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

    nextTurn: function() {
      if (this.sector.newShips && this.sector.newShips.length) {
        var ship = this.sector.newShips.shift();
        this.mapLayout.addSingleShip(this.sector.x, this.sector.y, ship);
      }
      if (this.sector.toBeRemovedShips) {
        while (this.sector.toBeRemovedShips.length) {
          var toBeRemovedShip = this.sector.toBeRemovedShips.shift();
          this.mapLayout.removeSingleShip(toBeRemovedShip);
        }

      }
    },
  };
  window.boot.ui.SectorTile = sectorTile;
})();