window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var submarineView = function(options) {
    this.stage = options.stage;
    this.init();
  };
  submarineView.prototype = {
    roomWidth: 80,
    roomHeight: 50,
    roomViews: [],
    init: function() {
      this.addPlayerBoat();
      this.addRooms();
      this.roomViews = [];
    },
    addPlayerBoat: function() {
      this.stage.addImage(
        this.stage.playerBoat.assets.layout, {
          x: 10,
          y: 300,
          scale: 1,
          centered: false
        });
    },
    addRooms: function() {
      var rooms = this.stage.world.playerBoat.layout.rooms;
      for (var i = 0, l = rooms.length; i < l; i++) {
        for (var j = 0, ll = rooms[i].length; j < ll; j++) {
          if (rooms[i][j]) {
            this.addRoom(rooms[i][j], i, j);
          }
        }
      }
    },
    addRoom: function(room, y, x) {
      var imageView = this.stage.addImage(
        room.assets.background, {
          x: 10 + this.stage.world.playerBoat.leftRoom + x * this.roomWidth,
          y: 300 + this.stage.world.playerBoat.topRoom + y * this.roomHeight,
          scale: 0.3,
          centered: false
        }
      );
      imageView.setInteractive(true);
      imageView.click = this.mouseclickRoom.bind(this);
      this.roomViews.push(imageView);
    },
    mouseclickRoom: function(ev) {
      console.log(ev);
    }
  };
  window.boot.ui.SubmarineView = submarineView;
})();