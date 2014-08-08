window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var shipLayout = function(options) {
    this.init(options.layout);
    this.boat = options.boat;
  };
  shipLayout.prototype = {
    roomTypes: {
      'empty': window.boot.models.Room
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
          }
        }
      }
    }
  };

  window.boot.models.ShipLayout = shipLayout;
})();