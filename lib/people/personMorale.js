window.boot = window.boot || {};
window.boot.extensions = window.boot.extensions || {};

window.boot.extensions.personMorale = function() {};

window.boot.extensions.personMorale.prototype = {
  initMorale: function() {

  },
  checkMorale: function() {
    if (this.model.morale >= 95 && Math.randInt() > 90) {
      this.inspiration = 2;
      this.setMoraleMarker('high');
    } else if (this.model.morale <= 15 && Math.randInt() > 90) {
      this.setMoraleMarker('low');
      this.inspiration = 0.20;
    } else {
      this.inspiration = 1;
    }

  }
};