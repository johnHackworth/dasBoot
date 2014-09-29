window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var mapLayout = function(options) {
    this.stage = options.stage;
    this.world = options.world;
    this.player = this.world.player;
    this.init();
  };
  mapLayout.prototype = {
    mapImage: 'assets/map/europe.png',
    init: function() {
      this.markers = [];
      this.addBackground();
      this.addTiles();
      this.addPorts();
      this.addShips();
      this.addPlayerMarker();
      this.addNextTurnButton();
      this.addBoatViewButton();
    },
    addBackground: function() {
      this.backgroundColor = this.stage.addBackground(this.x, this.y, 1320, 640, 0x0077BB, 1, [], null, false);

      this.backgroundMap = new PIXI.Sprite.fromImage(this.mapImage);
      this.backgroundMap.x = 590;
      this.backgroundMap.y = -30;
      this.backgroundMap.height = 670;
      this.backgroundMap.width = 740;
      this.backgroundMap.tint = 0xFFFFFF;
      this.stage.addVisualEntity(this.backgroundMap);
    },
    addTiles: function() {
      this.tiles = [];
      for (var i in this.world.sectors) {
        this.tiles[i] = [];
        for (var j in this.world.sectors[i]) {
          this.tiles[i][j] = new boot.ui.SectorTile({
            sector: this.world.sectors[i][j],
            stage: this.stage,
            x: i,
            y: j,
            mapLayout: this
          });
        }
      }
    },
    addPorts: function() {
      this.portViews = [];
      for (var i in this.world.ports) {
        var portView = new boot.ui.PortView({
          stage: this.stage,
          map: this,
          port: this.world.ports[i]
        });
        this.portViews.push(portView);
      }
    },
    addShips: function() {
      this.clearShipMarkers();
      for (var i in this.tiles) {
        for (var j in this.tiles[i]) {
          this.addSectorShips(i, j);
        }
      }
    },

    addSectorShips: function(x, y) {
      var tile = this.tiles[x][y];
      var sector = this.world.sectors[x][y];
      for(var i = 0, l = sector.vehicles.length; i < l; i++) {
        var vehicleMarker = new boot.ui.ShipMarker({
          x: tile.getCenter().x,
          y: tile.getCenter().y,
          stage: this.stage,
          ship: sector.vehicles[i],
          map: this
        });
        this.markers.push(vehicleMarker);
      }
    },
    clearShipMarkers: function() {
      while (this.markers && this.markers.length) {
        var shipMarker = this.markers.shift();
        shipMarker.destroy();
      }
    },

    addSingleShip: function(x, y, ship) {
      var tile = this.tiles[x][y];
      var sector = this.world.sectors[x][y];
      var vehicleMarker = new boot.ui.ShipMarker({
        x: tile.getCenter().x,
        y: tile.getCenter().y,
        stage: this.stage,
        ship: ship,
        map: this
      });
      this.markers.push(vehicleMarker);
    },
    removeSingleShip: function(ship) {
      for (var i in this.markers) {
        if (this.markers[i].ship === ship) {
          var marker = this.markers[i];
          this.markers.removeElement(marker);
          marker.destroy();
          return;
        }
      }
    },


    addPlayerMarker: function() {
      var player = this.world.player;
      var tile = this.tiles[player.sector.x][player.sector.y];
      this.tile = tile;
      this.view = new PIXI.Graphics();
      this.view.beginFill(0xFFFFFF);
      this.view.drawCircle(0, 0, Math.floor(tile.tileWidth / 4));
      this.view.x = tile.getCenter().x;
      this.view.y = tile.getCenter().y;
      this.view.endFill();
      this.stage.addEntity(this);
    },
    refreshPlayerPath: function() {
      var player = this.world.player;
      this.clearPlayerPath();
      for (var i in player.path) {
        var sector = player.path[i];
        this.tiles[sector.x][sector.y].addPathMarker();
      }
      this.addPathLine();
    },
    addPathLine: function() {
      var player = this.world.player;
      var playerTile = this.tiles[player.sector.x][player.sector.y];
      this.pathLine = new PIXI.Graphics();
      this.pathLine.clear();
      this.pathLine.lineStyle(3, 0xFFFFCC);
      this.pathLine.moveTo(this.view.x, this.view.y);
      if (this.player.destination) {
        var destinationTile = this.tiles[this.player.destination.x][this.player.destination.y];
        this.pathLine.lineTo(destinationTile.x + destinationTile.tileWidth / 2, destinationTile.y + destinationTile.tileHeight / 2);
      }
      for (var i in player.path) {
        var sector = player.path[i];
        var tile = this.tiles[sector.x][sector.y];
        this.pathLine.lineTo(tile.x + tile.tileWidth / 2, tile.y + tile.tileHeight / 2);
      }
      this.pathLine.endFill();
      this.pathLine.alpha = 0.5;
      this.stage.addViewAfter(this.pathLine, this.view);
    },
    removePathLine: function() {
      if (this.pathLine) {
        this.stage.removeView(this.pathLine);
        this.pathLine = null;
      }
    },
    clearPlayerPath: function() {
      var player = this.world.player;
      for (var i in player.path) {
        var sector = player.path[i];
        this.tiles[sector.x][sector.y].removePathMarker();
      }
      this.removePathLine();
    },
    addNextTurnButton: function() {
      this.nextTurnButton = new boot.ui.NextTurnButton({
        stage: this.stage,
        x: boot.config.width - 150,
        y: 0,
        world: this.world,
        map: this
      });
    },
    addBoatViewButton: function() {
      this.boatViewButton = new boot.ui.BoatViewButton({
        stage: this.stage,
        x: boot.config.width - 300,
        y: 0,
        world: this.world
      });
    },
    tick: function(counter) {
      if (counter % 20 === 0) {
        if (counter % 60 === 0) {
          this.view.tint = 0xFFCC99;
        } else if (counter % 40 === 0) {
          this.view.tint = 0xFFDDBB;
        } else {
          this.view.tint = 0xFFFFFF;
        }
      }

      if (counter % 5 === 0 && this.player.destination) {
        this.movePlayer();
      }
    },
    movePlayer: function() {
      var tile = this.tiles[this.player.destination.x][this.player.destination.y];
      var center = tile.getCenter();
      if (this.view.x != center.x) {
        this.view.x = Math.aproximate(this.view.x, center.x, 5);
      }
      if (this.view.y != center.y) {
        this.view.y = Math.aproximate(this.view.y, center.y, 5);
      }
      if (this.view.x == center.x && this.view.y == center.y) {
        tile.removePathMarker();
        this.player.sector = this.player.destination;
        this.player.destination = null;
      }
      this.refreshPlayerPath();

    },
    nextTurn: function() {
      for (var i in this.tiles) {
        for (var j in this.tiles[i]) {
          this.tiles[i][j].nextTurn();
        }
      }
    }
  };
  window.boot.ui.MapLayout = mapLayout;
})();
