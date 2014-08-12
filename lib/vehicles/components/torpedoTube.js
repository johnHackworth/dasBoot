window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var torpedoTube = function(options) {
    this.init(options);
  };
  torpedoTube.prototype = {
    counter: 0,
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
        if (this.torpedoRoom.people[i].isOnDestination()) {
          console.log(i, this.torpedoRoom.people[i].name);
        }
      }
    }
  };

  window.boot.models.TorpedoTube = torpedoTube;
})();