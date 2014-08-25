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
      if (this.roomViews.length == 0) this.roomViews = [];
      this.peopleView = new window.boot.ui.PeopleView({
        stage: this.stage
      });
      this.stage.addNotVisualEntity(this);
      this.initDeepGauge();
      this.initMovementSimulator();
    },
    addSea: function() {
      this.initSky = 280;
      this.initSea = 460;
      this.skyView = this.stage.addBackground(0, this.initSky, window.boot.width, 250, 0x77AAFF, 1);
      this.seaView = this.stage.addBackground(0, this.initSea, window.boot.width, 600, 0x0066AA, 1);
    },
    addPlayerBoat: function() {
      this.submarineBackground = this.stage.addImage(
        this.stage.playerBoat.assets.layout, {
          x: window.boot.width / 2,
          y: 420,
          scale: 1,
          centered: false
        });
      this.submarineBackground.pivot.x = 0.5;
      this.submarineBackground.pivot.y = 0.5;
      this.submarineBackground.anchor.x = 0.5;
      this.submarineBackground.anchor.y = 0.5;
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
      this.roomViews.push(room);
    },
    mouseclickRoom: function(room, ev) {
      this.selectedRoom = room;
      if (this.peopleView.selectedPerson) {
        this.peopleView.selectedPerson.changeRoom(room);
      }
    },
    seaViewHeight: function() {
      var deep = this.stage.playerBoat.deep;
      if (!this.seaViewZero) {
        this.seaViewZero = this.seaView.y;
      }
      var height = this.seaViewZero - deep * 4;
      if (height < -180) {
        height = -180;
      }
      return Math.floor(height);
    },
    tick: function(counter, active) {
      if (!active) return;
      var changes = [-1, -1, 1, 1];
      if (counter % 15 === 0 && Math.random() > 0.3) {
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
      if (counter % 3 === 0) {
        this.deepGauge.adjustGaugesRotation();
        this.setSeaDeep();
      }
    },
    setSeaDeep: function() {
      var y = this.seaViewHeight();
      if (this.seaView.y < y && Math.randInt() < 15) {
        this.seaBubbles();
      }
      this.seaView.y = y;
    },
    seaBubbles: function() {
      if (this.submarineBackground.rotation > 0) {
        var size = 1;

        var gravity = this.stage.playerBoat.deep > 30 ? -10 : 10;
        var direction = this.stage.playerBoat.deep > 30 ? Math.PI : 8 * Math.PI / 7;
        this.explosion = new pixEngine.ParticleGenerator({
          stage: this.stage,
          origin: {
            x: this.submarineBackground.x + this.submarineBackground.width / 2,
            y: this.submarineBackground.y + 45
          },
          colors: [0xFFFFFF, 0x33CCFF, 0x8888FF],
          size: size,
          randomSize: 5,
          speed: 2,
          duration: 50,
          direction: direction,
          spread: Math.PI / 16,
          delayRandom: 500,
          amount: 50,
          randomDuration: 50,
          fadding: false,
          gravity: gravity,
          opacity: 0.2,
          randomOpacity: 0.6
        });
      }
    },
    assignSumarineRotation: function(counter, maxRotation, rotationRythm) {
      if (counter % rotationRythm === 0) {
        this.submarineBackground.rotation = maxRotation / 2 - maxRotation * Math.sin(counter / rotationRythm / 10);

      }
      this.assignRoomRotation(counter, maxRotation, rotationRythm);
    },
    assignRoomRotation: function(counter, maxRotation, rotationRythm) {
      for (var i in this.roomViews) {
        this.roomViews[i].view.rotation = 1 * this.submarineBackground.rotation;
        var factor = 100 * maxRotation * (1 + Math.floor((this.submarineBackground.x - this.roomViews[i].view.x) / this.roomViews[i].view.width));
        if (!this.roomViews[i].view.originalY) {
          this.roomViews[i].view.originalY = this.roomViews[i].view.y;
        }
        this.assignPeopleRotation(this.roomViews[i], maxRotation, rotationRythm);
        this.roomViews[i].view.y = this.roomViews[i].view.originalY + factor * Math.sin(counter / rotationRythm / 10);
      }
    },
    assignPeopleRotation: function(room, maxRotation, rotationRythm) {
      for (var l = room.people.length - 1; l >= 0; l--) {
        if (room.people[l]) {
          for (var ll = room.people[l].view.length - 1; ll >= 0; ll--) {
            room.people[l].view[ll].y = room.view.y + (room.view.height - room.people[l].view[ll].height);
            room.people[l].adjustUI();
          }
        }
      }
    },
    shotTorpedo: function() {
      var torpedoView = this.stage.addImage(
        this.torpedoAssets.view, {
          x: this.submarineBackground.x + this.submarineBackground.width / 2 - 100,
          y: this.submarineBackground.y + this.submarineBackground.height / 2 - 35,
          scale: 0.35,
          before: this.submarineBackground,
          centered: false
        }
      );
      this.torpedoViews.push(torpedoView);
      this.addTorpedoFireTrail(torpedoView);
    },
    addTorpedoFireTrail: function(view) {
      var size = 1;
      this.explosion = new pixEngine.ParticleGenerator({
        stage: this.stage,
        origin: {
          x: this.submarineBackground.x + this.submarineBackground.width / 2 - 5,
          y: this.submarineBackground.y + this.submarineBackground.height / 2 - 35
        },
        colors: [0xFFFFFF, 0x33CCFF, 0x8888FF],
        size: size,
        randomSize: 2,
        speed: 3,
        duration: 100,
        direction: 0,
        spread: Math.PI / 8,
        delayRandom: 1000,
        amount: 50,
        randomDuration: 100,
        fadding: false,
        gravity: -10,
        opacity: 0.2,
        randomOpacity: 0.6
      });
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
    },
    initDeepGauge: function() {
      this.deepGauge = new boot.ui.DeepGauge({
        x: 5,
        y: 500,
        sea: this,
        stage: this.stage
      });
    },
    initMovementSimulator: function() {
      this.movementSimulator = new boot.models.MovementSimulator({
        stage: this.stage,
        submarineView: this,
        boat: this.stage.playerBoat,
        deepGauge: this.deepGauge
      });
      this.stage.addNotVisualEntity(this.movementSimulator);
    }
  };
  window.boot.ui.SubmarineView = submarineView;
})();