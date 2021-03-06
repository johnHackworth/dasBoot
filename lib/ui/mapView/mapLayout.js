window.boot.ui = window.boot.ui || {};

(function() {
  var mapLayout = function(options) {
    this.stage = options.stage;
    this.world = options.world;
    this.player = this.world.player;
    this.init();
  };
  mapLayout.prototype = {
    // mapImage: 'assets/map/europe.png',
    mapBackground: 'assets/map/mapBackground.png',
    canChangeTurn: true,
    hasShownBoardMessage: false,
    init: function() {
      window.map = this;
      this.markers = [];
      this.notificationDispatcher = new boot.models.NotificationDispatcher({
        world: this.world,
        stage: this.stage
      });
      this.addBackground();
      this.addTiles();
      this.addPorts();
      this.addShips();
      this.addPlayerMarker();
      this.addNextTurnButton();
      this.addBoatViewButton();
      this.addCrewViewButton();
      this.addWorldViewButton();
      this.world.weather.assignWeatherToSectors();
      // this.addWeatherIndicator();
      this.addCalendar();
      this.addCaptainLog();
      this.turnMovementEnd();
      this.bindKeys();
      // this.nextTurn();
    },
    initMessage: function() {
      this.notificationDispatcher.showFirstMessage();
    },
    bindKeys: function() {
      this.stage.keyManager.clear();
      this.stage.keyManager.whenPress(this.stage.keyManager.SPACE, this.nextTurn.bind(this));
    },
    addBackground: function() {
      var width = boot.config.width;
      var height = boot.config.height;
      this.backgroundTable = this.stage.addBackground(0, 0, width, height, 0x93827F, 1, [], null, false);

      this.backgroundColor = new PIXI.Sprite.fromImage(this.mapBackground);
      this.backgroundColor.x = 0;
      this.backgroundColor.y = 0;
      this.backgroundColor.width = width - 00;
      this.backgroundColor.height = height - 00;
      // this.stage.addBackground(50, 50, width - 100, height - 200, 0x006099, 1, [], null, false);
      this.stage.addVisualEntity(this.backgroundColor);

      // this.backgroundMap = new PIXI.Sprite.fromImage(this.mapImage);
      // this.backgroundMap.x = Math.floor((width - 100) / 2);
      // this.backgroundMap.y = 65;
      // this.backgroundMap.height = (height - 200) / 1.065;
      // this.backgroundMap.width = (width - 100) / 1.92;
      // this.backgroundMap.tint = 0xDDBB88;
      // this.stage.addVisualEntity(this.backgroundMap);
    },
    getSectorsMapSize: function() {
      var width = boot.config.width;
      var height = boot.config.height;
      var mapWidth = this.world.sectors.length;
      var mapHeigth = this.world.sectors[0].length;
      var tileHeight = (height - 220) / mapHeigth - 2;
      var tileWidth = (width - 10) / mapWidth - 2;
      return {
        size: {
          y: Math.floor((tileHeight + 2) * mapHeigth),
          x: Math.floor((tileWidth + 2) * mapWidth),
        },
        pos: {
          y: 150,
          x: 5
        }
      };
    },
    addTiles: function() {
      this.tiles = [];
      var width = boot.config.width;
      var height = boot.config.height;
      var mapWidth = this.world.sectors.length;
      var mapHeigth = this.world.sectors[0].length;
      var tileHeight = (height - 220) / mapHeigth - 2;
      var tileWidth = (width - 10) / mapWidth - 2;
      for (var i in this.world.sectors) {
        this.tiles[i] = [];
        for (var j in this.world.sectors[i]) {
          this.tiles[i][j] = new boot.ui.SectorTile({
            sector: this.world.sectors[i][j],
            stage: this.stage,
            tileWidth: 20.5,
            tileHeight: 23,
            origin: {
              x: 8,
              y:130,
            },
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
      for (var i = 0, l = sector.vehicles.length; i < l; i++) {
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
      this.addPathLine();
    },
    addPathLine: function() {
      var player = this.world.player;
      var playerTile = this.tiles[player.sector.x][player.sector.y];
      this.pathLine = new PIXI.Graphics();
      this.pathLine.beginFill(0x993333);

      var origin = [player.sector]
      if(player.destination) {
        origin = [];
      }

      var path = origin.concat(player.path);

      var tile = null;
      for (var i = 0, l = path.length; i < l; i++) {
        var sector = path[i];
        if(player.destination) 
        var nSector = path[i + 1];
        tile = this.tiles[sector.x][sector.y];
        var dots = this.getDotsPosition(path, i);
        // this.pathLine.drawCircle(tile.x + tile.tileWidth / 2, tile.y + 2 + tile.tileHeight / 2, 4);
        if (i>= 0 && dots[0]) {
          this.pathLine.drawCircle(dots[0][0], dots[0][1], 2);
        }
        if (i> 0 && dots[1]) {
          this.pathLine.drawCircle(dots[1][0], dots[1][1], 2);
        } else {
          if(i>0) {
            this.pathLine.drawCircle(tile.x + tile.tileWidth / 2, tile.y + 2 + tile.tileHeight / 2, 2);
          }
        }
        if (dots[2]) {
          this.pathLine.drawCircle(dots[2][0], dots[2][1], 2);
        }
      }

      this.pathLine.endFill();
      this.pathLine.alpha = 0.5;
      this.stage.addViewAfter(this.pathLine, this.view);
    },
    getDotsPosition: function(path, i) {
      var tile = this.tiles[path[i].x][path[i].y];
      var nextTile = path[i + 1] ? this.tiles[path[i + 1].x][path[i + 1].y] : null;
      var prevTile = path[i - 1] ? this.tiles[path[i - 1].x][path[i - 1].y] : null;
      var nextMatrix = this.getTileMatrix(tile, prevTile);
      var prevMatrix = this.getTileMatrix(tile, nextTile);
      var centralMatrix = this.getCentralTileMatrix(tile, prevTile, nextTile);
      var prevPos = this.getTilePosition(tile, prevMatrix);
      var centralPos = this.getTilePosition(tile, centralMatrix);
      var nextPos = this.getTilePosition(tile, nextMatrix);
      return [prevPos, centralPos, nextPos];
    },
    getTilePosition: function(tile, matrix) {
      if (!tile || !matrix) {
        return null;
      }
      var x = tile.x + tile.tileWidth / 2 + matrix[0] * tile.tileWidth / 2 - matrix[0] * 4;
      var y = tile.y + 2 + tile.tileHeight / 2 + matrix[1] * tile.tileHeight / 2 - matrix[1] * 6;
      return [x, y];
    },
    getTileMatrix: function(originTile, nextTile) {
      if (!nextTile || !originTile) {
        return null;
      }
      var x = 0;
      var y = 0;
      if (originTile.x > nextTile.x) x = -1;
      if (originTile.x < nextTile.x) x = 1;
      if (originTile.y > nextTile.y) y = -1;
      if (originTile.y < nextTile.y) y = 1;
      return [x, y];
    },
    getCentralTileMatrix: function(tile, prevTile, nextTile) {
      if (!nextTile || !prevTile) {
        return null;
      }
      var x = 0;
      var y = 0;
      if (tile.x != prevTile.x && prevTile.x === nextTile.x) {
        if (tile.x > nextTile.x) x = -1;
        if (tile.x < nextTile.x) x = 1;
      }
      if (tile.y != prevTile.y && prevTile.y === nextTile.y) {
        if (tile.y > nextTile.y) y = -1;
        if (tile.y < nextTile.y) y = 1;
      }
      return [x, y];
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
        x: boot.config.width - 140,
        y: 15,
        world: this.world,
        map: this
      });
    },
    addBoatViewButton: function() {
      this.boatViewButton = new boot.ui.BoatViewButton({
        stage: this.stage,
        x: boot.config.width - 280,
        y: 15,
        world: this.world
      });
    },
    addCrewViewButton: function() {
      this.crewViewButton = new boot.ui.CrewViewButton({
        stage: this.stage,
        x: boot.config.width - 420,
        y: 15,
        world: this.world
      });
    },
    addWorldViewButton: function() {
      this.worldViewButton = new boot.ui.WorldViewButton({
        stage: this.stage,
        x: boot.config.width - 560,
        y: 15,
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
      if (counter % 5 === 0) {
        if (this.world.movingPlayers) {
          this.nextTurnButton.makeNotClickable();
          this.world.movingPlayers--;
          if (!this.world.movingPlayers) {
            this.turnMovementEnd();
          }

        }
      }
    },
    turnMovementEnd: function() {
      this.canChangeTurn = true;
      this.nextTurnButton.makeClickable();
      // this.weatherIndicator.paintSectorWeather(this.world.player.sector);
      this.calendar.paintDate();
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
      if (!this.canChangeTurn) {
        return;
      }

      this.canChangeTurn = false;
      this.world.nextTurn();
      for (var i in this.tiles) {
        for (var j in this.tiles[i]) {
          this.tiles[i][j].nextTurn();
        }
      }
      this.captainLog.newPage();
      this.notificationDispatcher.nextTurn();
    },

    addWeatherIndicator: function() {
      this.weatherIndicator = new boot.ui.WeatherIndicator({
        stage: this.stage,
        x: 250,
        y: 5,
        world: this.world
      });
    },
    addCalendar: function() {
      this.calendar = new boot.ui.Calendar({
        stage: this.stage,
        x: 50,
        y: 5,
        world: this.world
      });
      this.calendar.paintDate();
    },
    addCaptainLog: function() {
      this.captainLog = new boot.ui.CaptainLog({
        stage: this.stage,
        x: 250,
        y: 15,
        world: this.world
      });
      this.captainLog.addText();
    }
  };
  window.boot.ui.MapLayout = mapLayout;
})();