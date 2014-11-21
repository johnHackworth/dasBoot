window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var nPerson = 0;
  var person = function(options) {
    this.room = options.room;
    pixEngine.utils.extend.call(this, window.boot.models.Person, true, options);
  };
  person.prototype = {

  };

  window.boot.models.EnemySailor = person;
})();