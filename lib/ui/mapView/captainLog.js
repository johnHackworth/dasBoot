window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var captainLog = function(options) {
    this.x = options.x;
    this.y = options.y;
    this.world = options.world;
    this.stage = options.stage;
    this.initialize();
  };
  captainLog.prototype = {
    initialize: function() {
      this.logView = new PIXI.Sprite.fromImage('assets/map/log.png');
      this.logView.x = this.x;
      this.logView.y = this.y;
      this.logView.width = 250;
      this.logView.height = 150;
      this.logView.rotation = -1 * Math.PI / 60;
      // this.stage.addBackground(50, 50, width - 100, height - 200, 0x006099, 1, [], null, false);
      this.stage.addVisualEntity(this.logView  );
    },
    paintDate: function() {
      this.addText(date);
    },
    addText: function(date) {
      if (this.text) {
        this.stage.removeView(this.text);
      }
      var hour = this.world.time.getTime() + '-00 hours,\n sun bright';
      this.text = this.stage.addText(hour, {
        x: this.x + 135,
        y: this.y + 10,
        fontSize: '15px',
        fontName: 'handwrite',
        color: '#555555',
        center: false
      });
      this.text.rotation = -1 * Math.PI / 50;

      // this.text = this.stage.addText(this.world.time.getTime() + ':00', {
      //   x: this.x + 60,
      //   y: this.y + 20,
      //   fontSize: '16px',
      //   fontName: 'specialElite',
      //   color: '#EEEEEE'
      // });
    }
  };
  window.boot.ui.CaptainLog = captainLog;
})();