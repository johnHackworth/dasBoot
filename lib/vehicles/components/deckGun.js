window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var deckGun = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init(options);
  };
  deckGun.prototype = {
    counter: 0,
    effortToLoad: 1000,
    effortLoaded: 1,
    status: 'empty',
    init: function(options) {
      this.boat = options.boat;
      this.deckGunRoom = options.deckGunRoom;
      this.stage = window.boot.currentStage;
      this.stage.addNotVisualEntity(this);
    },
    loadProjectile: function() {
      if (this.status === 'empty') {
        this.status = 'loading';
        this.effortLoaded = 1;
      }
    },
    tick: function(counter, active) {
      if (!active) return;
      this.counter++;

      // console.log(counter % 15  );
      if (this.status === 'loading' && (this.counter % 15 === 0)) {
        this.workOnLoading();
      }
    },
    workOnLoading: function() {
      for (var i = 0, l = this.deckGunRoom.people.length; i < l; i++) {
        if (i > 0) {


          var person = this.deckGunRoom.people[i];
          if (person && person.isOnDestination()) {
            var effort = person.workAt('torpedoes');
            this.effortLoaded += effort * this.deckGunRoom.hullIntegrity / 100;
            var percentage = this.effortLoaded / this.effortToLoad;
            this.trigger('loading', percentage);
            if (this.effortLoaded > this.effortToLoad) {
              this.loadComplete();
              return;
            }
          }
        }
      }
    },
    loadComplete: function() {
      this.status = 'ready';
      this.effortLoaded = this.effortToLoad;
      this.trigger('loaded');
    },
    emptyTube: function() {
      this.status = 'empty';
    }
  };

  window.boot.models.DeckGun = deckGun;
})();