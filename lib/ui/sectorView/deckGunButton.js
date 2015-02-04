window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var deckGunButton = function(options) {

    pixEngine.utils.extend.call(this, boot.ui.TorpedoButton, true, options);
  };
  deckGunButton.prototype = {
    addTitle: function() {
      this.tubename = this.stage.addTextToContainer(this.container, 'Deck Gun', {
        x: this.x,
        y: this.y + 12,
        fontSize: '10px',
        color: '#333333'
      }, this.destroyables);
    },
    load: function() {
      this.clear();
      this.paintProgress();
      this.tube.loadProjectile();
    },
  };
  window.boot.ui.DeckGunButton = deckGunButton;
})();