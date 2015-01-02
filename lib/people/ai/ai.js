window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var ai = function(options) {};
  ai.prototype = {
    whereToGo: function() {
      if (this.boat) {
        var rooms = this.boat.getRooms();
        for (var i = rooms.length; i; i--) {
          if (this.thereAreEnemiesInRoom(rooms[i - 1])) {
            return rooms[i - 1];
          }
          var adjacentRooms = rooms[i - 1].getAdjacentRooms();
          for (var j in adjacentRooms) {
            if (adjacentRooms[j] && this.thereAreEnemiesInRoom(adjacentRooms[j])) {
              return rooms[i - 1];
            }
          }
        }
      }
    },
    thereAreEnemiesInRoom: function(room) {
      var isNPC = this.npc;
      for (var j = room.people.length; j; j--) {
        var p = room.people[j - 1];
        if (p && p.npc != isNPC) {
          return true;
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
      var enemies = [];
      for (var i in this.room.people) {
        if (this.room.people[i] &&
          this.room.people[i].model.health > 0 &&
          this.room.people[i].hasArrivedDestination() &&
          this.room.people[i].npc != isNPC) {
          enemies.push(this.room.people[i]);
        }
      }
      if (enemies.length) {
        return enemies.getRandom();
      }
      if (this.room.getAdjacentRooms) {
        var adjacentRooms = this.room.getAdjacentRooms();
        for (var j in adjacentRooms) {
          if (adjacentRooms[j]) {
            for (var ii in adjacentRooms[j].people) {
              if (adjacentRooms[j].people[ii] &&
                adjacentRooms[j].people[ii].model.health > 0 &&
                adjacentRooms[j].people[ii].hasArrivedDestination() &&
                isNPC != adjacentRooms[j].people[ii].npc) {
                enemies.push(adjacentRooms[j].people[ii]);
              }
            }
          }
        }
      }
      if (enemies.length) {
        return enemies.getRandom();
      }
      return false;

    }
  };

  window.boot.models.personAI = ai;
})();