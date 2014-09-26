window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var targetView = function(options) {
    this.stage = options.stage;
    this.sea = options.sea;
    this.playerBoat = this.stage.playerBoat;
    this.x = window.boot.config.width - 220;
    this.y = 10;
    this.width = 210;
    this.height = 230;
    this.init();
  };
  targetView.prototype = {
    assets: {
      background: 'assets/buttons/paper.png'
    },
    init: function() {
      this.addPannel();
    },
    changeTarget: function(objetive) {
      var self = this;
      this.objetive = objetive;
      this.clear();
      this.backPannel.visible = true;
      var distance = this.sea.combatSimulator.getDistance(this.playerBoat, objetive);
      var solution = this.sea.combatSimulator.getFireSolution(this.playerBoat, objetive);
      var artilleryChance = this.sea.combatSimulator.getAccuracyToTarget(this.playerBoat, objetive);
      this.showSillouette();
      this.showDistance(distance);
      this.showArtillery(artilleryChance);
      this.showSolution(solution);
      this.showTactical();
      this.interval = setInterval(function() {
        self.changeTarget.bind(self)(objetive);
      }, 1000);
    },
    addPannel: function() {
      this.backPannel = new PIXI.Sprite.fromImage(this.assets.background);
      this.backPannel.position.x = this.x;
      this.backPannel.position.y = this.y;
      this.backPannel.height = this.height;
      this.backPannel.width = this.width;
      this.stage.addVisualEntity(this.backPannel);
      this.backPannel.visible = false;
    },
    clear: function() {
      clearInterval(this.interval);
      while (this.destroyables && this.destroyables.length) {
        var destroyable = this.destroyables.pop();
        this.stage.removeView(destroyable);
        destroyable = null;
      }
      this.destroyables = [];
      this.backPannel.visible = false;

    },
    showSillouette: function() {
      this.sillouette = new PIXI.Sprite.fromImage(this.objetive.assets.side);
      this.sillouette.scale.set(0.2, 0.2);
      this.sillouette.position.x = this.x + ((this.width - this.sillouette.width) / 2);
      this.sillouette.position.y = this.y + 10;
      this.sillouette.tint = 0x333333;
      this.stage.addVisualEntity(this.sillouette);
    },
    showDistance: function(distance) {
      this.distanceView = this.stage.addText('Distance ' + distance + 'm.', {
        x: this.x + 10,
        y: this.y + 70,
        fontSize: '10px',
        color: '#555555'
      }, this.destroyables);
    },
    showArtillery: function(probability) {
      this.solutionView = this.stage.addText('Gun hit probability: ' + probability + '%.', {
        x: this.x + 10,
        y: this.y + 85,
        fontSize: '10px',
        color: '#333333'
      }, this.destroyables);
    },
    showSolution: function(probability) {
      this.solutionView = this.stage.addText('Torpedo hit probability: ' + probability + '%.', {
        x: this.x + 10,
        y: this.y + 100,
        fontSize: '10px',
        color: '#333333'
      }, this.destroyables);
    },
    showTactical: function() {
      this.tacticalPositionView = this.stage.addText('Tactical: Attack:' +
        Math.floor(this.objetive.positionalAdvantageAttack) + '%.  Defense:' +
        Math.floor(this.objetive.positionalAdvantageDefense) + '%', {
          x: this.x + 10,
          y: this.y + 115,
          fontSize: '10px',
          color: '#777777'
        }, this.destroyables);

      var textLocate = this.objetive.enemyLocated ? 'They have located us' : 'They are looking for us';
      if (!this.objetive.lookingForEnemies) {
        textLocate = 'They aren\'t looking for enemies';
      }
      this.locatedView = this.stage.addText(textLocate, {
        x: this.x + 10,
        y: this.y + 130,
        fontSize: '10px',
        color: '#666666'
      }, this.destroyables);
    },
    hide: function() {
      this.clear();
    },
    show: function() {
      if (this.objetive) {
        this.changeTarget(this.objetive);
      }
    }
  };
  window.boot.ui.TargetView = targetView;
})();