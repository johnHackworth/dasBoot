window.boot = window.boot || {};
window.boot.dataModels = window.boot.dataModels || {};

(function() {
  var player = function(options) {
    pixEngine.utils.extend.call(this, boot.dataModels.Boat, true, options);
    this.options = options;
    this.type = options.type;
    this.init();
  };
  player.prototype = {
    init: function() {
      this.name = this.options.name;
      this.path = [];
      this.people = [];
    },
    getPathTo: function(sector, append) {
      if (!append) {
        this.path = [];
      }
      if (!this.path.length || this.path[this.path.length - 1] != sector) {
        this.path.push(sector);
      }
    },
    addPerson: function(person) {
      this.people.push(person);
    }

  };

  window.boot.dataModels.Player = player;
})();