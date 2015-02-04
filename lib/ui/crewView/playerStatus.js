window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var playerStatus = function(options) {
    this.container = options.container;
    this.stage = options.stage;
    this.world = options.world;
    this.player = options.player;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.views = [];
    this.init();
  };
  playerStatus.prototype = {
    init: function() {
      this.refresh();
    },
    refresh: function() {
      this.clear();
      this.paintInfluence();
      this.paintReputation();
      this.paintAlcoholButton();
    },
    clear: function() {
      while (this.views.length) {
        var view = this.views.pop();
        this.container.removeChild(view);
      }
    },
    paintInfluence: function() {
      var view = this.stage.addTextToContainer(this.container,
        'Influence: ' + this.player.influence, {
          x: this.x,
          y: this.y + 10,
          fontSize: '22px',
          fontName: 'specialElite',
          color: '#EFEFEF'
        }, this.destroyables);
      this.views.push(view);
    },
    paintReputation: function() {
      var view = this.stage.addTextToContainer(this.container,
        'Reputation: ' + this.player.reputation, {
          x: this.x,
          y: this.y + 40,
          fontSize: '22px',
          fontName: 'specialElite',
          color: '#EFEFEF'
        }, this.destroyables);
      this.views.push(view);
    },
    paintAlcoholButton: function() {
      this.alcoholButton = new window.boot.ui.Button({
        stage: this.stage,
        width: 130,
        height: 30,
        fontSize: '12px',
        marginY: 10,
        action: this.toggleAlcohol.bind(this),
        x: this.x + 205,
        y: this.y + 90,
        baseTint: this.player.alcoholAllowed ? 0x88FF88 : 0xFF8888,
        text: this.player.alcoholAllowed ? 'Alcohol Allowed' : 'Alcohol forbidden',
        buttonImage: 'assets/buttons/metalButton.png'
      });
      var view = this.stage.addTextToContainer(this.container,
        'Is your crew allowed to drink \nalcohol while on missions?', {
          x: this.x,
          y: this.y + 90,
          fontSize: '11px',
          fontName: 'specialElite',
          color: '#EFEFEF'
        }, this.destroyables);
      this.views.push(view);
    },
    toggleAlcohol: function() {
      this.player.alcoholAllowed = !this.player.alcoholAllowed;
      this.refresh();
    }
  };
  window.boot.ui.PlayerStatus = playerStatus;
})();