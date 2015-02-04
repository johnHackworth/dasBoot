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
    this.originTile = options.originTile;
    this.init();
  };
  shipMarker.prototype = {
    views: {
      "EarlyBattleship": "assets/vehicles/earlBattleship_1_icon.png",
      "EarlyDestroyer": "assets/vehicles/earlyDestroyer_1_icon.png",
      "ThirtiesDestroyer": "assets/vehicles/earlyDestroyer_1_icon.png",
      "Merchant": "assets/vehicles/merchant_1_icon.png",
      "Merchant2": "assets/vehicles/merchant_1_icon.png",
    },
    markerWidth: 10,
    markerHeight: 5,
    init: function() {
      this.addMarker();
    },
    addMarker: function() {
      var view = this.views[this.ship.type];
      this.marker = new PIXI.Sprite.fromImage(view);
      this.marker.x = this.x;
      this.marker.y = this.y;
      this.marker.width = 20;
      this.marker.height = 15;
      this.marker.tint = this.ship.country.color;
      this.stage.addVisualEntity(this.marker);
      this.marker.visible = false;
      this.marker.alpha = 0;
      this.marker.interactive = true;
      this.marker.mouseover = this.showData.bind(this);
      this.marker.mouseout = this.hideData.bind(this);
      this.stage.addNotVisualEntity(this);
      this.addData();

    },
    destroy: function() {
      this.stage.removeView(this.marker);
      this.stage.removeEntity(this);
      this.ship.destroy();
    },
    showData: function() {
      this.name.visible = true;
      this.country.visible = true;
    },
    hideData: function() {
      this.name.visible = false;
      this.country.visible = false;
    },
    addData: function() {
      this.name = this.stage.addText(this.ship.type, {
        fontSize: '8px',
        color: '#333333'
      }, this.destroyables);

      this.name.x = this.marker.x + Math.floor(this.marker.width / 2) - this.name.width / 2;
      this.name.y = this.marker.y + 20;
      this.name.visible = false;
      this.country = new PIXI.Sprite.fromImage(this.ship.country.flag);
      this.country.width = 20;
      this.country.height = 14;
      this.country.x = this.marker.x + Math.floor(this.marker.width / 2) - this.country.width / 2;
      this.country.y = this.marker.y + 30;
      this.country.visible = false;
      this.stage.addVisualEntity(this.country);
    },
    moveMarker: function() {
      var tile = this.map.tiles[this.ship.destination.x][this.ship.destination.y];
      var center = tile.getCenter();
      if (this.marker.x != center.x) {
        this.marker.x = Math.aproximate(this.marker.x, center.x - Math.floor(this.marker.width / 2), 5);
      }
      if (this.marker.y != center.y) {
        this.marker.y = Math.aproximate(this.marker.y, center.y, 5);
      }
      if (this.marker.x == center.x - Math.floor(this.marker.width / 2) && this.marker.y == center.y) {
        tile.removePathMarker();
        this.ship.destination = null;
      }
      this.name.x = this.marker.x + Math.floor(this.marker.width / 2) - this.name.width / 2;
      this.name.y = this.marker.y + 20;
      this.country.x = this.marker.x + Math.floor(this.marker.width / 2) - this.country.width / 2;
      this.country.y = this.marker.y + 30;
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