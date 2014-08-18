window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var nPerson = 0;
  var person = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.init(options);
    nPerson++;

    this.name = 'person' + nPerson;
  };
  person.prototype = {
    randomSeed: 0,
    viewHeight: 44,
    viewWidth: 22,
    counter: 0,
    name: "",
    assets: {
      views: [{
        front: 'assets/people/head_m_1.png',
        side: 'assets/people/head_m_1_side.png',
        back: 'assets/people/head_m_1_back.png'
      }, {
        front: 'assets/people/head_m_2.png',
        side: 'assets/people/head_m_2_side.png',
        back: 'assets/people/head_m_2_back.png'
      }, {
        front: 'assets/people/head_m_3.png',
        side: 'assets/people/head_m_3_side.png',
        back: 'assets/people/head_m_3_back.png'
      }, {
        front: 'assets/people/head_m_4.png',
        side: 'assets/people/head_m_4_side.png',
        back: 'assets/people/head_m_4_back.png'
      }, {
        front: 'assets/people/head_m_5.png',
        side: 'assets/people/head_m_5_side.png',
        back: 'assets/people/head_m_5_back.png'
      }, ],
      bodies: [{
        standing: 'assets/people/body_m_1.png',
        moving: ['assets/people/body_m_1_side_0.png', 'assets/people/body_m_1_side_1.png', 'assets/people/body_m_1_side_2.png', 'assets/people/body_m_1_side_3.png'],
        working: ['assets/people/body_m_3_back_0.png', 'assets/people/body_m_3_back_1.png', 'assets/people/body_m_3_back_2.png']
      }],
      legs: [{
        standing: 'assets/people/legs_m_1.png',
        moving: ['assets/people/legs_m_1_side_0.png', 'assets/people/legs_m_1_side_1.png', 'assets/people/legs_m_1_side_2.png', 'assets/people/legs_m_1_side_3.png']
      }]
    },
    room: null,
    x: 0,
    y: 0,
    init: function() {
      this.destination = {};
      this.view = [];
      this.randomSeed = Math.randInt(10);
      this.randomizeLook();
      this.attributes = new window.boot.models.PersonAttributes();
      this.workHability = new window.boot.models.WorkHability({
        attributes: this.attributes
      });
    },
    randomizeLook: function() {
      var n = Math.floor(Math.random() * this.assets.views.length);
      this.viewImage = this.assets.views[n];
      n = Math.floor(Math.random() * this.assets.bodies.length);
      this.bodyImage = this.assets.bodies[n];
      n = Math.floor(Math.random() * this.assets.legs.length);
      this.legsImage = this.assets.legs[n];
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
          moving: [],
          working: []
        },
        legs: {
          standing: new PIXI.Texture.fromImage(this.legsImage.standing),
          moving: []

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
      for (i in this.legsImage.moving) {
        var texturelegs = new PIXI.Texture.fromImage(this.legsImage.moving[i]);
        this.textures.legs.moving.push(texturelegs);
      }
    },
    initView: function() {
      this.initTextures();
      var headview = PIXI.Sprite.fromFrame(this.viewImage.front);
      var bodyview = PIXI.Sprite.fromFrame(this.bodyImage.standing);
      var legsview = PIXI.Sprite.fromFrame(this.legsImage.standing);

      headview.originalHeight = this.viewHeight;
      headview.originalWidth = this.viewWidth;
      bodyview.originalWidth = this.viewWidth;
      bodyview.originalHeight = this.viewHeight;
      legsview.originalWidth = this.viewWidth;
      legsview.originalHeight = this.viewHeight;

      this.pos = {
        x: this.room.getPosition(this).x,
        y: this.room.getPosition(this).y
      };
      headview.adjustment = {
        standing: [0, 0],
        moving: [0, 0]
      };

      legsview.adjustment = {
        standing: [0, 0],
        moving: [0, 0]
      };
      legsview.x = this.pos.x;
      legsview.y = this.pos.y;
      bodyview.x = this.pos.x;
      bodyview.y = this.pos.y;
      headview.x = this.pos.x + headview.adjustment.standing[0];
      headview.y = this.pos.y + headview.adjustment.standing[1];

      this.view.push(legsview);
      this.view.push(bodyview);
      this.view.push(headview);

      this.changeDestination(this.room.getPosition(this));
      this.stage.addEntityBefore(this, this.stage.firstAmbient);
    },
    animate: function() {
      if (this.status === 'working') {
        this.animateWork();
      } else {
        this.animateMoving();
      }
    },
    animateMoving: function() {
      var i = null;

      if ((this.counter % 10 === 0 || this.counter % 6 === 0)) {
        var step = (Math.floor(this.counter / 10) + this.randomSeed) % 4;
        var step2 = (Math.floor(this.counter / 6) + this.randomSeed) % 4;
        if (this.isMoving) {
          this.view[1].setTexture(this.textures.head.side);
          this.view[0].setTexture(this.textures.body.moving[step]);
          this.view[2].setTexture(this.textures.legs.moving[step2]);
        } else {
          this.view[1].setTexture(this.textures.head.front);
          this.view[0].setTexture(this.textures.body.standing);
          this.view[2].setTexture(this.textures.legs.standing);
          this.moveView(this.pos.x, this.pos.y);
        }
      }
      if (this.isMovingLeft) {
        // if (this.orientation !== 'left') {
        for (i in this.view) {
          this.view[i].width = -1 * this.view[i].originalWidth;
          this.view[i].height = this.view[i].originalHeight;
          this.view[i].x -= this.view[i].width;
        }
        this.orientation = 'left';
        // }
      } else {
        // if (this.orientation !== 'right') {
        for (i in this.view) {
          this.view[i].width = this.view[i].originalWidth;
          this.view[i].height = this.view[i].originalHeight;
        }
        this.orientation = 'right';
      }
      // }
    },
    animateWork: function() {
      var step = Math.floor(this.counter / 5) % 3;
      var i = null;
      this.view[1].setTexture(this.textures.head.back);
      this.view[0].setTexture(this.textures.body.working[step]);
      this.view[2].setTexture(this.textures.legs.standing);
      this.view[0].x = this.pos.x;

      if (Math.floor(this.counter / 25) % 3 === 0) {
        if (Math.random() < 0.5) {
          this.view[0].width = -1 * this.view[0].originalWidth;
          this.view[0].twisted = true;
        } else {
          this.view[0].width = this.view[0].originalWidth;
          this.view[0].twisted = false;
        }
      }
      if (this.view[0].twisted) {
        this.view[0].x -= this.view[0].width;
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
      }
    },
    changeRoom: function(room) {
      if (room.hasFreeSpace()) {
        this.room.removePerson(this);
        room.addPerson(this);
        this.changeDestination(room.getPosition(this));
      }
    },
    tick: function(counter) {
      this.counter++;
      if (!this.hasArrivedDestination()) {
        this.moveTowardsDestination();
        this.isMoving = true;
      } else {
        this.isMoving = false;
      }
      this.animate();
      this.adjustUI();
      this.clearCounters();
    },
    clearCounters: function() {
      if (this.statusChange && (1 * this.counter - 1 * this.statusChange > 100)) {
        this.status = 'idle';
      }
    },
    moveTowardsDestination: function() {
      this.status = null;
      var moveTo = [this.pos.x, this.pos.y];
      var diffX = this.destination.x - this.pos.x;
      if (diffX) {
        if (diffX < 0) {
          this.isMovingLeft = true;
        } else {
          this.isMovingLeft = false;
        }
        this.pos.x += diffX / Math.abs(diffX);
        moveTo[0] = 1 * this.pos.x;
      } else {
        var diffY = this.destination.y - this.pos.y;
        if (diffY) {
          this.pos.y += diffY / Math.abs(diffY);
          moveTo[1] = 1 * this.pos.y;
        }
      }
      this.moveView(moveTo[0], moveTo[1]);
    },
    hasArrivedDestination: function() {
      // console.log(this.destination, this.pos)
      return this.destination.x == this.pos.x && this.destination.y == this.pos.y;
    },
    isOnDestination: function() {
      var pos = this.room.getPosition(this);
      return (pos.x === this.pos.x) && (this.pos.y === pos.y);
    },
    workAt: function(type) {
      this.status = 'working';
      this.statusChange = this.counter;
      return this.workHability.work(type);
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
        this.destinationView.x = destination.x;
        this.destinationView.y = destination.y;
      }
    }
  };

  window.boot.models.Person = person;
})();