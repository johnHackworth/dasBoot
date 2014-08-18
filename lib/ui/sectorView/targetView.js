window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var targetView = function(options) {
    this.stage = options.stage;
    this.sea = options.sea;
    this.playerBoat = this.stage.playerBoat;
    this.x = options.x;
    this.y = options.y;
    this.init();
  };
  targetView.prototype = {
    init: function() {},
    changeTarget: function(objetive) {
      var self = this;
      this.objetive = objetive;
      this.clear();
      var distance = this.sea.combatSimulator.getDistance(this.playerBoat, objetive);
      var solution = this.sea.combatSimulator.getFireSolution(this.playerBoat, objetive);
      this.showDistance(distance);
      this.showSolution(solution);
      this.interval = setInterval(function() {
        self.changeTarget.bind(self)(objetive);
      }, 1000);
    },
    clear: function() {
      clearInterval(this.interval);
      if (this.distanceView) {
        this.stage.removeView(this.distanceView);
      }
      if (this.solutionView) {
        this.stage.removeView(this.solutionView);
      }
    },
    showDistance: function(distance) {
      this.distanceView = this.stage.addText('Distance to objetive: ' + distance + 'm.', {
        x: this.x,
        y: this.y,
        fontSize: '15px',
        color: '#333333'
      }, this.destroyables);
    },
    showSolution: function(probability) {
      this.solutionView = this.stage.addText('Hit probability: ' + probability + '%.', {
        x: this.x,
        y: this.y + 20,
        fontSize: '15px',
        color: '#333333'
      }, this.destroyables);
    },

  };
  window.boot.ui.TargetView = targetView;
})();