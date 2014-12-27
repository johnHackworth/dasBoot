window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var randomEventGenerator = function(options) {
    this.world = options.world;
    this.boat = options.world.player;
    this.init();
  };
  randomEventGenerator.prototype = {
    init: function() {
      this.events = boot.data.eventCatalog({
        world: this.world,
        boat: this.boat
      });
    },
    getEvent: function() {
      if (Math.randInt() > 10) {
        var eventData = this.events.getRandom();
        return new boot.models.Event(eventData);
      }
    }
  };
  window.boot.models.RandomEventGenerator = randomEventGenerator;
})();