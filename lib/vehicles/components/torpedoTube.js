window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var torpedoTube = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init(options);
  };
  torpedoTube.prototype = {
    counter: 0,
    effortToLoad: 4000,
    effortLoaded: 0,
    status: 'empty',
    init: function(options) {
      this.boat = options.boat;
      this.torpedoRoom = options.torpedoRoom;
      this.stage = window.boot.currentStage;
      this.stage.addNotVisualEntity(this);
    },
    loadTorpedo: function() {
      if (this.status === 'empty') {
        if (this.boat.weapons.torpedoes.storage.number) {
          this.boat.weapons.torpedoes.storage.number--;
          this.status = 'loading';
          this.effortLoaded = 0;
        } else {
          this.trigger('noTorpedoes');
          console.log('no torpedoes');
        }
      }
    },
    unloadTorpedo: function() {
      if (this.status === 'loading' || this.status.loaded) {
        this.boat.weapons.torpedoes.storage.number++;
        this.status = 'empty';
        this.effortLoaded = 0;
      } else {
        this.trigger('noTorpedo');
        console.log('no torpedo');
      }
    },

    tick: function() {
      this.counter++;

      // console.log(counter % 15  );
      if (this.status === 'loading' && (this.counter % 15 === 0)) {
        this.workOnLoading();
      }
    },
    workOnLoading: function() {
      for (var i in this.torpedoRoom.people) {
        var person = this.torpedoRoom.people[i];
        if (person && person.isOnDestination()) {
          var effort = person.workAt('torpedoes');
          this.effortLoaded += effort;
          var percentage = this.effortLoaded / this.effortToLoad;
          this.trigger('loading', percentage);
          if (this.effortLoaded > this.effortToLoad) {
            this.loadComplete();
            return;
          }
        }
      }
    },
    loadComplete: function() {
      this.status = 'ready';
      this.effortLoaded = this.effortToLoad;
      this.trigger('loaded');
    }
  };

  window.boot.models.TorpedoTube = torpedoTube;
})();