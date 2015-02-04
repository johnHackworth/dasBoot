window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

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
      while (ev) {
        this.showMessage(ev);
        ev = this.history.getEvent();
      }
    },
    showFirstMessage: function() {
      var ev = this.history.getEvent();
      if (ev) {
        this.showMessage(ev);
      }
    },
    showMessage: function(ev) {

      this.warningWindow = new boot.ui.ModalWindow({
        stage: this.stage,
        actionOnClose: ev.defaultAction,
        actions: ev.actions,
        title: ev.title,
        event: ev,
        texts: ev.texts,
        modal: true,
        autoClose: 2000,
        interlocutor: ev.interlocutor
      });
    }

  };
  window.boot.models.NotificationDispatcher = notificationDispatcher;
})();