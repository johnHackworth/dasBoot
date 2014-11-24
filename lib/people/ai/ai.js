window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var ai = function(options) {
    this.init(options);
  };
  ai.prototype = {
    init: function(options) {},
    whereToGo: function() {
      console.log('where to go')
      if (this.boat) {
        console.log('finding path')
        var rooms = this.boat.getRooms();
        for (var i = rooms.length; i; i--) {
          if (rooms[i - 1].people.length) {
            return rooms[i - 1];
          }
        }
      }
    },
    tick: function(counter, active) {

    },
    think: function() {
      if ((!this.status || this.status === 'idle') && this.nextDestinations.length === 0) {
        if (this.stance === 'attack') {
          var enemy = this.hasEnemiesOnSight();
          if (enemy) {
            this.enemyTarget = enemy;
            this.status = 'attack';
            console.log('attack');
            return;
          }
        }
        var room = this.whereToGo();
        this.changeRoom(room);
      }
    },
    hasEnemiesOnSight: function() {
      for (var i in this.room.people) {
        if (this.room.people[i] && !this.room.people[i].npc) {
          return this.room.people[i];
        }
      }
      if (this.room.getAdjacentRooms) {
        var adjacentRooms = this.room.getAdjacentRooms();
        for (var j in adjacentRooms) {
          if (adjacentRooms[j]) {
            for (var ii in adjacentRooms[j].people) {
              if (adjacentRooms[j].people[ii] && !adjacentRooms[j].people[ii].npc) {
                return adjacentRooms[j].people[ii];
              }
            }
          }
        }
      }
      return false;

    }
  };

  window.boot.models.personAI = ai;
})();