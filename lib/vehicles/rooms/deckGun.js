window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var room = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Room, true, options);
    this.init(options);
  };
  room.prototype = {
    positionAmount: 3,
    type: 'deckGun',
    assets: {
      background: 'assets/rooms/deckGun.png'
    },
  };

  window.boot.models.DeckGunRoom = room;
})();