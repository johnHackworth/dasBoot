window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var portView = function(options) {
    this.stage = options.stage;
    this.y = options.y;
    this.x = options.x;
    this.map = options.map;
    this.port = options.port;

    this.init();
  };
  portView.prototype = {
    markerWidth: 14,
    markerHeight: 14,
    init: function() {
      this.addMarker();
      this.addName();
    },
    addMarker: function() {
      this.marker = new PIXI.Graphics();
      this.marker.beginFill(0x995533);
      this.marker.moveTo(0, -this.markerHeight / 2);
      this.marker.lineTo(this.markerWidth / 2, 0 - this.markerHeight / 2);
      this.marker.lineTo(this.markerWidth / 2, this.markerHeight / 2);
      this.marker.lineTo(-1 * this.markerWidth / 2, this.markerHeight / 2);
      this.marker.lineTo(-1 * this.markerWidth / 2, 0 - this.markerHeight / 2);
      this.marker.lineTo(0, -this.markerHeight / 2);
      this.marker.endFill();
      this.stage.addVisualEntity(this.marker);
      this.moveMarker();
    },
    addName: function() {
      this.portName = this.stage.addText(this.port.name, {
        x: this.marker.x,
        y: this.marker.y + 2 * this.markerHeight / 3,
        fontSize: '10px',
        color: '#333333'
      }, this.destroyables);

      this.portName.x = this.portName.x - this.portName.width / 2;
    },
    moveMarker: function() {
      var tile = this.map.tiles[this.port.sector.x][this.port.sector.y];
      var center = tile.getCenter();
      console.log(center);
      this.marker.x = center.x;
      this.marker.y = center.y;
    }
  };
  window.boot.ui.PortView = portView;
})();