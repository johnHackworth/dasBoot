window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var shipLayout = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Room, true, options);
    this.boat = options.boat;
    this.init(options.layout);
  };
  shipLayout.prototype = {
    roomTypes: {
      'empty': window.boot.models.Room,
      'torpedo': window.boot.models.TorpedoRoom,
      'sleepingQuarters': window.boot.models.SleepingQuarters,
      'engine': window.boot.models.EngineRoom,
      'control': window.boot.models.ControlRoom,
      'stairs': window.boot.models.StairsRoom,
      'deckGun': window.boot.models.DeckGunRoom,
      'comms': window.boot.models.CommsRoom
    },
    rooms: [],
    maxWidth: 10,
    maxHeight: 3,
    assets: {},
    init: function(layout) {
      this.rooms = [];
      window.ship = this;
      this.layoutMap = layout;
      this.initLayout();
      this.createRooms();
      this.initPaths();
    },
    initLayout: function() {
      for (var i = 0; i < this.maxHeight; i++) {
        this.rooms[i] = [];
        for (var j = 0; j < this.maxWidth; j++) {
          this.rooms[i][j] = null;
        }
      }
    },
    createRooms: function() {
      // [{rooms: [ {type: 'motors', 'doors': ['left', 'right', 'up'], open: true}], }, {rooms: {}} ...]
      for (var i = 0, l = this.layoutMap.length; i < l; i++) {
        for (var n = 0, ll = this.layoutMap[i].rooms.length; n < ll; n++) {
          if (this.layoutMap[i].rooms[n]) {
            var roomData = this.layoutMap[i].rooms[n];
            this.rooms[i][n] = new this.roomTypes[roomData.type]({
              params: roomData,
              layout: this,
              boat: this.boat,
              level: i,
              order: n
            });
            if (roomData.type === 'control') {
              this.boat.controlRoom = this.rooms[i][n];
            }
            if (roomData.type === 'comms') {
              this.boat.commsRoom = this.rooms[i][n];
            }
            if (roomData.type === 'engine') {
              this.boat.engineRoom = this.rooms[i][n];
            }
            if (roomData.type === 'deckGun') {
              this.boat.deckGunRoom = this.rooms[i][n];
            }
            this.rooms[i][n].viewX = 10 + this.boat.leftRoom + n * (this.roomWidth + 5);
            this.rooms[i][n].viewY = 300 + this.boat.topRoom + i * (this.roomHeight + 5);
          }
        }
      }
    },
    getStairsWell: function(level) {
      for (var l = this.rooms[level].length; l; l--) {
        if (this.rooms[level][l - 1] && this.rooms[level][l - 1].hasStairs) {
          return this.rooms[level][l - 1];
        }
      }
    },
    getPath: function(origin, target, path) {
      if (!path) {
        path = [origin];
      }

      return this.getPrecalculatedPath(origin, target, path);
    },
    getPrecalculatedPath: function(origin, target, path) {
      var originCode = origin.level + '_' + origin.order;
      var targetCode = target.level + '_' + target.order;
      var encodedPath = this.precalculatedPaths[originCode][targetCode];
      for (var i = 0, l = encodedPath.length; i < l; i++) {
        var y = encodedPath[i].split('_')[0];
        var x = encodedPath[i].split('_')[1];
        path.push(this.rooms[y][x]);
      }
      return path;
    },
    getSameLevelPath: function(origin, target, path) {
      if (origin == target) {
        return path;
      }
      if (origin.order < target.order) {
        for (var i = origin.order + 1; i <= target.order; i++) {
          path.push(this.rooms[origin.level][i]);
        }
      } else {
        for (var j = origin.order - 1; j >= target.order; j--) {
          path.push(this.rooms[origin.level][j]);
        }
      }
      return path;
    },
    initPaths: function() {
      var i = 0;
      var j = 0;
      var stairs0 = 3;
      var stairs1 = 3;
      this.precalculatedPaths = {};
      for (i = 0; i <= 5; i++) {
        for (j = 0; j <= 5; j++) {
          if (i != j) {
            this.precalculatedPaths['1_' + i] = this.precalculatedPaths['1_' + i] || {};
            this.precalculatedPaths['1_' + i]['1_' + j] = this.getInterPath(i, j, 1);
            this.precalculatedPaths['0_' + i] = this.precalculatedPaths['0_' + i] || {};
            this.precalculatedPaths['0_' + i]['0_' + j] = this.getInterPath(i, j, 0);
          }
        }
      }
      for (i = 0; i <= 5; i++) {
        for (j = 0; j <= 5; j++) {
          this.precalculatedPaths['1_' + i] = this.precalculatedPaths['1_' + i] || {};

          var arr1 = this.getInterPath(i, 3, 1);
          var arr2 = this.getInterPath(3, j, 0);
          this.precalculatedPaths['1_' + i]['0_' + j] = arr1.concat(arr2);

          var arr11 = this.getInterPath(i, 3, 0);
          var arr22 = this.getInterPath(3, j, 1);
          this.precalculatedPaths['0_' + i]['1_' + j] = arr11.concat(arr22);

        }
      }

    },
    getInterPath: function(x, y, level) {
      var pre = level + '_';
      var path = [];
      if (x > y) {
        while (x >= y) {
          path.push(pre + x);
          x--;
        }
      } else {

        while (x <= y) {
          path.push(pre + x);
          x++;
        }
      }
      return path;
    },
    getDifferentLevelPath: function(origin, target, path) {
      var stairsOriginLevel = this.getStairsWell(origin.level);
      path = this.getPath(origin, stairsOriginLevel, path);
      var stairsTargetLevel = this.getStairsWell(target.level);
      path.push(stairsTargetLevel);
      path.push(stairsTargetLevel);
      path = this.getPath(stairsTargetLevel, target, path);
      return path;
    }
  };

  window.boot.models.ShipLayout = shipLayout;
})();