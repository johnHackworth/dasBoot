window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var event = function(options) {
    this.texts = [];
    this.interlocutor = typeof options.interlocutor === 'function' ? options.interlocutor() : options.interlocutor;
    this.secondPerson = options.secondPerson ? options.secondPerson() : null;
    this.title = options.title;

    this.actions = {};
    for (var i in options.actions) {
      this.actions[i] = options.actions[i].bind(this);
    }
    this.defaultAction = options.defaultAction;
    for (var j in options.texts) {
      if (this.secondPerson) {
        this.texts[j] = options.texts[j].replace('%name%', this.secondPerson.name);
      } else {
        this.texts[j] = options.texts[j];
      }
    }

    this.init();
  };
  event.prototype = {
    init: function() {

    }
  };
  window.boot.models.Event = event;
})();