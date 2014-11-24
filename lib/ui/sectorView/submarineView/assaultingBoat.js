window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var assaultingBoat = function(options) {
    this.container = options.container;
    this.peopleView = options.peopleView;
    this.stage = options.stage;
    this.submarineView = options.submarineView;
    this.destination = options.destination;
    this.boat = this.stage.playerBoat;
    this.initView();
    this.createSailors();
    this.setPosition(options.x, options.y);
  };
  assaultingBoat.prototype = {
    counter: 0,
    goingToSubmarine: true,
    level: 0,
    timeToDissapear: 500,
    assets: {
      side: 'assets/vehicles/lifeboatEmpty.png'
    },
    initView: function() {
      this.sideTexture = new PIXI.Texture.fromImage(this.assets.side);
      this.view = PIXI.Sprite.fromFrame(this.assets.side);
      this.container.addChild(this.view);
      this.stage.addNotVisualEntity(this);
    },
    setPosition: function(x, y) {
      this.view.x = x;
      this.view.y = y;
      this.view.width = 200;
      this.view.height = 40;
    },
    tick: function(counter, active) {
      if (!active) return;
      this.counter++;
      this.move();
      this.setSailorsPos();
      if (this.counter % 20 === 0) {
        this.addWaves();
      }
    },
    move: function() {
      if (this.goingToSubmarine) {
        this.view.x--;
      }
      if (this.leavingTheArea) {
        this.view.x--;
        this.timeToDissapear--;
        if (!this.timeToDissapear) {
          this.destroy();
        }
      }
      this.view.y = this.submarineView.getSeaTopY() - 10 / this.submarineView.currentScale;

      if (this.view.x === this.destination) {
        this.arrivedToSubmarine();
      }
    },
    arrivedToSubmarine: function() {
      this.goingToSubmarine = false;
      this.submarineAction();
    },
    getPosition: function(sailor) {
      return {
        x: this.view.x,
        y: this.view.y
      };
    },
    createSailors: function() {
      this.sailors = [];
      var nSailors = Math.randInt(3) + 2;
      for (var n = 0; n < nSailors; n++) {
        var enemy = new window.boot.models.EnemySailor({
          model: new boot.dataModels.Person(),
          room: this,
          boat: this.boat,
          stage: this.stage
        });
        this.sailors.push(enemy);
        enemy.isOnBoat = true;
        this.peopleView.addPersonOutside(enemy);

      }
      return;
    },
    isFullOfWater: function() {
      return false;
    },
    setSailorsPos: function() {
      for (var i = 0, l = this.sailors.length; i < l; i++) {
        this.sailors[i].pos = this.getPosition();
        this.sailors[i].pos.x += 30 + i * 30;
        this.sailors[i].pos.y -= 22;
      }
    },
    addWaves: function() {
      var size = 10;
      var sea = new pixEngine.ParticleGenerator({
        stage: this.stage,
        container: this.container,
        origin: {
          x: this.view.x + Math.floor(this.view.width / 2),
          y: this.view.y + Math.floor(this.view.height + 25)
        },
        randomOrigin: {
          x: Math.floor(this.view.width),
          y: 3
        },
        colors: [0x0077CF, 0x005599, 0x3366AA],
        size: size * 5,
        randomSize: size,
        speed: 0.1,
        duration: 50,
        delayRandom: 2500,
        type: 'line',
        amount: 2,
        randomDuration: 240,
        fadding: true,
        gravity: 0.001,
        opacity: 0.7,
        randomOpacity: 0.2
      });
      var waves = new pixEngine.ParticleGenerator({
        stage: this.stage,
        container: this.container,
        origin: {
          x: this.view.x + Math.floor(this.view.width / 2),
          y: this.view.y + Math.floor(this.view.height)
        },
        randomOrigin: {
          x: Math.floor(this.view.width),
          y: 3
        },
        colors: [0x00CCFF, 0x99EEFF, 0xAAAAFF],
        size: size,
        randomSize: size,
        speed: 0.1,
        duration: 50,
        delayRandom: 2500,
        type: 'trapezoid',
        amount: 2,
        randomDuration: 40,
        fadding: true,
        gravity: 0.001,
        opacity: 0.7,
        randomOpacity: 0.2
      });
    },
    submarineAction: function() {
      var playerBoat = this.submarineView.getPlayerBoat();
      var boardingRoom = playerBoat.deckRooms.getLast();
      while (this.sailors.length > 0 && boardingRoom.hasFreeSpace()) {
        var sailor = this.sailors.pop();
        sailor.isOnBoat = false;
        this.peopleView.takePersonInside(sailor, boardingRoom);
      }
      if (this.sailors.length === 0) {
        this.leavingTheArea = true;

      }
    },
    destroy: function() {
      for (var i in this.sailors) {
        this.sailors[i].destroy();
      }
      this.container.removeChild(this.view);
      this.stage.removeElement(this);
    }
  };

  window.boot.models.AssaultingBoat = assaultingBoat;
})();