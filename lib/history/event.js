window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var event = function(options) {
    this.texts = options.texts;
    this.interlocutor = options.interlocutor;
    this.title = options.title;
    this.actions = options.actions;
    this.defaultAction = options.defaultAction;
    this.init();
  };
  event.prototype = {
    init: function() {

    }
  };
  window.boot.models.Event = event;
})();