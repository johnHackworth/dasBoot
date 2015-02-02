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
      this.backgroundCalendar = new PIXI.Sprite.fromImage('assets/objects/calendar.png');
      this.backgroundCalendar.x = 30;
      this.backgroundCalendar.y = 5;
      this.backgroundCalendar.width = 80;
      this.backgroundCalendar.height = 95;
      this.backgroundCalendar.rotation = Math.PI / 30;
      // this.stage.addBackground(50, 50, width - 100, height - 200, 0x006099, 1, [], null, false);
      this.stage.addVisualEntity(this.backgroundCalendar  );
    },
    paintDate: function() {
      var date = this.world.time.getDate();
      this.addText(date);
    },
    addText: function(date) {
      if (this.textDate) {
        this.stage.removeView(this.clock);
        this.stage.removeView(this.textDate);
      }
      var dateArray = world.time.getDate().toDateString().split(' ');
      this.textDate = this.stage.addText(' '+dateArray[2] + '\n' + dateArray[1], {
        x: this.x - 2,
        y: this.y + 20,
        fontSize: '30px',
        fontName: 'germania',
        color: '#663333',
        center: true
      });
      this.textDate.rotation = Math.PI / 30;

      this.clock = new PIXI.Sprite.fromImage('assets/objects/clock12.png');
      this.clock.x = 115;
      this.clock.y = 15;
      this.clock.width = 50;
      this.clock.height = 50;
      this.clock.tint = 0xEEEEEE;
      // this.stage.addBackground(50, 50, width - 100, height - 200, 0x006099, 1, [], null, false);
      this.stage.addVisualEntity(this.clock);

      // this.text = this.stage.addText(this.world.time.getTime() + ':00', {
      //   x: this.x + 60,
      //   y: this.y + 20,
      //   fontSize: '16px',
      //   fontName: 'specialElite',
      //   color: '#EEEEEE'
      // });
    }
  };
  window.boot.ui.Calendar = calendar;
})();