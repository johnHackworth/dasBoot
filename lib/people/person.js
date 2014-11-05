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
    tintedFeatures: [0, 1, 2, 5, 6],
    sideWorkTasks: ['artillery'],
    isFixer: false,
    air: 100,
    randomSeed: 0,
    viewHeight: 70,
    viewWidth: 56,
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
      this.workHability = new window.boot.models.WorkHability({
        attributes: this.model.attributes
      });
      this.talk = new window.boot.models.Talk({
        stage: this.stage
      });
    },


    initView: function() {
      this.view = new PIXI.DisplayObjectContainer();
      this.headContainer = new PIXI.DisplayObjectContainer();
      this.headview = new PIXI.Sprite(this.assets.textures.head[this.model.headType].standing);
      this.hairview = new PIXI.Sprite(this.assets.textures.hair[this.model.hairType].standing);
      this.hairview.tint = this.model.hairColor;
      this.headview.width = 28;
      this.headview.height = 28;
      this.hairview.width = 28;
      this.hairview.height = 28;
      this.headContainer.addChild(this.headview);
      this.headContainer.addChild(this.hairview);

      this.facialFeaturesView = [];
      for (var i = 0; i < this.model.numberOfFacialFeatures; i++) {
        var featView = new PIXI.Sprite(this.assets.textures.facialFeatures[this.model.facialFeatures[i]].standing);
        this.facialFeaturesView.push(featView);
        featView.width = 28;
        featView.height = 28;
        if (this.tintedFeatures.indexOf(this.model.facialFeatures[i]) >= 0) {
          featView.tint = this.model.hairColor;
        }
        this.headContainer.addChild(featView);
      }

      this.bodyview = new PIXI.Sprite(this.assets.textures.body.standing[0]);
      this.bodyview.width = 70 * 70 / 100;
      this.bodyview.height = 70;

      this.pos = {
        x: this.room.getPosition(this, this.nextDestinations).x,
        y: this.room.getPosition(this, this.nextDestinations).y
      };
      this.currentLevel = this.room.level;

      this.headContainer.x = 11;
      this.headContainer.y = -9;
      this.view.x = this.pos.x;
      this.view.y = this.pos.y;

      this.view.addChild(this.bodyview);
      this.view.addChild(this.headContainer);

      this.changeDestination(this.room.getPosition(this, this.nextDestinations));
      // this.stage.addEntityBefore(this, this.stage.firstAmbient);
      this.stage.addNotVisualEntity(this);

      this.initHealthBar({
        x: this.bodyview.x + 5,
        y: this.bodyview.y - 3,
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
    setFacialFeatures: function(action) {
      for (var i = 0; i < this.model.numberOfFacialFeatures; i++) {
        if (action === 'back') {
          this.facialFeaturesView[i].visible = false;
        } else {
          this.facialFeaturesView[i].visible = true;
          this.facialFeaturesView[i].setTexture(this.assets.textures.facialFeatures[this.model.facialFeatures[i]][action]);
        }
      }
    },
    animateStand: function() {
      if (this.counter % 10 === 0) {
        this.headContainer.y = -9;
        this.headContainer.x = 11;
        this.headview.setTexture(this.assets.textures.head[this.model.headType].standing);
        this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].standing);
        this.bodyview.setTexture(this.assets.textures.body.standing[0]);
        this.setFacialFeatures('standing');
        this.moveView(this.pos.x, this.pos.y);
      }
    },
    animateSideWork: function() {
      if (this.counter % 7 === 0) {
        var bodyStep = (this.counter / 7 + this.randomSeed) % this.assets.textures.body.sideWork.length;
        this.headContainer.y = -10;
        this.headContainer.x = 7;
        this.headview.setTexture(this.assets.textures.head[this.model.headType].side[0]);
        this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].side);
        this.bodyview.setTexture(this.assets.textures.body.sideWork[bodyStep]);
        this.setFacialFeatures('side');
        this.moveView(this.pos.x, this.pos.y);
      }
    },
    animateWork: function() {
      if (this.counter % 10 === 0) {
        var bodyStep = (this.counter / 5 + this.randomSeed) % this.assets.textures.body.working.length;
        this.headContainer.y = -12;
        this.headContainer.x = 11;
        this.headview.setTexture(this.assets.textures.head[this.model.headType].back);
        this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].back);
        this.bodyview.setTexture(this.assets.textures.body.working[bodyStep]);
        this.setFacialFeatures('back');
        this.moveView(this.pos.x, this.pos.y);
      }

    },
    animateFix: function() {
      if (this.counter % 7 === 0) {
        var bodyStep = (this.counter / 7 + this.randomSeed) % this.assets.textures.body.fixing.length;
        this.headContainer.y = -10;
        this.headContainer.x = 7;
        this.headview.setTexture(this.assets.textures.head[this.model.headType].side[0]);
        this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].side);
        this.bodyview.setTexture(this.assets.textures.body.fixing[bodyStep]);

        this.setFacialFeatures('side');
        this.moveView(this.pos.x, this.pos.y);
      }
    },
    animateDeath: function() {
      var headPositions = [
        [11, -9],
        [11, -7],
        [11, -3],
        [11, 5],
        [11, 10],
        [3, 25]
      ];

      this.deadAnimationStep = this.deadAnimationStep || 0;
      if (this.counter % 10 === 0) {
        if (this.deadAnimationStep > 5) {

        } else {
          var bodyStep = this.deadAnimationStep;
          this.headContainer.y = headPositions[bodyStep][1];
          this.headContainer.x = headPositions[bodyStep][0];
          this.headview.setTexture(this.assets.textures.head[this.model.headType].standing);
          if (bodyStep > 4) {
            this.headContainer.pivot.set(48 * bodyStep / 5, 20 * bodyStep / 5);
            this.headContainer.rotation = -1.5 * bodyStep / 5;
          }
          this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].standing);
          this.bodyview.setTexture(this.assets.textures.body.death[bodyStep]);
          this.setFacialFeatures('standing');
          this.moveView(this.pos.x, this.pos.y);
          this.deadAnimationStep++;
        }

      }
    },
    animateClimb: function() {
      if (this.counter % 5 === 0) {
        var bodyStep = (this.counter / 5 + this.randomSeed) % this.assets.textures.body.climbing.length;
        this.headContainer.y = -7;
        this.headContainer.x = 11;
        this.headview.setTexture(this.assets.textures.head[this.model.headType].back);
        this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].back);
        this.bodyview.setTexture(this.assets.textures.body.climbing[bodyStep]);
        this.setFacialFeatures('back');
        this.moveView(this.pos.x, this.pos.y);
      }
    },
    animateMoving: function(counter) {
      if (this.counter % 6 === 0) {
        var bodyStep = (this.counter / 6 + this.randomSeed) % this.assets.textures.body.running.length;

        if (this.isMovingLeft) {
          this.headContainer.y = -10;
          this.headContainer.x = 7;
          this.headview.setTexture(this.assets.textures.head[this.model.headType].sideLeft[0]);
          this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].sideLeft);
          this.bodyview.setTexture(this.assets.textures.body.runningLeft[bodyStep]);
          this.setFacialFeatures('sideLeft');
        } else {
          this.headContainer.y = -10;
          this.headContainer.x = 12;
          this.headview.setTexture(this.assets.textures.head[this.model.headType].side[0]);
          this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].side);
          this.bodyview.setTexture(this.assets.textures.body.running[bodyStep]);
          this.setFacialFeatures('side');
        }
        this.moveView(this.pos.x, this.pos.y);
      }
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
      // for (var i in this.view) {
      // var adjustment = [0, 0];
      // if (this.view[i].adjustment) {
      //   adjustment = this.isMoving ? this.view[i].adjustment.moving : this.view[i].adjustment.standing;
      // }
      // this.view[i].x = x + adjustment[0];
      // this.view[i].y = y + adjustment[1];
      // if (this.isMovingLeft) {
      //   this.view[i].width = -1 * this.view[i].originalWidth;
      //   this.view[i].height = this.view[i].originalHeight;
      //   this.view[i].x -= this.view[i].width;
      // } else {
      //   this.view[i].width = this.view[i].originalWidth;
      //   this.view[i].height = this.view[i].originalHeight;
      // }
      // if (this.isMoving) {
      //   if (this.isMovingLeft) {
      //     this.view[1].x -= 2;
      //   } else {
      //     this.view[1].x += 2;
      //   }
      // }

      // }
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
      this.talk.add('Climbing');
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
      if (this.status != 'dead') {
        this.breadth();
      }

      this.talk.tick(counter, this.pos.x, this.pos.y);
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
          this.talk.warn('The integrity of the hull\n is too low to work here!');
          return;
        }
        if (this.sideWorkTasks.indexOf(type) >= 0) {
          window.sideworker = this;
          this.sidework = true;
        }
        this.status = 'working';
        if (Math.randInt() > 90) {
          this.talk.comment('working on it!');
        }
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
      this.selectedHalo.width = this.view.width;
      this.selectedHalo.height = this.view.height;
      this.view.addChild(this.selectedHalo);
      this.addDestinationView();
    },
    unselect: function() {
      this.view.removeChild(this.selectedHalo);
      this.view.removeChild(this.destinationView);
      this.selectedHalo = null;
    },
    adjustUI: function() {
      if (this.selectedHalo) {
        this.selectedHalo.y = -7;
      }
      this.updateHealthBar(this.pos.x, this.pos.y);
      if (this.status === 'dead') {
        this.setHealthBarVisibility(false);
      }
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
      }
    },
    breadth: function() {
      if (this.room && this.room.waterFill > 75) {
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