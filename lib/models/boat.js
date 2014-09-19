window.boot = window.boot || {};
window.boot.dataModels = window.boot.dataModels || {};

(function() {
  var boat = function(options) {
    this.options = options;
    this.type = options.type;
    this.world = options.world;
    this.init();
  };
  boat.prototype = {
    init: function() {
      this.path = [];
      this.name = this.options.name;
    },
    think: function() {
      if (Math.randInt() > 80) {
        var xVar = 1 - Math.randInt(3);
        var yVar = 1 - Math.randInt(3);
        var destX = this.sector.x + xVar;
        var destY = this.sector.y + yVar;
        if (this.world.sectors[destX] &&
          this.world.sectors[destX][destY] &&
          xVar &&
          yVar
        ) {
          console.log(this.sector.x, this.sector.y, destX, destY)
          this.path.push(this.world.sectors[destX][destY]);
        }
      }
      this.chooseDestination();
    },
    chooseDestination: function() {
      if (!this.destination && this.path.length > 0) {
        this.destination = this.path.shift();

        console.log(this.destination);
      }
    }
  };

  window.boot.dataModels.Boat = boat;
})();