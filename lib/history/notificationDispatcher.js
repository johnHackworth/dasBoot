window.boot = window.boot || {};
window.boot.ui = window.ui.models || {};

(function() {
  var notificationDispatcher = function(options) {
    this.world = options.world;
    this.history = world.history;
    this.stage = options.stage;
    this.init();
  };
  notificationDispatcher.prototype = {
    init: function() {

    },
    nextTurn: function() {
      var ev = this.history.getEvent();
      if (ev) {
        this.showMessage(ev);
      }
    },
    showMessage: function(ev) {
      this.warningWindow = new boot.ui.ModalWindow({
        stage: this.stage,
        actionOnClose: ev.defaultAction,
        title: ev.title,
        texts: ev.texts,
        modal: true,
        autoClose: 200
      });
    }

  };
  window.boot.models.NotificationDispatcher = notificationDispatcher;
})();