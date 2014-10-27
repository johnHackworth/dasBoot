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
      if (origin.level === target.level) {
        return this.getSameLevelPath(origin, target, path);
      } else {
        return this.getDifferentLevelPath(origin, target, path);
      }
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