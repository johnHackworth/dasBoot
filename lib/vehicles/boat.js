window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var boat = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Vehicle, true, options);
    this.init(options);
  };
  boat.prototype = {
    type: 'boat',
    layoutMap: [],
    topRoom: 0,
    leftRoom: 0,
    assets: {
      layout: 'assets/vehicles/warship1.png'
    },
    init: function(options) {
      this.people = [];
      this.stage = options.stage;
      this.layout = new window.boot.models.ShipLayout({
        boat: this,
        layout: this.layoutMap
      });
      this.initWeapons();
      window.boot.currentStage.addNotVisualEntity(this);
    },
    initWeapons: function() {

    },
    tick: function() {

    },
    addPerson: function(person) {
      this.people.push(person);
      var freeRoom = null;
      for (var i in this.layout.rooms) {
        for (var j in this.layout.rooms[i]) {
          if (this.layout.rooms[i][j] && this.layout.rooms[i][j].hasFreeSpace()) {
            freeRoom = this.layout.rooms[i][j];
            break;
          }
        }
      }
      freeRoom.addPerson(person);
      person.pos = freeRoom.getPosition(person);
    },
    addStage: function(stage) {
      this.stage = stage;

    }

  };

  window.boot.models.Boat = boat;
})();