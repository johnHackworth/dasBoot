window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var randomEventGenerator = function(options) {
    this.world = options.world;
    this.stage = options.stage;
    this.boat = options.world.player;
    this.init();
  };
  randomEventGenerator.prototype = {
    init: function() {
      this.events = boot.data.eventCatalog({
        world: this.world,
        boat: this.boat
      });
      this.personEvents = boot.data.personEventCatalog({
        world: this.world,
        boat: this.boat,
        stage: this.stage
      });
    },
    getEvent: function() {
      if (Math.randInt() > 80) {
        var eventData = this.events.getRandom();
        return new boot.models.Event(eventData);
      }
    },
    getEventForPerson: function(person) {
      if (Math.randInt() > 75) {
        var eventData = this.personEvents.getEvent(person);
        if (!eventData || eventData.conditions.bind(this)(person)) {
          return new boot.models.Event(eventData);
        }
      }
    }
  };
  window.boot.models.RandomEventGenerator = randomEventGenerator;
})();