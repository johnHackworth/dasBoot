window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var talk = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.container = options.container;
    this.person = options.person;
    this.init();
  };
  talk.prototype = {
    colors: [0xFFFF88, 0xFFEE80, 0xEEFF80, 0XFEFE80, 0xEFEF80, 0xEFEE80, 0xEEEF83, 0xFFFF77, 0xFFFF66],
    lastNotify: -1000,
    elements: [],
    assets: "assets/objects/balloon.png",
    init: function() {
      this.elements = [];
      this.background = new PIXI.Sprite.fromImage(this.assets);
      this.background.width = 100;
      this.background.height = 55;
      this.background.x = 0;
      this.background.y = 0;
    },
    add: function(text, type) {
      if (!type) {
        type = 'warning';
      }
      if (!this.isRepeated(text, type)) {
        this.elements.push({
          value: text,
          type: type
        });
      }
    },
    isRepeated: function(text, type) {
      if (this.elements.length) {
        var last = this.elements.getLast();
        if (last.value === text && last.type === type) {
          return true;
        }
      } else {
        if (this.currentText) {
          if (this.currentText.notification.value === text && this.currentText.notification.type === type) {
            return true;
          }
        }
      }
      return false;
    },
    tick: function(counter, x, y) {
      if (this.elements.length > 0 && counter - this.lastNotify > 300) {
        var notification = this.elements.shift();
        this.showNotification(notification, x, y);
        this.lastNotify = counter;
      }
      this.moveNotification(x, y);
      this.timeNotification(counter);
    },
    showNotification: function(notification, x, y) {
      if (this.currentText) {
        this.container.removeChild(this.currentText);
      }
      if (this.background) {
        this.container.removeChild(this.background);
      }
      this.container.addChild(this.background);
      this.background.alpha = 1;
      this.background.x = this.person.pos.x - 25;
      this.background.y = this.person.pos.y - 70;
      this.background.tint = this.colors.getRandom();
      this.currentText = this.stage.createText(notification.value, {
        x: this.person.pos.x - 20,
        y: this.person.pos.y - 60,
        fontSize: '8px',
        width: 90,
        centered: true,
        color: '#333333'
      });
      this.container.addChild(this.currentText);
      this.currentText.notification = notification;
    },
    moveNotification: function(x, y) {
      if (this.background) {
        this.background.x = x - 25;
        this.background.y = y - 70;
      }
      if (this.currentText) {
        this.currentText.x = x - 20;
        this.currentText.y = y - 60;
      }
    },
    timeNotification: function(counter) {
      if (this.currentText) {
        var time = counter - this.lastNotify;
        if (time > 200) {
          this.currentText.alpha = (280 - time) / 80;
          this.background.alpha = (280 - time) / 80;
        }
        if (time > 280) {
          this.removeCurrent();
        }

      }
    },
    removeCurrent: function() {
      if (this.currentText) {
        this.container.removeChild(this.currentText);
        this.currentText = null;
      }
      if (this.background) {
        this.container.removeChild(this.background);
      }
    },
    warn: function(text) {
      this.add(text);
    },
    comment: function(text) {
      if (Math.randInt() > 70) {
        this.add(text);
      }
    }
  };

  window.boot.models.Talk = talk;
})();