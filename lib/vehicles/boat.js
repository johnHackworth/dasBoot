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
      this.initView();
      window.boot.currentStage.addNotVisualEntity(this);
    },
    initWeapons: function() {

    },
    initView: function() {},
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
      person.boat = this;
    },
    addStage: function(stage) {
      this.stage = stage;

    },
    getFirstPersonView: function() {
      return this.people[0].view[0];
    },
    adjustUI: function() {
      if (this.selectedHalo) {
        this.selectedHalo.x = this.view.x - 1;
        this.selectedHalo.y = this.view.y - 1;
      }
    },
    select: function() {
      this.selectedHalo = new PIXI.Sprite.fromImage('assets/ui/selected.png');
      this.selectedHalo.width = this.view.width + 2;
      this.selectedHalo.height = this.view.height + 2;
      this.stage.addVisualEntity(this.selectedHalo);
      this.adjustUI();
    },
    unselect: function() {
      this.stage.removeView(this.selectedHalo);
      this.selectedHalo = null;
    }

  };

  window.boot.models.Boat = boat;
})();