window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var ai = function(options) {};
  ai.prototype = {
    whereToGo: function() {
      var isNPC = this.npc;
      if (this.boat) {
        var rooms = this.boat.getRooms();
        for (var i = rooms.length; i; i--) {
          for (var j = rooms[i - 1].people.length; j; j--) {
            var p = rooms[i - 1].people[j - 1];
            if (p && p.npc != isNPC) {
              return rooms[i - 1];
            }
          }
        }
      }
    },
    think: function() {
      if (this.hasEnemiesOnSight()) {
        if (this.stance === 'attack') {
          this.status = 'attack';
        }
      }
      if ((!this.status || this.status === 'idle') &&
        this.nextDestinations.length === 0) {
        var room = this.whereToGo();
        this.changeRoom(room);
      }
    },
    thinkDefense: function() {
      if (this.status === 'attack') {
        var enemy = this.hasEnemiesOnSight();
        if (enemy) {
          this.enemyTarget = enemy;
          return;
        }
      }
    },
    hasEnemiesOnSight: function() {
      var isNPC = this.npc;
      if (!this.room) {
        return false;
      }
      for (var i in this.room.people) {
        if (this.room.people[i] && this.room.people[i].npc != isNPC) {
          return this.room.people[i];
        }
      }
      if (this.room.getAdjacentRooms) {
        var adjacentRooms = this.room.getAdjacentRooms();
        for (var j in adjacentRooms) {
          if (adjacentRooms[j]) {
            for (var ii in adjacentRooms[j].people) {
              if (adjacentRooms[j].people[ii] && isNPC != adjacentRooms[j].people[ii].npc) {
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