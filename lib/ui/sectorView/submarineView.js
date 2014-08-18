window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var submarineView = function(options) {
    this.stage = options.stage;
    this.init();
  };
  submarineView.prototype = {
    roomViews: [],
    torpedoViews: [],
    combinedChange: 0,
    torpedoAssets: {
      view: 'assets/objects/torpedo.png'
    },
    init: function() {
      this.addSea();
      this.addPlayerBoat();
      this.addRooms();
      this.roomViews = [];
      this.peopleView = new window.boot.ui.PeopleView({
        stage: this.stage
      });
      this.stage.addNotVisualEntity(this);
    },
    addSea: function() {
      this.skyView = this.stage.addBackground(0, 280, window.boot.width, 250, 0x77AAFF, 1);
      this.seaView = this.stage.addBackground(0, 460, window.boot.width, 600, 0x0066AA, 1);
    },
    addPlayerBoat: function() {
      this.submarineBackground = this.stage.addImage(
        this.stage.playerBoat.assets.layout, {
          x: 50,
          y: 300,
          scale: 1,
          centered: false
        });
      this.stage.playerBoat.on('torpedoFired', this.shotTorpedo.bind(this));
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
      room.initView({
        stage: this.stage,
        after: this.submarineBackground
      });
      room.view.setInteractive(true);
      room.view.click = this.mouseclickRoom.bind(this, room);
      this.roomViews.push(room.view);
    },
    mouseclickRoom: function(room, ev) {
      this.selectedRoom = room;
      if (this.peopleView.selectedPerson) {
        this.peopleView.selectedPerson.changeRoom(room);
      }
    },
    tick: function(counter) {
      if (counter % 15 === 0 && Math.random() > 0.3) {
        var changes = [-1, -1, 1, 1];
        var n = changes[Math.floor((Math.random() * changes.length))];
        if (this.combinedChange > 5) {
          n = -1;
        }
        if (this.combinedChange < -5) {
          n = 1;
        }

        this.seaView.y += n;
        this.combinedChange += n;
      }
      if (this.torpedoViews.length > 0) {
        this.moveTorpedoes();
      }
    },
    shotTorpedo: function() {
      var torpedoView = this.stage.addImage(
        this.torpedoAssets.view, {
          x: this.submarineBackground.x + this.submarineBackground.width - 100,
          y: this.submarineBackground.y + this.submarineBackground.height - 35,
          scale: 0.35,
          before: this.submarineBackground,
          centered: false
        }
      );
      this.torpedoViews.push(torpedoView);
    },
    moveTorpedoes: function() {
      window.sw = this;
      for (var i in this.torpedoViews) {
        this.torpedoViews[i].x += 3;
      }
      if (this.torpedoViews[i].x > 2000) {
        this.stage.removeView(this.torpedoViews[i]);
        this.torpedoViews.removeElement(this.torpedoViews[i]);
      }
    }
  };
  window.boot.ui.SubmarineView = submarineView;
})();