window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var shipMarker = function(options) {
    this.stage = options.stage;
    this.ship = options.ship;
    this.world = this.ship.world;
    this.y = options.y;
    this.x = options.x;
    this.map = options.map;
    this.init();
  };
  shipMarker.prototype = {
    markerWidth: 10,
    markerHeight: 5,
    init: function() {
      this.addMarker();
    },
    addMarker: function() {
      this.marker = new PIXI.Graphics();
      this.marker.beginFill(0x990000);
      this.marker.moveTo(0, 0);
      this.marker.lineTo(this.markerWidth / 2, 0);
      this.marker.lineTo(0, this.markerHeight);
      this.marker.lineTo(0 - this.markerWidth / 2, 0);
      this.marker.lineTo(0, 0);
      this.marker.endFill();
      this.marker.x = this.x;
      this.marker.y = this.y;
      this.stage.addVisualEntity(this.marker);
      this.marker.visible = false;
      this.marker.alpha = 0;
      this.stage.addNotVisualEntity(this);
    },
    moveMarker: function() {
      var tile = this.map.tiles[this.ship.destination.x][this.ship.destination.y];
      var center = tile.getCenter();
      if (this.marker.x != center.x) {
        this.marker.x = Math.aproximate(this.marker.x, center.x, 5);
      }
      if (this.marker.y != center.y) {
        this.marker.y = Math.aproximate(this.marker.y, center.y, 5);
      }
      if (this.marker.x == center.x && this.marker.y == center.y) {
        tile.removePathMarker();

        this.ship.sector.removeVehicle(this.ship);
        this.ship.destination.addVehicle(this.ship);
        this.ship.destination = null;
      }
    },
    tick: function(counter) {
      if (counter % 5 === 0) {
        if (this.ship.destination) {
          this.moveMarker();
        }
        if (this.world.time.turn - this.ship.lastKnowPosition > 1) {
          this.fadeOut();
        } else {
          this.fadeIn();
        }
      }
    },
    fadeOut: function() {
      this.marker.alpha = Math.aproximate(this.marker.alpha, 0, 0.05);
      if (this.marker.alpha === 0) {
        this.marker.visible = false;
      }
    },
    fadeIn: function() {
      this.marker.visible = true;
      this.marker.alpha = Math.aproximate(this.marker.alpha, 1, 0.05);
    }
  };
  window.boot.ui.ShipMarker = shipMarker;
})();