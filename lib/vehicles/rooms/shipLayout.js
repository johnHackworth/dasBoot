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
      'control': window.boot.models.ControlRoom
    },
    rooms: [],
    maxWidth: 10,
    maxHeight: 3,
    assets: {},
    init: function(layout) {
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
              boat: this.boat
            });
            if (roomData.type === 'control') {
              this.boat.controlRoom = this.rooms[i][n];
            }
            this.rooms[i][n].viewX = 10 + this.boat.leftRoom + n * (this.roomWidth + 5);
            this.rooms[i][n].viewY = 300 + this.boat.topRoom + i * (this.roomHeight + 5);
          }
        }
      }
    }
  };

  window.boot.models.ShipLayout = shipLayout;
})();