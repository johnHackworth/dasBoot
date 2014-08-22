window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var cannon = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init(options);
  };
  cannon.prototype = {
    counter: 0,
    effortToLoad: 1000,
    effortLoaded: 0,
    status: 'empty',
    init: function(options) {
      this.boat = options.boat;
      this.position = options.position;
      this.stage = window.boot.currentStage;
      this.stage.addNotVisualEntity(this);
    },
    load: function() {
      if (this.status === 'empty') {
        this.status = 'loading';
        this.effortLoaded = 0;
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
      var effort = this.boat.effortPerTurn || 1;
      this.effortLoaded += effort;
      var percentage = this.effortLoaded / this.effortToLoad;
      this.trigger('loading', percentage);
      if (this.effortLoaded > this.effortToLoad) {
        this.loadComplete();
        return;
      }
    },
    loadComplete: function() {
      this.status = 'ready';
      this.effortLoaded = this.effortToLoad;
      this.trigger('loaded');
    }
  };

  window.boot.models.Cannon = cannon;
})();