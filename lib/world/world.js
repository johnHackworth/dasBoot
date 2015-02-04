window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var world = function(options) {
    this.worldMap = boot.worldMap;
    this.init();
  };
  world.prototype = {
    assets: [],
    sectors: [],
    nations: [],
    vehicles: [],
    tileWidth: 40,
    tileHeight: 15,
    init: function() {
      this.createTime();
      this.createNations();
      this.createDiplomacy();
      this.createSearcher();
      this.createCommerce();
      this.createWeather();
    },
    postInit: function() {
      this.createHistory();
    },
    createCommerce: function() {
      this.commerce = new boot.models.ComerceWind({
        world: this,
        stage: this.stage
      });
      this.commerce.nextTurn();
    },
    createSearcher: function() {
      this.pathFinder = new Graph(this.getBinaryWorldMap(), {
        diagonal: true
      });
    },
    createTime: function() {
      this.time = new boot.models.TimeController({
        world: this
      });
      this.time.nextTurn();
    },
    createWeather: function() {
      this.weather = new boot.models.WeatherController({
        world: this
      });
      this.weather.nextTurn();
    },
    addVehicleToSector: function(vehicle, x, y) {
      if (vehicle.currentSector) {
        vehicle.currentSector.remove(vehicle);
      }
      this.sectors[x][y].addVehicle(vehicle);
    },
    createPorts: function(ports) {
      this.ports = [];
      for (var i in ports) {
        var country = this.nations.lookFor('name', ports[i].country);
        var port = new boot.models.Port({
          sector: this.sectors[ports[i].x][ports[i].y],
          model: ports[i],
          country: country
        });
        this.ports.push(port);
      }
    },
    getWorldFromArray: function(arrayWorld) {
      var translator = {
        "w": boot.models.DeepSeaSector,
        "p": boot.models.PortSector,
        "l": boot.models.LandSector
      };
      var maxX = 54; // 39;
      var maxY = 23; // 14;
      for (var i = 0; i < maxX; i++) {
        this.sectors[i] = [];
        for (var j = 0; j < maxY; j++) {
          var type = 'w';
          if (arrayWorld[i] && arrayWorld[i][j]) {
            type = arrayWorld[i][j];
          }
          this.sectors[i][j] = new translator[type]({
            x: i,
            y: j,
            world: this
          });
        }
      }
    },
    getRandomShip: function(country) {
      var boatTypes = window.boot.vehicleSheets;
      var boatType = boatTypes[Math.randInt(boatTypes.length)];
      var boat = new boot.dataModels.Boat({
        type: boatType.type,
        speed: boatType.speed,
        isWarVehicle: boatType.isWarVehicle,
        world: this,
        country: country
      });
      return boat;
    },
    getRandomCountry: function() {
      return this.nations[Math.randInt(this.nations.length)];
    },
    createNations: function() {
      for (var i in window.boot.data.nations) {
        var nation = new window.boot.models.Nation(window.boot.data.nations[i]);
        this.nations.push(nation);
      }
      for (var j in this.nations) {
        for (var k in window.boot.data.nations[this.nations[j].name].allies) {
          var ally = this.nations.lookFor("name", window.boot.data.nations[this.nations[j].name].allies[k]);
          this.nations[j].allies.push(ally);
        }
        for (k in window.boot.data.nations[this.nations[j].name].enemies) {
          var enemy = this.nations.lookFor("name", window.boot.data.nations[this.nations[j].name].allies[k]);
          this.nations[j].enemies.push(enemy);
        }
      }
    },
    createDiplomacy: function() {
      this.diplomacy = new window.boot.models.Diplomacy({
        world: this
      });
      this.diplomacy.initRelations();
    },
    nextTurn: function() {
      this.time.nextTurn();
      this.commerce.nextTurn();
      this.weather.nextTurn();
      this.history.nextTurn();
    },
    getBinaryWorldMap: function() {
      var map = this.worldMap;
      var binary = [];
      for (var i in map) {
        binary[i] = [];
        for (var j in map[i]) {
          if (map[i][j] === 'w') {
            binary[i][j] = 1;
          } else if (map[i][j] === 'p') {
            binary[i][j] = 5;
          } else {
            binary[i][j] = 0;
          }
        }
      }
      return binary;
    },
    getPath: function(start, end) {
      start = this.pathFinder.grid[start[0]][start[1]];
      end = this.pathFinder.grid[end[0]][end[1]];
      var path = astar.search(this.pathFinder, start, end);
      return path.map(function(n, e) {
        return {
          x: n.x,
          y: n.y
        };
      });
    },
    getPathAsSectors: function(startSector, endSector) {
      var self = this;
      var path = this.getPath([startSector.x, startSector.y], [endSector.x, endSector.y]);
      return path.map(function(n, e) {
        return self.sectors[n.x][n.y];
      });
    },
    selectRandomPort: function() {
      return this.ports.getRandom();
    },
    selectInteroceanicPoint: function() {
      var n = Math.randInt(30);
      var destination = {};
      if (n <= 13) {
        destination.sector = this.sectors[0][n];
      } else {
        destination.sector = this.sectors[n - 13][13];
      }
      destination.originShips = [];
      destination.destinationShips = [];
      return destination;
    },
    checkPlayerEncounters: function() {
      var player = this.player;
      for (var i in player.sector.vehicles) {
        var boat = player.sector.vehicles[i];
        if (
          this.isWarBoat(boat) &&
          this.isBoatAnEnemy(boat) &&
          Math.randInt() < player.sector.weather.visibility * 100) {
          return true;
        }
      }
      return false;
    },
    checkEnemyBoatsAround: function() {
      var player = this.player;
      for (var i in player.sector.vehicles) {
        var boat = player.sector.vehicles[i];
        if (this.isBoatAnEnemy(boat)) {
          return true;
        }
      }
      return false;
    },
    evaluateEncounter: function(boat) {
      return Math.randInt() > 50;
    },
    isBoatAnEnemy: function(boat) {
      if (
        this.diplomacy.getRelation(boat.country, this.player.country) < 20
      ) {
        return true;
      }
      return false;
    },
    isWarBoat: function(boat) {
      return boat.isWarVehicle;
    },
    createHistory: function() {
      this.history = new boot.models.History({
        world: this,
        boat: this.player
      });
      this.history.nextTurn();
      this.history.welcomeMessage();
    },
    isSectorCoastal: function(sector) {
      for (var i = sector.x - 1; i <= sector.x + 1; i++) {
        for (var j = sector.y - 1; j <= sector.y + 1; j++) {
          if (this.worldMap[i][j] != 'w') {
            return true;
          }
        }
      }
      return false;
    },
    notifyThePositionOfShips: function(percentage) {
      for (var i in this.sectors) {
        for (var j in this.sectors[i]) {
          var sector = this.sectors[i][j];
          for (var x in sector.vehicles) {
            if (Math.randInt() < percentage) {
              sector.vehicles[x].lastKnowPosition = this.time.turn + 1;
            }
          }
        }
      }
    },
    notifyThePositionOfNearbyShips: function(percentage) {
      for (var i in this.sectors) {
        for (var j in this.sectors[i]) {
          var sector = this.sectors[i][j];
          for (var x in sector.vehicles) {
            if (
              (Math.abs(this.player.sector.x - i) < 5) &&
              (Math.abs(this.player.sector.y - j) < 5) &&
              Math.randInt() < percentage
            ) {
              sector.vehicles[x].lastKnowPosition = this.time.turn + 1;
            }
          }
        }
      }
    },
    getSkyColor: function(color) {
      var colors = {
        "0": "#000011",
        "6": "#997777",
        "12": "#77AAFF",
        "18": "#6666AA"
      };

      var hour = this.time.getTime();
      var scale = chroma.scale(['#' + color.toString(16), colors["" + hour]]);
      color = scale(0.2).hex();
      color = color.replace('#', '0x');
      color = Number.parseInt(color);
      return color;
    },
    isInEnemyTerritory: function(boat) {
      var sector = boat.sector;
      for (var i in this.ports) {
        var port = this.ports[i];
        if (this.diplomacy.isEnemy(port.country, boat.country) &&
          port.sector.isSectorAdjacent(boat.sector, 3)) {
          return true;
        }
      }
      return false;
    }
  };

  window.boot.models.World = world;
})();