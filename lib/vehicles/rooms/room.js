window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var room = function(options) {
    this.layoutPos = options.layoutPos;

  };
  room.prototype = {
    type: 'room',
    assets: {
      background: 'assets/rooms/room.png'
    },
    init: function() {}
  };

  window.boot.models.Room = room;
})();