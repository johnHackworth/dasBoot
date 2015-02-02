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
    weatherImages: {
      'clear': 'assets/map/sunny.png',
      'foggy': 'assets/map/foggy.png',
      'cloudy': 'assets/map/cloudy.png',
      'storm': 'assets/map/storm.png',
    },
    initialize: function() {
      window.diary = this;
      this.logView = new PIXI.DisplayObjectContainer();
      this.bookBackground = new PIXI.Sprite.fromImage('assets/map/log.png');
      this.logView.x = this.x;
      this.logView.y = this.y;
      this.bookBackground.width = 250;
      this.bookBackground.height = 150;
      this.logView.rotation = -1 * Math.PI / 60;
      // this.stage.addBackground(50, 50, width - 100, height - 200, 0x006099, 1, [], null, false);
      this.logView.addChild(this.bookBackground);
      this.stage.addVisualEntity(this.logView);

      this.textView = new PIXI.DisplayObjectContainer();
      this.logView.addChild(this.textView);

      this.pageContainer = new PIXI.DisplayObjectContainer();
      this.logView.addChild(this.pageContainer);

      this.initializePageTextures();
      this.stage.addNotVisualEntity(this);
    },
    initializePageTextures: function() {
      this.pageTextures = [
        PIXI.Texture.fromImage('assets/map/log-page1.png'),
        PIXI.Texture.fromImage('assets/map/log-page2.png'),
        PIXI.Texture.fromImage('assets/map/log-page3.png'),
        PIXI.Texture.fromImage('assets/map/log-page4.png'),
      ];
      this.pageBackground = new PIXI.Sprite.fromImage('assets/map/log-page1.png');
      this.pageBackground.width = 250;
      this.pageBackground.height = 160;
      this.pageBackground.y = -10;
      this.pageContainer.addChild(this.pageBackground);
      this.pageContainer.visible = false;
    },
    animateStep: function(step) {
      step = step % 4;
      this.pageBackground.setTexture(this.pageTextures[step]);
    },
    paintDate: function() {
      this.addText();
    },
    cleanText: function() {
      if (this.textHour) {
        this.textView.removeChild(this.textHour);
        this.textView.removeChild(this.textDate);
        this.textView.removeChild(this.textWeather);
        this.textView.removeChild(this.weatherView);
      }
    },
    addText: function() {
      this.cleanText();
      this.textView.alpha = 0;
      var hour = this.world.time.getTime() + '-00 hours,';
      this.textHour = this.stage.addTextToContainer(this.textView,
                                                    hour, {
        x: 0+ 15,
        y: 0 + 30,
        fontSize: '18px',
        fontName: 'handwrite',
        color: '#555555',
        center: false
      });
      this.textHour.rotation = -1 * Math.PI / 50;

      var date = this.world.time.getDate();
      var dateArray = date.toDateString().split(' ');

      this.textDate = this.stage.addTextToContainer(this.textView,dateArray[1] +', ' + dateArray[2]  +
       ' of ' +dateArray[3] , {
        x: 15,
        y: 10,
        fontSize: '16px',
        fontName: 'handwrite',
        color: '#555555',
        center: false
      });
      this.textDate.rotation = -1 * Math.PI / 60;

      var sector  = this.world.player.sector;
      this.textWeather = this.stage.addTextToContainer(this.textView,sector.weather.name + ' ' , {
        x: 35,
        y: 50,
        fontSize: '20px',
        fontName: 'handwrite',
        color: '#555555',
        center: true
      });
      this.textWeather.rotation = -1 * Math.PI / 60;


      this.weatherView = new PIXI.Sprite.fromImage(this.weatherImages[
        sector.weather.name
      ]);
      this.weatherView.x = 45;
      this.weatherView.y = 80;
      this.weatherView.rotation = -1 * Math.PI / 60;
      this.textView.addChild(this.weatherView);
    },
    animate: function() {
      this.animationStep = 1;
    },
    tick: function(counter) {
      if(counter % 5 === 0) {
        this.updateTextOpacity();
      }
      if(counter % 3 === 0 && this.animationStep) {
        this.pageContainer.visible = true;
        if(this.animationStep < 5) {
           this.animateStep(this.animationStep - 1);

        } else {
          this.pageContainer.visible = false;
        }
        if(this.animationStep == 5) {
          this.cleanText();
        }
        if(this.animationStep == 10) {
          this.animationStep = 0;
        } else {
          this.animationStep++;
        }
      }

      if(this.updateText && !this.animationStep) {
        this.addText();
        this.updateText = false;
      }
    },
    newPage: function() {
      this.animate();
      this.updateText = true;
    },
    updateTextOpacity: function() {
      if(this.textView.alpha < 1) {
        this.textView.alpha += 0.1;
      }
    }
  };
  window.boot.ui.CaptainLog = captainLog;
})();