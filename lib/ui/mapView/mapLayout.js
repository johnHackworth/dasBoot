window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var mapLayout = function(options) {
    this.stage = options.stage;
    this.world = options.world;
    this.init();
  };
  mapLayout.prototype = {
    init: function() {
      this.addTiles();
      this.addPlayerMarker();
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
    addPlayerMarker: function() {
      var player = this.world.player;
      var tile = this.tiles[player.sector.x][player.sector.y];
      this.tile = tile;
      this.view = new PIXI.Graphics();
      this.view.beginFill(0xFFFFFF);
      this.view.drawCircle(tile.x + tile.tileWidth / 2, tile.y + tile.tileHeight / 2, Math.floor(tile.tileWidth / 4));
      this.view.endFill();
      this.stage.addEntity(this);
    },
    refreshPlayerPath: function() {
      var player = this.world.player;
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
      this.pathLine.moveTo(playerTile.x + playerTile.tileWidth / 2, playerTile.y + playerTile.tileHeight / 2);
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
    }
  };
  window.boot.ui.MapLayout = mapLayout;
})();