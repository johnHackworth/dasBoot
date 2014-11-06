window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var submarineView = function(options) {
    this.sector = options.sector;
    this.stage = options.stage;
    this.init();
  };
  submarineView.prototype = {
    torpedoViews: [],
    combinedChange: 0,
    torpedoAssets: {
      view: 'assets/objects/torpedo.png'
    },
    init: function() {
      this.container = new PIXI.DisplayObjectContainer();
      this.UIcontainer = new PIXI.DisplayObjectContainer();
      this.roomsContainer = new PIXI.DisplayObjectContainer();
      this.lightContainer = new PIXI.DisplayObjectContainer();
      this.peopleContainer = new PIXI.DisplayObjectContainer();
      this.skyContainer = new PIXI.DisplayObjectContainer();
      this.seaBackgroundContainer = new PIXI.DisplayObjectContainer();
      this.roomViews = [];
      this.addSea();
      this.addPlayerBoat();
      this.addRooms();
      window.sv = this;
      this.peopleView = new window.boot.ui.PeopleView({
        stage: this.stage,
        container: this.peopleContainer
      });
      this.stage.addNotVisualEntity(this);
      this.initDeepGauge();
      this.initControlGauge();
      this.initMovementSimulator();
      this.initPersonView();
      this.initMask();
      this.container.addChild(this.skyContainer);
      this.container.addChild(this.seaBackgroundContainer);
      this.container.addChild(this.roomsContainer);
      this.container.addChild(this.peopleContainer);
      this.container.addChild(this.lightContainer);

      this.stage.addVisualEntity(this.container);
      this.stage.addVisualEntity(this.UIcontainer);
    },
    initMask: function() {
      var myMask = new PIXI.Graphics();
      myMask.beginFill();
      myMask.moveTo(0, 280);
      myMask.lineTo(window.boot.config.width, 280);
      myMask.lineTo(window.boot.config.width, 690);
      myMask.lineTo(0, 690);
      myMask.lineTo(0, 280);
      myMask.endFill();
      this.mask = myMask;
      this.stage.addVisualEntity(myMask);
      this.container.mask = this.mask;
    },
    addSea: function() {
      this.initSky = 280;
      this.initSea = 460;


      this.skyView = this.stage.addBackgroundToContainer(this.skyContainer, 0, this.initSky, window.boot.config.width, 250, this.sector.weather.skyColor, 1);
      this.skyView.tint = this.sector.weather.tint;
      this.seaView = this.stage.addBackgroundToContainer(this.seaBackgroundContainer, 0, this.initSea, window.boot.config.width, 600, 0x0066AA, 1);
      this.seaView.tint = this.sector.weather.tint;
      this.seaViewOscillation = new pixEngine.Oscillator({
        stage: this.stage,
        container: this.skyContainer,
        width: window.boot.config.width,
        color: 0x0066AA,
        origin: {
          x: 0,
          y: 440
        },
        particleWidth: 50,
        oscillationHeight: 1 + Math.floor(5 * this.sector.weather.seaState / 10),
        before: this.seaView,
        period: 20
      });

    },
    addPlayerBoat: function() {
      this.submarineBackground = this.stage.createImage(
        this.stage.playerBoat.assets.layout, {
          x: window.boot.config.width / 2,
          y: 415,
          width: 1180,
          height: 340,
          centered: false
        });
      this.roomsContainer.addChild(this.submarineBackground);
      this.submarineBackground.pivot.x = 0.5;
      this.submarineBackground.pivot.y = 0.5;
      this.submarineBackground.anchor.x = 0.5;
      this.submarineBackground.anchor.y = 0.5;
      this.stage.playerBoat.on('torpedoFired', this.shotTorpedo.bind(this));
      this.stage.playerBoat.on('projectileFired', this.shotProjectile.bind(this));
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
        container: this.roomsContainer,
        lightContainer: this.lightContainer,
        level: y,
        layout: this.stage.world.playerBoat.layout
      });
      room.view.interactive = true;
      room.view.click = this.mouseclickRoom.bind(this, room);
      this.roomViews.push(room);
    },
    mouseclickRoom: function(room, ev) {
      this.selectedRoom = room;
      if (this.peopleView.selectedPerson) {
        this.peopleView.selectedPerson.changeRoom(room);
      }
    },
    getCurrentTopDeep: function() {
      return this.stage.playerBoat.deep - 180 / 4;
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
        this.controlGauge.adjustGaugesRotation();
        this.setSeaDeep();
      }
      if (counter % 60 === 0) {
        this.setSeaColor();
      }
      if (counter % 15 === 0 && Math.randInt() < 15) {
        this.seaDeepBubbles();
      }
      if (counter % 20 === 0 && Math.randInt() < 20) {
        this.submarineBubbles();
      }
      if (counter % 60 === 0 &&
        this.sector.weather.seaState &&
        Math.randInt() > 50 + Math.floor(50 / this.sector.weather.seaState)) {
        this.seaWaves();
      }
      if (counter % 20 === 0) {
        this.bubbleTrail();
      }

      if (this.shaking && counter % 3 === 0) {
        this.shakeSubmarine(counter);
      }

    },
    setSeaColor: function() {
      var deep = this.stage.playerBoat.deep;
      var decimal = Math.floor(255 - deep);
      var hex = decimal.toString(16);
      this.seaView.tint = 1 * ("0x" + hex + hex + hex);
    },
    setSeaDeep: function() {
      var y = this.seaViewHeight();
      if (this.seaView.y < y && Math.randInt() < 25) {
        this.seaBubbles();
      }
      this.seaView.y = y;
      this.seaViewOscillation.origin.y = this.seaViewOscillation.originY + y;
      if (y <= -180) {
        this.seaViewOscillation.setInactive();
      } else {
        this.seaViewOscillation.setActive();
      }
    },
    seaWaves: function() {
      var deep = this.stage.playerBoat.deep;
      if (deep < 40) {
        var randX = Math.randInt(window.boot.config.width);
        var bubbles = new pixEngine.ParticleGenerator({
          stage: this.stage,
          container: this.skyContainer,
          bottomY: this.initSea,
          origin: {
            x: randX,
            y: this.initSea - 30
          },
          randomOrigin: {
            x: 200,
            y: 0
          },
          colors: [0xFFFFFF],
          size: 1,
          randomSize: 2 + this.sector.weather.seaState,
          speed: 1 + Math.floor(1 * this.sector.weather.seaState / 10),
          duration: 150,
          direction: 14 * Math.PI / 11, // Math.PI + Math.random() * Math.PI,
          spread: Math.PI / 16,
          delayRandom: 1800,
          amount: 20,
          randomAmout: 20,
          randomDuraton: 50,
          fadding: false,
          gravity: 15,
          opacity: 0.4,
          randomOpacity: 0.2
        });
        var wave = new pixEngine.ParticleGenerator({
          stage: this.stage,
          container: this.skyContainer,
          bottomY: this.initSea,
          origin: {
            x: randX,
            y: this.initSea
          },
          randomOrigin: {
            x: 100,
            y: 0
          },
          type: 'square',
          colors: [0x0066AA, 0x0077AA, 0x0066BB, 0x0077BB],
          size: 5,
          speed: 0,
          randomSize: 20 + 2 * this.sector.weather.seaState,
          randomSpeed: 1 + Math.floor(2 * this.sector.weather.seaState / 10),
          duration: 100,
          direction: 14 * Math.PI / 11, // Math.PI + Math.random() * Math.PI,
          spread: Math.PI / 10,
          delayRandom: 1500,
          amount: 30,
          randomAmount: 30,
          randomDuration: 50,
          fadding: false,
          gravity: 20,
          opacity: 0.4,
          randomOpacity: 0.2
        });
        var mist = new pixEngine.ParticleGenerator({
          stage: this.stage,
          container: this.skyContainer,
          bottomY: this.initSea,
          origin: {
            x: randX,
            y: this.initSea
          },
          randomOrigin: {
            x: 250,
            y: 0
          },
          colors: [0xFFFFFF, 0xEEEEEE],
          size: 4,
          randomSize: 2 + this.sector.weather.seaState,
          speed: 1 + Math.floor(1 * this.sector.weather.seaState / 10),
          duration: 100,
          direction: 14 * Math.PI / 11, // Math.PI + Math.random() * Math.PI,
          spread: Math.PI / 8,
          delayRandom: 1500,
          amount: 10,
          randomAmout: 20,
          randomDuration: 10,
          fadding: true,
          gravity: -5,
          opacity: 0.5,
          randomOpacity: 0
        });
      }
    },
    seaDeepBubbles: function() {
      var deep = this.stage.playerBoat.deep;
      var bubble = new pixEngine.ParticleGenerator({
        debug: false,
        stage: this.stage,
        container: this.seaBackgroundContainer,
        topY: this.initSea + this.seaView.y,
        origin: {
          x: Math.randInt(window.boot.config.width),
          y: boot.config.height
        },
        randomOrigin: {
          x: 50,
          y: 50
        },
        colors: [0x00FFFF, 0xAABBEE, 0x88CCFF, 0x8888FF],
        size: 1,
        randomSize: 3,
        speed: 0,
        duration: 300,
        direction: -Math.PI / 2,
        spread: Math.PI / 16,
        delayRandom: 800,
        amount: 1,
        randomAmount: 5,
        randomDuration: 50,
        fadding: false,
        gravity: -3,
        opacity: 0.2,
        randomOpacity: 0.6
      });
    },
    submarineBubbles: function() {
      var deep = this.stage.playerBoat.deep;
      if (deep > 10) {

        var bubble = new pixEngine.ParticleGenerator({
          stage: this.stage,
          topY: this.seaView.y + 10,
          container: this.submarineBackground,
          origin: {
            x: this.submarineBackground.x - this.submarineBackground.width / 2 + Math.randInt(this.submarineBackground.width),
            y: this.submarineBackground.y + 45
          },
          randomOrigin: {
            x: 0,
            y: 100
          },
          colors: [0x00FFFF, 0xAABBEE, 0x88CCFF, 0x8888FF],
          size: 1,
          randomSize: 10,
          speed: 1,
          duration: 50,
          direction: -Math.PI / 2,
          spread: Math.PI / 16,
          delayRandom: 500,
          amount: 5,
          randomDuration: 50,
          fadding: true,
          gravity: -5,
          opacity: 0.2,
          randomOpacity: 0.6
        });
      }
    },
    seaBubbles: function() {
      if (this.submarineBackground.rotation > 0) {
        var size = 1;

        var gravity = this.stage.playerBoat.deep > 30 ? -10 : 10;
        var direction = this.stage.playerBoat.deep > 30 ? Math.PI : 12 * Math.PI / 11;
        this.explosion = new pixEngine.ParticleGenerator({
          stage: this.stage,
          container: this.submarineBackground,
          bottomY: this.seaViewZero,
          origin: {
            x: this.submarineBackground.x + this.submarineBackground.width / 2,
            y: this.submarineBackground.y + 45
          },
          randomOrigin: {
            x: 20,
            y: 0
          },
          colors: [0xFFFFFF, 0x00FFFF, 0xAABBEE, 0x88CCFF, 0x8888FF],
          size: size,
          randomSize: 5,
          speed: 2,
          duration: 100,
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
      this.assignPeopleRotation();
    },
    assignRoomRotation: function(counter, maxRotation, rotationRythm) {
      for (var i in this.roomViews) {
        this.roomViews[i].view.rotation = 1 * this.submarineBackground.rotation;
        var factor = 100 * maxRotation * (1 + Math.floor((this.submarineBackground.x - this.roomViews[i].view.x) / this.roomViews[i].view.width));
        if (!this.roomViews[i].view.originalY) {
          this.roomViews[i].view.originalY = this.roomViews[i].view.y;
        }
        this.roomViews[i].view.y = this.roomViews[i].view.originalY + factor * Math.sin(counter / rotationRythm / 10);
      }
    },
    assignPeopleRotation: function() {
      var people = this.stage.playerBoat.people;
      // console.log(people);
      for (var l = people.length; l; l--) {
        if (!people[l - 1].isClimbing) {
          for (var ll = people[l - 1].view.length; ll; ll--) {
            if (people[l - 1] && people[l - 1].room) {
              var room = people[l - 1].previousRoom || people[l - 1].room;
              people[l - 1].view[ll - 1].y = room.view.y + (room.view.height - people[l - 1].view[ll - 1].height);
              people[l - 1].adjustUI();
            }
          }
        }
      }
    },
    shotTorpedo: function() {
      var torpedoView = this.stage.createImage(
        this.torpedoAssets.view, {
          x: this.submarineBackground.x + this.submarineBackground.width / 2 - 100,
          y: this.submarineBackground.y + this.submarineBackground.height / 2 - 35,
          scale: 0.35,
          before: this.submarineBackground,
          centered: false
        }
      );
      this.container.addChild(torpedoView);
      this.torpedoViews.push(torpedoView);
      this.addTorpedoFireTrail(torpedoView);
    },
    shotProjectile: function() {
      var explosion = new pixEngine.ParticleGenerator({
        stage: this.stage,
        container: this.lightContainer,
        origin: {
          x: this.submarineBackground.x + 300,
          y: this.submarineBackground.y - 20
        },
        randomOrigin: {
          x: 10,
          y: 10
        },
        colors: [0xFF0000, 0xFFFF00, 0xFFFFFF, 0xFFCC66],
        size: 2,
        randomSize: 5,
        speed: 1,
        duration: 50,
        delayRandom: 100,
        amount: 50,
        gravity: 0,
        randomDuration: 10,
        fadding: true,
        opacity: 0.2,
        randomOpacity: 0.6
      });
    },
    addTorpedoFireTrail: function(view) {
      var size = 1;
      this.explosion = new pixEngine.ParticleGenerator({
        stage: this.stage,
        container: this.lightContainer,
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
      for (var i in this.torpedoViews) {
        this.torpedoViews[i].x += 5;
      }
      if (this.torpedoViews[i].x > 2000) {
        this.stage.removeView(this.torpedoViews[i]);
        this.torpedoViews.removeElement(this.torpedoViews[i]);
      }
    },
    initDeepGauge: function() {
      this.deepGauge = new boot.ui.DeepGauge({
        x: 5,
        y: window.boot.config.height - 155,
        sea: this,
        stage: this.stage,
        container: this.UIcontainer
      });
    },
    initControlGauge: function() {
      this.controlGauge = new boot.ui.ControlGauge({
        x: 160,
        y: window.boot.config.height - 155,
        sea: this,
        stage: this.stage,
        container: this.UIcontainer
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
    },
    bubbleTrail: function() {
      var trailLong = 0;
      if (this.stage.playerBoat.stance === 'attack' || this.stage.playerBoat.stance === 'defense') {
        trailLong = 5;
      }
      if (this.stage.playerBoat.stance === 'ahead' || this.stage.playerBoat.stance === 'back') {
        trailLong = 10;
      }
      if (trailLong) {
        this.trail = new pixEngine.ParticleGenerator({
          stage: this.stage,
          container: this.seaBackgroundContainer,
          origin: {
            x: this.submarineBackground.x - this.submarineBackground.width / 2 + 150,
            y: this.submarineBackground.y + this.submarineBackground.height / 2 - 20
          },
          randomOrigin: {
            x: 10,
            y: 10
          },
          before: this.submarineBackground,
          colors: [0xFFFFFF, 0x99FFFF, 0x9999FF],
          size: 1,
          randomSize: 10,
          speed: 0.2 * trailLong,
          delayRandom: 1000,
          duration: 200,
          direction: Math.PI,
          spread: Math.PI / 36,
          amount: 3,
          randomDuration: 20,
          fadding: true,
          gravity: -0.3,
          opacity: 0.1,
          randomOpacity: 0.6
        });
      }
    },
    initPersonView: function() {
      this.personView = new window.boot.ui.PersonView({
        stage: this.stage,
        container: this.UIcontainer,
        people: this.peopleView
      });
      this.peopleView.on('selectedPerson', this.personView.changeTarget.bind(this.personView));
    },
    scale: function(amount) {
      this.container.y = -600 * (amount - 1);
      this.container.scale.set(amount, amount);
    },
    createDeepCharge: function(options) {
      var deepCharge = new window.boot.models.DeepCharge({
        initY: this.seaView.y + this.initSea,
        stage: this.stage,
        sea: this.sea,
        submarineView: this,
        origin: options.origin,
        primedDeep: 50,
        combatSimulator: this.sea.combatSimulator,
        container: this.seaBackgroundContainer
      });
    },
    shakeSubmarine: function(counter) {
      if (!this.originShake) {
        this.originShake = counter;
      }
      this.submarineBackground.originX = this.submarineBackground.originX || this.submarineBackground.x;
      this.submarineBackground.originY = this.submarineBackground.originY || this.submarineBackground.y;
      var x = -2 + Math.randInt(5);
      var y = -2 + Math.randInt(5);
      this.submarineBackground.y += (counter % 2 === 0) ? -4 : 4;
      this.submarineBackground.x += (counter % 2 === 0) ? -4 : 4;
      this.shakeRooms(x, y);
      if (counter - this.originShake > 50) {
        this.originShake = null;
        this.shaking = false;
        this.submarineBackground.y = this.submarineBackground.originY;
        this.submarineBackground.x = this.submarineBackground.originX;
      }
    },
    shakeRooms: function(x, y) {},
    deepChargeHit: function(deepCharge) {
      this.shaking = true;
    }
  };
  window.boot.ui.SubmarineView = submarineView;
})();