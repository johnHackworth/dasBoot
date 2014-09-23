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
    init: function() {
      this.addTiles();
      this.addShips();
      this.addPlayerMarker();
      this.addNextTurnButton();
      this.addBoatViewButton();
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
    addShips: function() {
      for (var i in this.tiles) {
        for (var j in this.tiles[i]) {
          this.tiles[i][j].addShips();
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
      this.pathLine.lineStyle(5, 0xFFFFFF);
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
      this.pathLine.alpha = 0.8;
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
        world: this.world
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

    }
  };
  window.boot.ui.MapLayout = mapLayout;
})();