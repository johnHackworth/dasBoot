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
    this.x = this.tileWidth / 2 + this.xPosition * this.tileWidth + this.xPosition * 1;
    this.y = this.tileHeight / 2 + this.yPosition * this.tileHeight + this.yPosition * 1;
    this.init();
  };
  sectorTile.prototype = {
    tileWidth: 32,
    tileHeight: 42,
    init: function() {
      this.markers = [];
      this.addWaterBackground();
      // this.addShips();
      // this.addPlayerMarker();
    },
    addWaterBackground: function() {
      this.view = this.stage.addBackground(this.x, this.y, this.tileWidth, this.tileHeight, this.sector.baseColor, 0.3, [], null, this.sector.type == 'sea');
      if (this.sector.type == 'sea') {
        this.view.setInteractive(true);
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
      this.removePathMarker();
      this.pathMarker = new PIXI.Graphics();
      this.pathMarker.beginFill(0xFFFFFF);
      this.pathMarker.drawCircle(this.getCenter().x, this.getCenter().y, Math.floor(this.tileWidth / 8));
      this.pathMarker.endFill();
      this.pathMarker.alpha = 0.5;
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
      this.clearShipMarkers();
      for (var i in this.sector.vehicles) {
        var vehicleMarker = new boot.ui.ShipMarker({
          x: this.getCenter().x,
          y: this.getCenter().y,
          stage: this.stage,
          ship: this.sector.vehicles[i],
          map: this.mapLayout,
          oritinTile: this
        });
        this.markers.push(vehicleMarker);
      }
    },
    addSingleShip: function(ship) {
      var vehicleMarker = new boot.ui.ShipMarker({
        x: this.getCenter().x,
        y: this.getCenter().y,
        stage: this.stage,
        ship: ship,
        map: this.mapLayout,
        oritinTile: this
      });
      this.markers.push(vehicleMarker);
    },
    nextTurn: function() {
      if (this.sector.newShips && this.sector.newShips.length) {
        var ship = this.sector.newShips.shift();
        this.addSingleShip(ship);
      }
      if (this.sector.toBeRemovedShips && this.sector.toBeRemovedShips.length) {
        console.log('AAA')
        var toBeRemovedShip = this.sector.toBeRemovedShips.shift();
        this.removeSingleShip(toBeRemovedShip);
      }
    },
    removeSingleShip: function(ship) {
      for (var i in ship.originTile.markers) {
        debugger;
        if (ship.originTile[i].ship === ship) {
          ship.originTile.removeElement(ship);
          this.markers[i].destroy();
          return;
        }
      }
    },
    clearShipMarkers: function() {
      while (this.markers && this.markers.length) {
        var shipMarker = this.markers.shift();
        shipMarker.destroy();
      }
    }
  };
  window.boot.ui.SectorTile = sectorTile;
})();