window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var nPerson = 0;
  var person = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.components.HealthBar);
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.model = options.model;
    this.stage = options.stage;
    this.init(options);
    nPerson++;
  };
  person.prototype = {
    sideWorkTasks: ['artillery'],
    isFixer: false,

    randomSeed: 0,
    viewHeight: 46,
    viewWidth: 24,
    counter: 0,
    assets: boot.assets.person,
    room: null,
    x: 0,
    y: 0,
    init: function() {
      this.name = this.model.name;
      this.destination = {};
      this.nextDestinations = [];
      this.view = [];
      this.randomSeed = Math.randInt(10);
      this.randomizeLook();
      this.workHability = new window.boot.models.WorkHability({
        attributes: this.model.attributes
      });

    },
    randomizeLook: function() {
      var n = this.model.headType;
      this.viewImage = this.assets.views[n];
      n = this.model.bodyType;
      this.bodyImage = this.assets.bodies[n];
    },
    initTextures: function() {
      this.textures = {};

      this.textures = {
        head: {
          front: new PIXI.Texture.fromImage(this.viewImage.front),
          side: new PIXI.Texture.fromImage(this.viewImage.side),
          back: new PIXI.Texture.fromImage(this.viewImage.back),
        },
        body: {
          standing: new PIXI.Texture.fromImage(this.bodyImage.standing),
          sidework: new PIXI.Texture.fromImage(this.bodyImage.sidework),
          moving: [],
          working: [],
          climbing: [],
          fixing: [],
          death: [],
        }
      };
      for (var i in this.bodyImage.moving) {
        var texture = new PIXI.Texture.fromImage(this.bodyImage.moving[i]);
        this.textures.body.moving.push(texture);
      }
      for (i in this.bodyImage.working) {
        var textureWork = new PIXI.Texture.fromImage(this.bodyImage.working[i]);
        this.textures.body.working.push(textureWork);
      }
      for (i in this.bodyImage.climbing) {
        var textureClimb = new PIXI.Texture.fromImage(this.bodyImage.climbing[i]);
        this.textures.body.climbing.push(textureClimb);
      }
      for (i in this.bodyImage.fixing) {
        var textureFix = new PIXI.Texture.fromImage(this.bodyImage.fixing[i]);
        this.textures.body.fixing.push(textureFix);
      }
      for (i in this.bodyImage.death) {
        var textureDeath = new PIXI.Texture.fromImage(this.bodyImage.death[i]);
        this.textures.body.death.push(textureDeath);
      }
    },
    initView: function() {
      this.initTextures();
      var headview = PIXI.Sprite.fromFrame(this.viewImage.front);
      var bodyview = PIXI.Sprite.fromFrame(this.bodyImage.standing);

      headview.originalHeight = this.viewHeight;
      headview.originalWidth = this.viewWidth;
      bodyview.originalWidth = this.viewWidth + 2;
      bodyview.originalHeight = this.viewHeight;

      this.pos = {
        x: this.room.getPosition(this, this.nextDestinations).x,
        y: this.room.getPosition(this, this.nextDestinations).y
      };
      this.currentLevel = this.room.level;

      bodyview.x = this.pos.x;
      bodyview.y = this.pos.y;
      headview.x = this.pos.x;
      headview.y = this.pos.y;

      this.view.push(bodyview);
      this.view.push(headview);

      this.changeDestination(this.room.getPosition(this, this.nextDestinations));
      this.stage.addEntityBefore(this, this.stage.firstAmbient);

      this.initHealthBar({
        x: this.view[0].x + 5,
        y: this.view[0].y - 3,
        width: 20,
        height: 3,
        attribute: 'health',
        origin: this.model
      });
    },
    animate: function() {
      if (this.status === 'working') {
        if (this.sidework) {
          this.animateSideWork();
        } else {
          this.animateWork();
        }
      } else if (this.status === 'fixing') {
        this.animateFix();
      } else if (this.status === 'dead') {
        this.animateDeath();
      } else if (this.isMoving) {
        if (this.isClimbing) {
          this.animateClimb();
        } else {
          this.animateMoving();
        }
      } else {
        this.animateStand();
      }
    },
    animateStand: function() {
      if (this.counter % 5 === 0) {
        this.view[1].setTexture(this.textures.head.front);
        this.view[0].setTexture(this.textures.body.standing);
        for (var i in this.view) {
          this.view[i].width = this.view[i].originalWidth;
          this.view[i].height = this.view[i].originalHeight;
        }
        this.moveView(this.pos.x, this.pos.y);
      }
    },
    animateSideWork: function() {
      if (this.counter % 5 === 0) {
        this.view[1].setTexture(this.textures.head.side);
        this.view[0].setTexture(this.textures.body.sidework);
        for (var i in this.view) {
          this.view[i].width = this.view[i].originalWidth;
          this.view[i].height = this.view[i].originalHeight;
        }
        this.moveView(this.pos.x, this.pos.y);
      }
    },
    animateWork: function() {
      var i = null;
      this.view[1].setTexture(this.textures.head.back);
      if (this.counter % 7 === 0) {
        this.view[0].setTexture(this.textures.body.working[Math.randInt(this.textures.body.working.length)]);
      }

      if (this.isMovingLeft) {
        this.isMovingLeft = false;
      }

      if (Math.floor(this.counter / 25) % 3 === 0) {
        this.view[0].width = this.view[0].originalWidth;
        this.view[0].twisted = false;
      }
      this.moveView(this.pos.x, this.pos.y);

    },
    animateFix: function() {
      var i = null;
      this.view[1].setTexture(this.textures.head.side);
      if (this.counter % 10 === 0) {
        var step = (Math.floor(this.counter / 10) + this.randomSeed) % 4;
        this.view[0].setTexture(this.textures.body.fixing[step]);
      }
      this.isMovingLeft = false;
      this.moveView(this.pos.x, this.pos.y);
    },
    animateDeath: function() {
      this.deathStep = this.deathStep || 0;
      if (this.counter % 15 === 0 && this.deathStep <= 4) {
        if (this.deathStep <= 3) {
          this.view[1].setTexture(this.textures.head.side);
          this.view[0].setTexture(this.textures.body.death[this.deathStep]);
        } else {
          this.view[0].tint = 0x666666;
          this.view[1].tint = 0x666666;
        }
        this.view[0].rotation = this.deathStep * Math.PI / 8;
        this.view[1].rotation = this.deathStep * Math.PI / 8;
        this.view[0].adjustment = {
          standing: [15 * this.deathStep, 8 * this.deathStep]
        };
        this.view[1].adjustment = {
          standing: [15 * this.deathStep, 8 * this.deathStep]
        };

        this.deathStep++;
      }
      this.isMovingLeft = false;
      this.moveView(this.pos.x, this.pos.y);
    },
    animateClimb: function() {
      var i = null;
      this.view[1].setTexture(this.textures.head.back);
      if (this.counter % 10 === 0) {
        var step = (Math.floor(this.counter / 10) + this.randomSeed) % 2;
        this.view[0].setTexture(this.textures.body.climbing[step]);
      }
      this.isMovingLeft = false;
      this.moveView(this.pos.x, this.pos.y);
    },
    animateMoving: function() {
      var i = null;
      if ((this.counter % 5 === 0)) {
        var step = (Math.floor(this.counter / 5) + this.randomSeed) % 8;
        this.view[1].setTexture(this.textures.head.side);
        this.view[0].setTexture(this.textures.body.moving[step]);
      }
    },
    moveView: function(x, y) {
      for (var i in this.view) {
        var adjustment = [0, 0];
        if (this.view[i].adjustment) {
          adjustment = this.isMoving ? this.view[i].adjustment.moving : this.view[i].adjustment.standing;
        }
        this.view[i].x = x + adjustment[0];
        this.view[i].y = y + adjustment[1];
        if (this.isMovingLeft) {
          this.view[i].width = -1 * this.view[i].originalWidth;
          this.view[i].height = this.view[i].originalHeight;
          this.view[i].x -= this.view[i].width;
        } else {
          this.view[i].width = this.view[i].originalWidth;
          this.view[i].height = this.view[i].originalHeight;
        }
        if (this.isMoving) {
          if (this.isMovingLeft) {
            this.view[1].x -= 2;
          } else {
            this.view[1].x += 2;
          }
        }

      }
      // this.view[1].y = y - 10;

    },
    changeRoom: function(room) {
      if (room.hasFreeSpace()) {
        var path = this.boat.layout.getPath(this.room, room);
        this.room.removePerson(this);
        room.addPerson(this);
        this.nextDestinations = path;

        // if (this.room.level === room.level) {
        //   return this.goToSameLevelRoom(room);
        // } else {
        //   return this.goToDifferentLevelRoom(room);
        // }
      }
    },
    goToSameLevelRoom: function(room) {
      this.changeDestination(room.getPosition(this));
    },
    passThroughRoom: function(room) {
      this.changeDestination(room.getPosition(this));
    },
    goToDifferentLevelRoom: function(room, notAssignPosition) {
      if (!this.room.hasStairs) {
        var stairs = this.room.getStairsWell();
        console.log(stairs, room);

        this.nextDestinations.push(stairs);
        this.nextDestinations.push(room);
      } else {
        var otherLevelStairs = room.getStairsWell();
        this.climbStairs(otherLevelStairs, true);
        console.log(room);
        this.nextDestinations.push(room);
      }
    },
    climbStairs: function(room, notAssignPosition) {
      this.changeDestination(room.getPosition(this));
    },
    tick: function(counter, active) {
      if (!active) return;
      this.counter++;
      this.workHability.hasWorked = false;
      this.animate();
      if (!this.hasArrivedDestination()) {
        this.moveTowardsDestination();
        this.isMoving = true;
      } else {
        if (this.nextDestinations.length > 0) {
          console.log(this.nextDestinations);
          var room = this.nextDestinations.shift();
          this.previousRoom = room;
          if (this.room.level != room.level) {
            this.climbStairs(room, true);
          } else {
            this.goToSameLevelRoom(room, true);
          }
        } else {
          this.isMoving = false;
          this.isClimbing = false;
        }
      }

      this.adjustUI();
      this.clearCounters();
    },
    clearCounters: function() {
      if (this.statusChange && (1 * this.counter - 1 * this.statusChange > 100)) {
        this.status = 'idle';
        this.sidework = false;
      }
    },
    moveTowardsDestination: function() {
      this.status = null;
      var moveTo = [this.pos.x, this.pos.y];
      var diffX = this.destination.x - this.pos.x;
      if (Math.abs(diffX) > 3) {
        this.isClimbing = false;
        if (diffX < 0) {
          this.isMovingLeft = true;
        } else {
          this.isMovingLeft = false;
        }
        this.pos.x += this.model.speed * diffX / Math.abs(diffX);
        moveTo[0] = 1 * this.pos.x;
      } else {
        var diffY = this.destination.y - this.pos.y;
        if (diffY) {
          this.isClimbing = true;
          this.pos.y += diffY / Math.abs(diffY);
          moveTo[1] = 1 * this.pos.y;
        }
      }
      this.moveView(moveTo[0], moveTo[1]);
    },
    hasArrivedDestination: function() {
      // console.log(this.destination, this.pos)
      return Math.abs(this.destination.x - this.pos.x) < 4 && Math.abs(this.destination.y - this.pos.y) < 4;
    },
    isOnDestination: function() {
      return this.hasArrivedDestination();
    },
    workAt: function(type) {
      if (this.status != 'fixing' && this.status != 'dead') {
        if (this.room.hullIntegrity < 40) {
          return;
        }
        if (this.sideWorkTasks.indexOf(type) >= 0) {
          window.sideworker = this;
          this.sidework = true;
        }
        this.status = 'working';
        this.statusChange = this.counter;
        return this.workHability.work(type) * this.room.hullIntegrity / 100;
      }
      return 0;
    },
    fix: function(room) {
      this.status = 'fixing';
      this.statusChange = this.counter;
      var fixing = this.workHability.work('fixing');
      room.fix(fixing / 100);
    },
    select: function() {
      this.selectedHalo = new PIXI.Sprite.fromImage('assets/ui/selected.png');
      this.selectedHalo.width = this.view[0].width + 2;
      this.selectedHalo.height = this.view[0].height + 2;

      this.stage.addVisualEntity(this.selectedHalo);
      this.addDestinationView();
    },
    unselect: function() {
      this.stage.removeView(this.selectedHalo);
      this.stage.removeView(this.destinationView);
      this.selectedHalo = null;
    },
    adjustUI: function() {
      if (this.selectedHalo) {
        this.selectedHalo.x = this.pos.x - 1;
        this.selectedHalo.y = this.pos.y - 1;
      }
      this.updateHealthBar(this.pos.x, this.pos.y);
    },
    addDestinationView: function() {
      this.destinationView = new PIXI.Sprite.fromImage('assets/ui/destination.png');
      this.destinationView.width = this.view[0].width;
      this.destinationView.height = this.view[0].height;
      this.destinationView.alpha = 0.5;
      this.stage.addViewBefore(this.destinationView, this.boat.getFirstPersonView());
      this.changeDestination(this.destination);
    },
    changeDestination: function(destination) {
      this.destination = destination;
      if (this.destinationView) {
        this.destinationView.x = this.room.getPosition(this).x;
        this.destinationView.y = this.room.getPosition(this).y;
      }
    },
    hit: function(damage) {
      var multiplier = 1;
      if (this.room.isExterior) {
        multiplier = 4;
      }
      var robustness = (this.attributes.strength + this.attributes.stamina) / 2;
      var randomSeed = (robustness + Math.randInt()) / 200;
      var personalDamage = Math.floor(damage * (1 - randomSeed));
      this.model.health -= personalDamage * multiplier;
      if (this.model.health <= 0) {
        this.model.health = 0;
        this.die();
      }
    },
    die: function() {
      this.status = 'dead';
      this.room.removePerson(this);
      this.room = null;
      this.model.die();
    }
  };

  window.boot.models.Person = person;
})();