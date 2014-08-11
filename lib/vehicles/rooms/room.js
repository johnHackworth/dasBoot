window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var room = function(options) {
    this.layoutPos = options.layoutPos;
    this.init(options);
  };
  room.prototype = {
    positionAmount: 4,
    type: 'room',
    roomWidth: 90,
    roomHeight: 25,
    viewX: 0,
    viewY: 0,
    assets: {
      background: 'assets/rooms/room.png'
    },
    init: function() {
      this.people = [];
      this.positionWidth = Math.floor(this.roomWidth / this.positionAmount);
    },
    addPerson: function(person) {
      for (var i = 0; i < this.positionAmount; i++) {
        if (!this.people[i]) {

          this.people[i] = person;
          person.room = this;
          break;
        }
      }
    },
    removePerson: function(person) {
      for (var i = 0; i < this.positionAmount; i++) {
        if (this.people[i] === person) {
          this.people[i] = null;
          break;
        }
      }
    },
    hasFreeSpace: function() {
      for (var i = 0; i < this.positionAmount; i++) {
        if (!this.people[i]) {
          return true;
        }
      }
      return false;
    },
    getPosition: function(person) {
      for (var i = 0; i < this.positionAmount; i++) {
        if (this.people[i] === person) {
          return {
            x: 10 + this.viewX + this.positionWidth * i,
            y: this.viewY + this.roomHeight
          };
        }
      }
    },
    addView: function(view) {
      this.view = view;
    }
  };

  window.boot.models.Room = room;
})();