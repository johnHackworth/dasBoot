window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var shipLayout = function(options) {
    this.boat = options.boat;
    this.init(options.layout);
  };
  shipLayout.prototype = {
    roomTypes: {
      'empty': window.boot.models.Room,
      'torpedo': window.boot.models.TorpedoRoom
    },
    rooms: [],
    maxWidth: 10,
    maxHeight: 3,
    roomWidth: 105,
    roomHeight: 50,
    assets: {},
    init: function(layout) {
      this.layoutMap = layout;
      this.initLayout();
      this.createRooms();
      console.log(22);
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
            this.rooms[i][n].viewX = 10 + this.boat.leftRoom + n * this.roomWidth;
            this.rooms[i][n].viewY = 300 + this.boat.topRoom + i * this.roomHeight;
          }
        }
      }
    }
  };

  window.boot.models.ShipLayout = shipLayout;
})();