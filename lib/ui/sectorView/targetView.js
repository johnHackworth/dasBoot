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
      this.showTactical();
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
      if (this.tacticalPositionView) {
        this.stage.removeView(this.tacticalPositionView);
      }
      if (this.locatedView) {
        this.stage.removeView(this.locatedView);
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
    showTactical: function() {
      this.tacticalPositionView = this.stage.addText('Tactical: Attack:' +
        Math.floor(this.objetive.positionalAdvantageAttack) + '%.  Defense:' +
        Math.floor(this.objetive.positionalAdvantageDefense) + '%', {
          x: this.x + 200,
          y: this.y + 20,
          fontSize: '15px',
          color: '#FFFFFF'
        }, this.destroyables);
      this.locatedView = this.stage.addText(this.objetive.enemyLocated ? 'They have located us' : 'They have NOT located us', {
        x: this.x + 250,
        y: this.y,
        fontSize: '13px',
        color: '#FFFFFF'
      }, this.destroyables);
    },
  };
  window.boot.ui.TargetView = targetView;
})();