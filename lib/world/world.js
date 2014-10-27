window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var world = function(options) {
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
      this.createSearcher();
      this.createCommerce();
      this.createWeather();
    },
    createCommerce: function() {
      this.commerce = new boot.models.ComerceWind({
        world: this,
        stage: this.stage
      });
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
        "p": boot.models.DeepSeaSector,
        "l": boot.models.LandSector
      };
      for (var i = 0; i < arrayWorld.length; i++) {
        this.sectors[i] = [];
        for (var j = 0; j < arrayWorld[i].length; j++) {
          this.sectors[i][j] = new translator[arrayWorld[i][j]]({
            x: i,
            y: j,
            world: this
          });
        }
      }
    },
    getRandomShips: function() {
      var boatTypes = [{
        type: 'EarlyBattleship',
        speed: 0.6
      }, {
        speed: 0.5,
        type: 'EarlyDestroyer'
      }];
      for (var i = 0; i < this.sectors.length; i++) {
        for (var j = 0; j < this.sectors[i].length; j++) {
          if (Math.randInt() > 90 && this.sectors[i][j].type === 'sea') {
            var boatType = boatTypes[Math.randInt(boatTypes.length)];
            var boat = new boot.dataModels.Boat({
              type: boatType.type,
              speed: boatType.speed,
              world: this,
              country: this.getRandomCountry()
            });
            this.addVehicleToSector(boat, i, j);
          }
        }
      }
    },
    getRandomShip: function(country) {
      var boatTypes = [{
        type: 'EarlyBattleship',
        speed: 0.6
      }, {
        speed: 0.5,
        type: 'EarlyDestroyer'
      }, {
        speed: 0.8,
        type: 'ThirtiesDestroyer'
      }, {
        speed: 0.3,
        type: 'Merchant'
      }, {
        speed: 0.3,
        type: 'Merchant2'
      }];
      var boatType = boatTypes[Math.randInt(boatTypes.length)];
      var boat = new boot.dataModels.Boat({
        type: boatType.type,
        speed: boatType.speed,
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
    nextTurn: function() {
      this.commerce.nextTurn();
      this.time.nextTurn();
      this.weather.nextTurn();
    },
    getBinaryWorldMap: function() {
      var map = boot.worldMap;
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
        if (this.isBoatAnEnemy(boat) && this.evaluateEncounter(boat)) {
          return true;
        }
      }
      return false;
    },
    evaluateEncounter: function(boat) {
      return Math.randInt() > 50;
    },
    isBoatAnEnemy: function(boat) {
      if (boat.country.name === "Germany") {
        return false;
      }
      return true;
    }
  };

  window.boot.models.World = world;
})();