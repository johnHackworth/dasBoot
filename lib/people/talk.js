window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var talk = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.init();
  };
  talk.prototype = {
    lastNotify: -1000,
    elements: [],
    init: function() {
      this.elements = [];
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
      this.currentText = this.stage.addText(notification.value, {
        x: this.x,
        y: this.y - 15,
        fontSize: '12px',
        centered: true,
        color: '#FFFF33'
      });
      this.currentText.notification = notification;
    },
    moveNotification: function(x, y) {
      if (this.currentText) {
        this.currentText.x = x;
        this.currentText.y = y - 15;
      }
    },
    timeNotification: function(counter) {
      if (this.currentText) {
        var time = counter - this.lastNotify;
        if (time > 200) {
          this.currentText.alpha = (280 - time) / 80;
        }
        if (time > 280) {
          this.removeCurrent();
        }

      }
    },
    removeCurrent: function() {
      this.stage.removeView(this.currentText);
      this.currentText = null;
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