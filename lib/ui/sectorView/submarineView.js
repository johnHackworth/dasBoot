window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var submarineView = function(options) {
    this.stage = options.stage;
    this.init();
  };
  submarineView.prototype = {
    roomViews: [],
    init: function() {
      this.addPlayerBoat();
      this.addRooms();
      this.roomViews = [];
      this.peopleView = new window.boot.ui.PeopleView({
        stage: this.stage
      });
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
      room.addView(this.stage.addImage(
        room.assets.background, {
          x: room.viewX,
          y: room.viewY,
          scale: 0.4,
          centered: false
        }
      ));
      room.view.setInteractive(true);
      room.view.click = this.mouseclickRoom.bind(this, room);
      this.roomViews.push(room.view);
    },
    mouseclickRoom: function(room, ev) {
      this.selectedRoom = room;
      if (this.peopleView.selectedPerson) {
        this.peopleView.selectedPerson.changeRoom(room);
      }
    }
  };
  window.boot.ui.SubmarineView = submarineView;
})();