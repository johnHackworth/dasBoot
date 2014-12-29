window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var history = function(options) {
    this.world = options.world;
    this.boat = options.world.player;
    this.init();
  };
  history.prototype = {
    turn: 0,
    init: function() {
      this.pastEvents = [];
      this.currentEvents = [];
      this.randomEventGenerator = new window.boot.models.RandomEventGenerator({
        world: this.world,
        boat: this.boat
      });
    },
    nextTurn: function() {
      this.checkEncounters();
      this.checkRandomEvents();
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
    welcomeMessage: function() {
      var event = new boot.models.Event({
        title: '',
        texts: ['Welcome onboard, captain!', 'Where should we head to?'],
        interlocutor: this.boat.getBiggestRankSailor()
      });
      this.addEvent(event);
    },
    checkEncounters: function() {
      if (this.world.checkPlayerEncounters()) {
        var event = new boot.models.Event({
          actions: {
            close: boot.mainDirector.startBoatView.bind(boot.mainDirector),
          },
          defaultAction: boot.mainDirector.startBoatView.bind(boot.mainDirector),
          title: 'Boat sighted!',
          texts: ['Captain!', 'Our watchers have detected an enemy vessel nearby!'],
          interlocutor: this.boat.getBiggestRankSailor()
        });
        this.addEvent(event);
      }
      if (this.world.isSectorCoastal(this.boat.sector)) {
        this.checkEnemyAssaults();
      }
    },
    checkEnemyAssaults: function() {
      if (Math.randInt() > 95) {
        var event = new boot.models.Event({
          actions: {
            close: boot.mainDirector.startBoatView.bind(boot.mainDirector),
          },
          defaultAction: boot.mainDirector.startBoatView.bind(boot.mainDirector, {
            assault: true
          }),
          title: 'ACHTUNG!',
          texts: ['Captain!', 'We are being raided by enemy commandos!!',
            'They have approached using the darkness',
            'of the night as cover!!!',
            ' We need to fight them!!'
          ],
          interlocutor: this.boat.getBiggestRankSailor()
        });
        this.addEvent(event);
      }
    },
    addCombatResults: function(results) {
      this.boat.influence += results.influence;
      this.boat.reputation += results.reputation;
      this.boat.people.forEach(function(person) {
        person.add('morale', results.reputation * (100 - this.attributes.pacifist) / 100);
      });
    },
    addCombatVictory: function(results) {
      var event = new boot.models.Event({
        actions: {
          close: this.addCombatResults.bind(this, results)
        },
        defaultAction: this.addCombatResults.bind(this, results),
        title: 'VICTORY!',
        texts: ['Sir!', 'Another great battle!', 'The motherland will sing our victory!'],
        interlocutor: this.boat.getBiggestRankSailor()
      });
      this.addEvent(event);
    },
    addCombatRun: function(results) {
      var event = new boot.models.Event({
        actions: {
          close: this.addCombatResults.bind(this, results)
        },
        defaultAction: this.addCombatResults.bind(this, results),
        title: 'Battle Finished!',
        texts: ['Captain!', 'That was close!', 'At least we have made them', 'fight for their lives'],
        interlocutor: this.boat.getBiggestRankSailor()
      });
      this.addEvent(event);
    },
    checkRandomEvents: function() {
      var event = this.randomEventGenerator.getEvent();
      if (event) {
        this.addEvent(event);
      }
    }
  };

  window.boot.models.History = history;
})();