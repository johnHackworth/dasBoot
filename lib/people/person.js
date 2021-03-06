window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var nPerson = 0;
  var person = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    pixEngine.utils.extend.call(this, window.boot.animations.person);
    pixEngine.utils.extend.call(this, window.boot.extensions.personMorale, true, options);
    pixEngine.utils.extend.call(this, window.boot.extensions.personDecoration, true, options);
    pixEngine.utils.extend.call(this, window.boot.models.personAI, true, options);
    this.model = options.model;
    this.stage = options.stage;
    if (!this.model.npc && this.stage) {
      this.boat = this.stage.playerBoat;
    }
    this.comments = new window.boot.models.Comments();
    this.init(options);
    nPerson++;
  };
  person.prototype = {
    tintedFeatures: [0, 1, 4, 5, 6, 10],
    sideWorkTasks: ['artillery'],
    isFixer: false,
    inspiration: 1,
    air: 100,
    randomSeed: 0,
    viewHeight: 60,
    viewWidth: 45,
    counter: 0,
    assets: boot.assets.person,
    room: null,
    x: 0,
    y: 0,
    init: function(options) {
      this.name = this.model.name;
      this.destination = {};
      this.nextDestinations = [];
      this.view = [];
      this.x = options.x || this.x;
      this.y = options.y || this.y;
      this.pos = {
        x: this.x,
        y: this.y
      };
      this.randomSeed = Math.randInt(10);
      this.initMorale();
      this.workHability = new window.boot.models.WorkHability({
        attributes: this.model.attributes,
        person: this
      });
    },
    getPosition: function() {
      return this.room.getPosition(this, this.nextDestinations);
    },
    getLevel: function() {
      return this.room ? this.room.level : 0;
    },
    initView: function(extContainer) {
      this.view = new PIXI.DisplayObjectContainer();
      if (extContainer) {
        this.talkContainer = new PIXI.DisplayObjectContainer();
        this.talk = new window.boot.models.Talk({
          stage: this.stage,
          container: this.talkContainer,
          person: this
        });
        extContainer.addChild(this.talkContainer);
      }
      this.extContainer = extContainer || this.view;
      this.headContainer = new PIXI.DisplayObjectContainer();
      this.headview = new PIXI.Sprite(this.assets.textures.head[this.model.headType].standing);
      this.hairview = new PIXI.Sprite(this.assets.textures.hair[this.model.hairType].standing);
      this.hairview.tint = this.model.hairColor;
      this.headview.width = 28;
      this.headview.height = 28;
      this.hairview.width = 29;
      this.hairview.height = 29;
      this.headContainer.addChild(this.headview);
      this.headContainer.addChild(this.hairview);

      this.facialFeaturesView = [];
      for (var i = 0; i < this.model.numberOfFacialFeatures; i++) {
        var featView = new PIXI.Sprite(this.assets.textures.facialFeatures[this.model.facialFeatures[i]].standing);
        this.facialFeaturesView.push(featView);
        featView.width = 29;
        featView.height = 29;
        if (this.tintedFeatures.indexOf(this.model.facialFeatures[i]) >= 0) {
          featView.tint = this.model.hairColor;
        }
        this.headContainer.addChild(featView);
      }

      this.bodyview = new PIXI.Sprite(this.assets.textures.body.standing[0]);
      this.bodyview.width = 70 * 60 / 100;
      this.bodyview.height = 60;

      this.pos = {
        x: this.getPosition().x,
        y: this.getPosition().y
      };
      this.currentLevel = this.getLevel();

      this.headContainer.x = 7;
      this.headContainer.y = -12;
      this.view.x = this.pos.x;
      this.view.y = this.pos.y;

      this.view.addChild(this.bodyview);
      this.view.addChild(this.headContainer);
      this.view.addChild(this.talkContainer);
      this.changeDestination(this.getPosition(this, this.nextDestinations));
      this.stage.addNotVisualEntity(this);

      this.healthBar = new pixEngine.components.HealthBar({
        x: this.bodyview.x + this.view.width / 2 - 10,
        y: this.bodyview.y - 15,
        width: 20,
        height: 3,
        attribute: 'health',
        origin: this.model,
        container: this.view,
        stage: this.stage
      });

      this.moraleBar = new pixEngine.components.HealthBar({
        x: this.bodyview.x + this.view.width / 2 - 10,
        y: this.bodyview.y - 12,
        width: 20,
        height: 3,
        attribute: 'morale',
        origin: this.model,
        color: 0x5588CC,
        container: this.view,
        stage: this.stage
      });
      this.initMoraleMarker();
    },

    getFace: function() {
      var headContainer = new PIXI.DisplayObjectContainer();
      var headview = new PIXI.Sprite(this.assets.textures.head[this.model.headType].standing);
      var hairview = new PIXI.Sprite(this.assets.textures.hair[this.model.hairType].standing);
      hairview.tint = this.model.hairColor;

      headContainer.addChild(headview);
      headContainer.addChild(hairview);

      for (var i = 0; i < this.model.numberOfFacialFeatures; i++) {
        var featView = new PIXI.Sprite(this.assets.textures.facialFeatures[this.model.facialFeatures[i]].standing);
        if (this.tintedFeatures.indexOf(this.model.facialFeatures[i]) >= 0) {
          featView.tint = this.model.hairColor;
        }
        headContainer.addChild(featView);
      }
      return headContainer;
    },
    moveView: function(x, y) {
      this.view.x = x; // - Math.floor(this.bodyview.width / 4);
      this.view.y = y;

    },
    changeRoom: function(room) {
      if (room.hasFreeSpace()) {
        var path = [room];
        var boat = this.stage.playerBoat;
        if (this.room && this.room.type) {
          path = boat.layout.getPath(this.room, room);
          this.room.removePerson(this);
        }
        room.addPerson(this);
        this.nextDestinations = this.nextDestinations.concat(path);
        this.model.room = {
          x: room.order,
          y: room.level
        };
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
        this.nextDestinations.push(stairs);
        this.nextDestinations.push(room);
      } else {
        var otherLevelStairs = room.getStairsWell();
        this.climbStairs(otherLevelStairs, true);
        this.nextDestinations.push(room);
      }
    },
    climbStairs: function(room, notAssignPosition) {
      if (this.talk) this.talk.add('Climbing');
      this.changeDestination(room.getPosition(this));
    },
    tick: function(counter, active) {
      if (!active) return;
      this.counter++;
      if (counter % 100 === 0 && Math.randInt() > 80) {
        this.checkMorale();
      }
      this.workHability.hasWorked = false;
      this.animate();
      if (!this.hasArrivedDestination()) {
        this.moveTowardsDestination();
        this.isMoving = true;
      } else {
        if (this.nextDestinations.length > 0) {
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
          if (this.isFighter) {
            this.status = 'attack';
          }
        }
      }

      this.adjustUI(counter);
      this.clearCounters();
      if (this.status != 'dead') {
        this.breadth();
      }
      if (this.status === 'attack' && counter % 60 === 0) {
        this.attackEnemy();
      }

      if (this.talk) {
        this.talk.tick(counter, this.pos.x, this.pos.y);
      }
      if ((this.status === 'idle' || !this.status) && Math.randInt(2000) > 1998) {
        this.status = 'yawning';
        this.colorStatusTime = 8;
      }
      if ((this.status === 'idle' || !this.status) && this.talk && Math.randInt(3000) > 2998) {
        this.talk.warn(this.comments.idle.getRandom());
      }


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
      if (!this.destination) {
        return true;
      }
      // console.log(this.destination, this.pos)
      return Math.abs(this.destination.x - this.pos.x) < 4 && Math.abs(this.destination.y - this.pos.y) < 4;
    },
    isOnDestination: function() {
      return this.hasArrivedDestination();
    },
    workAt: function(type) {
      if (this.status != 'fixing' &&
        this.status != 'attack' &&
        this.status != 'dead') {
        if (this.room.hullIntegrity < 40 && this.talk) {
          this.talk.warn('The integrity of the hull is too low to work here!');
          return;
        }
        if (this.sideWorkTasks.indexOf(type) >= 0) {
          this.sidework = true;
        }
        this.status = 'working';
        if (Math.randInt() > 98 && this.talk) {

          this.talk.comment(this.getComment(type));
        }
        this.statusChange = this.counter;
        return this.workHability.work(type) * this.room.hullIntegrity / 100;
      }
      return 0;
    },
    getComment: function(workType) {
      return this.comments.getWorkComment();
    },
    fix: function(room) {
      this.status = 'fixing';
      this.statusChange = this.counter;
      var fixing = this.workHability.work('fixing');
      room.fix(fixing / 100);
    },
    attackEnemy: function() {
      this.thinkDefense();
      if (this.enemyTarget && this.enemyTarget.model.health > 0) {
        if (this.enemyTarget.isInAdjacentRoom(this)) {
          this.shootMachineGun(this.enemyTarget);
        } else {
          this.enemyTarget = null;
          this.status = 'idle';
        }
      } else {
        this.enemyTarget = null;
        this.status = 'idle';
      }
      return;
    },
    isInAdjacentRoom: function(person) {
      if (!this.room) {
        return false;
      }
      var adjacent = this.room.getAdjacentRooms();
      if (person.room === this.room || adjacent.indexOf(person.room) >= 0) {
        return true;
      }
      return false;
    },
    shootMachineGun: function(enemy) {
      var machineGunWork = this.workHability.work('machineGun');
      if (Math.randInt() < machineGunWork) {
        enemy.model.health -= 10;
      }
      this.showMachineGunSparks();
    },

    addDestinationView: function() {
      this.destinationView = new PIXI.Sprite.fromImage('assets/ui/destination.png');
      // this.destinationView.width = this.view.width;
      // this.destinationView.height = this.view.height;
      // this.destinationView.alpha = 0.5;
      this.view.addChild(this.destinationView);
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
      var robustness = (this.model.attributes.strength + this.model.attributes.stamina) / 2;
      var randomSeed = (robustness + Math.randInt()) / 200;
      var personalDamage = Math.floor(damage * (1 - randomSeed));
      this.model.health -= personalDamage * multiplier;

    },
    die: function() {
      if (this.status != 'dead') {
        this.status = 'dead';
        if (this.room) {
          this.room.removePerson(this);
          this.room = null;
        }
        this.model.die();
        this.view.interactive = false;
        this.healthBar.hide();
        this.moraleBar.hide();
        if (this.boat) {
          this.boat.removePerson(this);
        }
      }
    },
    breadth: function() {
      if (this.room && this.room.isFullOfWater()) {
        this.air -= 0.5 + 0.5 * (100 - this.model.attributes.stamina) / 100;
        if (this.air <= 0) {
          this.air = 0;
          this.model.health -= 0.3;
        }
      }
      if (this.model.health <= 0) {
        this.model.health = 0;
        this.die();
      }
    }
  };

  window.boot.models.Person = person;
})();