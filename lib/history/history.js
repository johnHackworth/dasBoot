window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var history = function(options) {
    this.init();
    this.world = options.world;
    this.boat = options.world.player;
  };
  history.prototype = {
    turn: 0,
    init: function() {
      this.pastEvents = [];
      this.currentEvents = [];
    },
    nextTurn: function() {
      this.checkEncounters();
    },
    addEvent: function(event) {
      this.currentEvents.push(event);
    },
    getEvent: function() {
      if (this.currentEvents.length) {
        var ev = this.currentEvents.shift();
        this.pastEvents.push(ev);
        return ev;
      } else {
        return null;
      }
    },
    checkEncounters: function() {
      if (this.world.checkPlayerEncounters()) {
        var event = new boot.models.Event({
          actions: {
            close: boot.mainDirector.starBoatView.bind(boot.mainDirector),
          },
          defaultAction: boot.mainDirector.starBoatView.bind(boot.mainDirector),
          title: 'Boat sighted!',
          texts: ['Captain!', 'Our watchers have detected an enemy vessel nearby!']
        });
        this.addEvent(event);
      }
      if (this.world.isSectorCoastal(this.boat.sector)) {
        this.checkEnemyAssaults();
      }
    },
    checkEnemyAssaults: function() {
      if (Math.randInt() > 8) {
        var event = new boot.models.Event({
          actions: {
            close: boot.mainDirector.starBoatView.bind(boot.mainDirector),
          },
          defaultAction: boot.mainDirector.starBoatView.bind(boot.mainDirector, {
            assault: true
          }),
          title: 'ACHTUNG!',
          texts: ['Captain!', 'We are being raided by enemy commandos!!',
            'They have approached using the darkness',
            'of the night as cover!!!',
            ' We need to fight them!!'
          ]
        });
        this.addEvent(event);
      }
    }
  };

  window.boot.models.History = history;
})();