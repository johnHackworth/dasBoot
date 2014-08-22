window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var room = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Room, true, options);
    this.init(options);
  };
  room.prototype = {
    positionAmount: 2,
    type: 'controlRoom',
    assets: {
      background: 'assets/rooms/controlRoom.png'
    },
    getPosition: function(person) {
      var size = {
        x: person.viewWidth ? person.viewWidth / 2 : 0,
        y: person.viewHeight || 0
      };
      var xPosition = 0;
      if (this.people.indexOf(person) === 0) {
        xPosition = this.viewX + 15;
      }
      if (this.people.indexOf(person) === 1) {
        xPosition = this.viewX + 80;
      }
      return {
        x: xPosition,
        y: this.viewY + this.roomHeight - size.y
      };
    },

  };

  window.boot.models.ControlRoom = room;
})();