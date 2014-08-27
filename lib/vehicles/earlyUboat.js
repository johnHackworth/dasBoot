window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var submarine = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Submarine, true, options);

  };
  submarine.prototype = {
    sinkingSpeed: 5,
    maxSpeed: 60,
    maxSpeedUnderwater: 30,
    topRoom: 95,
    leftRoom: -330 + window.innerWidth / 2,
    assets: {
      layout: 'assets/vehicles/sub1.png'
    },
    layoutMap: [{
      rooms: [
        null, null, null, {
          type: 'empty',
          doors: ['down'],
          open: true
        },
        null, null
      ]
    }, {
      rooms: [{
        type: 'engine',
        doors: ['left', 'right'],
        open: false
      }, {
        type: 'empty',
        doors: ['left', 'right'],
        open: false
      }, {
        type: 'sleepingQuarters',
        doors: ['left', 'right'],
        open: false
      }, {
        type: 'control',
        doors: ['left', 'right'],
        open: false
      }, {
        type: 'empty',
        doors: ['left', 'right'],
        open: false
      }, {
        type: 'torpedo',
        doors: ['left'],
        open: false
      }]
    }],
    initWeapons: function() {
      this.weapons = {};
      this.weapons.torpedoes = {
        storage: {
          type: 'torpedo1',
          number: 15
        },
        tubes: [
          new boot.models.TorpedoTube({
            stage: this.stage,
            boat: this,
            torpedoRoom: this.layout.rooms[1][5]
          }),
          new boot.models.TorpedoTube({
            stage: this.stage,
            boat: this,
            torpedoRoom: this.layout.rooms[1][5]
          })
        ]
      };
    },
    getGunnerWork: function() {
      if (this.controlRoom.people[0] && this.controlRoom.people[0].isOnDestination()) {
        var gunner = this.controlRoom.people[0];
        return gunner.workAt('target');
      }
      return 0;
    },
    getHelmsmanWork: function() {

      if (this.controlRoom.people[1] && this.controlRoom.people[1].isOnDestination()) {
        var gunner = this.controlRoom.people[1];
        return gunner.workAt('helmsman');
      } else if (!this.controlRoom.people[1] && this.controlRoom.people[0] && this.controlRoom.people[0].isOnDestination()) {
        this.controlRoom.people[1] = this.controlRoom.people[0];
        this.controlRoom.people[0] = null;

        this.controlRoom.people[1].changeDestination(this.controlRoom.getPosition(this.controlRoom.people[1]));
      }
      return 0;
    },
    getMotorPower: function() {
      var work = 1;
      for (var l = this.engineRoom.people.length; l; l--) {
        var person = this.engineRoom.people[l - 1];
        if (person && person.isOnDestination()) {
          personalWork = person.workAt('engine');
          if (work < personalWork) {
            work = personalWork;
          }
        }
      }
      return work;
    },
    getManiovres: function() {
      var helmsmanWork = this.getHelmsmanWork();
      var gunnerWork = 0;
      if (this.controlRoom.people[0] && this.controlRoom.people[0].isOnDestination()) {
        var gunner = this.controlRoom.people[0];
        gunner.hasWorked = false;
        gunnerWork = gunner.workAt('tactical');
        return this.maniovrability * (2 * gunnerWork / 100 + helmsmanWork / 100) / 3;
      }
      return 0;
    }
  };
  window.boot.models.EarlyUboat = submarine;
})();