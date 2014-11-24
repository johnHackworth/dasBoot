window.boot = window.boot || {};
window.boot.animations = window.boot.animations || {};

window.boot.animations.person = function() {};

window.boot.animations.person.prototype = {
  animate: function() {
    if (this.status === 'working') {
      if (this.sidework) {
        this.animateSideWork();
      } else {
        this.animateWork();
      }
    } else if (this.status === 'fixing') {
      this.animateFix();
    } else if (this.status === 'yawning') {
      this.animateYawning();
    } else if (this.status === 'dead') {
      this.animateDeath();
    } else if (this.status === 'attack') {
      this.animateAttack();
    } else if (this.isMoving) {
      if (this.isClimbing) {
        this.animateClimb();
      } else if (this.isOnBoat) {
        this.animateOnBoat();
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
      this.headContainer.y = -12;
      this.headContainer.x = 7;
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
      this.headContainer.y = -14;
      this.headContainer.x = 7;
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
      this.headContainer.y = -14;
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
      this.headContainer.y = -8;
      this.headContainer.x = 7;
      this.headview.setTexture(this.assets.textures.head[this.model.headType].back);
      this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].back);
      this.bodyview.setTexture(this.assets.textures.body.climbing[bodyStep]);
      this.setFacialFeatures('back');
      this.moveView(this.pos.x, this.pos.y);
    }
  },
  animateAttack: function() {
    if (this.counter % 7 === 0) {
      var attackDirection = 'attack';
      var headDirection = 'side';
      if (this.enemyTarget.view.x < this.view.x) {
        attackDirection = 'attackLeft';
        headDirection = 'sideLeft';
      }
      var bodyStep = (this.counter / 7 + this.randomSeed) % this.assets.textures.body[attackDirection].length;
      if (this.enemyTarget.view.x < this.view.x) {
        this.headContainer.y = -14;
        this.headContainer.x = 14;
      } else {

        this.headContainer.y = -14;
        this.headContainer.x = 5;
      }
      this.headview.setTexture(this.assets.textures.head[this.model.headType][headDirection][0]);
      this.hairview.setTexture(this.assets.textures.hair[this.model.hairType][headDirection]);
      this.bodyview.setTexture(this.assets.textures.body[attackDirection][bodyStep]);

      this.setFacialFeatures('side');
      this.moveView(this.pos.x, this.pos.y);
    }
  },
  animateYawning: function() {
    if (this.counter % 12 === 0) {
      var bodyStep = 8 - this.colorStatusTime;
      this.headContainer.y = -12;
      this.headContainer.x = 7;
      this.headview.setTexture(this.assets.textures.head[this.model.headType].talking[0]);
      this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].standing);
      this.bodyview.setTexture(this.assets.textures.body.standingColor[bodyStep]);
      this.setFacialFeatures('standing');
      this.moveView(this.pos.x, this.pos.y);
      this.colorStatusTime--;
    }
    if (!this.colorStatusTime) {
      this.status = 'idle';
    }
  },
  animateOnBoat: function() {
    var bodyStep = 5; //Math.randInt(this.assets.textures.body.running.length);
    this.headContainer.y = -12;
    this.headContainer.x = 4;
    this.headview.setTexture(this.assets.textures.head[this.model.headType].sideLeft[0]);
    this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].sideLeft);
    this.bodyview.setTexture(this.assets.textures.body.runningLeft[bodyStep]);
    this.setFacialFeatures('sideLeft');
  },

  animateMoving: function(counter) {
    if (this.counter % 6 === 0) {
      var bodyStep = (this.counter / 6 + this.randomSeed) % this.assets.textures.body.running.length;

      if (this.isMovingLeft) {
        this.headContainer.y = -12;
        this.headContainer.x = 4;
        this.headview.setTexture(this.assets.textures.head[this.model.headType].sideLeft[0]);
        this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].sideLeft);
        this.bodyview.setTexture(this.assets.textures.body.runningLeft[bodyStep]);
        this.setFacialFeatures('sideLeft');
      } else {
        this.headContainer.y = -12;
        this.headContainer.x = 9;
        this.headview.setTexture(this.assets.textures.head[this.model.headType].side[0]);
        this.hairview.setTexture(this.assets.textures.hair[this.model.hairType].side);
        this.bodyview.setTexture(this.assets.textures.body.running[bodyStep]);
        this.setFacialFeatures('side');
      }
      this.moveView(this.pos.x, this.pos.y);
    }
  },
};