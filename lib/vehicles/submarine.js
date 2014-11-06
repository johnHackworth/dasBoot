window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var submarine = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Boat, true, options);
  };
  submarine.prototype = {
    type: 'submarine',
    assets: {
      layout: 'assets/vehicles/sub1.png'
    },
    applyRedLighting: function() {
      for (var i in this.layout.rooms) {
        for (var j in this.layout.rooms[i]) {
          if (this.layout.rooms[i][j]) {
            this.layout.rooms[i][j].applyRedLighting();
          }
        }
      }
    },
    applyWhiteLighting: function() {
      for (var i in this.layout.rooms) {
        for (var j in this.layout.rooms[i]) {
          if (this.layout.rooms[i][j]) {
            this.layout.rooms[i][j].applyWhiteLighting();
          }
        }
      }
    },
    hitByDeepCharge: function(deepCharge) {
      if (deepCharge.distance > 500) {
        return;
      }
      if (Math.abs(deepCharge.deep - this.deep) > 30) {
        return;
      }

      var maxDamageTotal = deepCharge.explosiveAmount;
      var maxDamage = maxDamageTotal * deepCharge.distance / 500;
      maxDamage = maxDamage * Math.abs(deepCharge.deep - this.deep) / 30;
      var rooms = this.getRooms();
      for (var i = 0, l = rooms.length; i < l; i++) {
        var damage = Math.randInt(maxDamage);
        rooms[i].hullIntegrity -= damage;
        rooms[i].hitPeople(damage);
      }
      if (maxDamageTotal > (deepCharge.explosiveAmount / 2)) {
        return 2;
      }
      if (maxDamageTotal > (deepCharge.explosiveAmount / 3)) {
        return 1;
      }
      return 0;
    },
  };

  window.boot.models.Submarine = submarine;
})();