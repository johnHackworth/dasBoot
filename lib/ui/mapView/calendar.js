window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var calendar = function(options) {
    this.x = options.x;
    this.y = options.y;
    this.world = options.world;
    this.stage = options.stage;
    this.initialize();
  };
  calendar.prototype = {
    initialize: function() {

    },
    paintDate: function() {
      var date = this.world.time.getDate();
      this.addText(date);
    },
    addText: function(date) {
      if (this.text) {
        this.stage.removeView(this.text);
      }
      this.text = this.stage.addText(date.toDateString() + ' ' + this.world.time.getTime() + ':00', {
        x: this.x,
        y: this.y + 14,
        fontSize: '16px',
        fontName: 'specialElite',
        color: '#EEEEEE'
      });
    }
  };
  window.boot.ui.Calendar = calendar;
})();