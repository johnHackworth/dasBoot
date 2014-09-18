window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var shipMarker = function(options) {
    this.stage = options.stage;
    this.ship = options.ship;
    this.y = options.y;
    this.x = options.x;
    this.init();
  };
  shipMarker.prototype = {
    markerWidth: 10,
    markerHeight: 5,
    init: function() {
      this.addMarker();
    },
    addMarker: function() {
      this.marker = new PIXI.Graphics();
      this.marker.beginFill(0x990000);
      this.marker.moveTo(this.x, this.y);
      this.marker.lineTo(this.x + this.markerWidth / 2, this.y);
      this.marker.lineTo(this.x, this.y + this.markerHeight);
      this.marker.lineTo(this.x - this.markerWidth / 2, this.y);
      this.marker.lineTo(this.x, this.y);
      this.marker.endFill();
      this.stage.addVisualEntity(this.marker);
    }
  };
  window.boot.ui.ShipMarker = shipMarker;
})();