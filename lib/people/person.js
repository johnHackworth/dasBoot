window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var person = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Vehicle, true, options);

  };
  person.prototype = {
    name: "",
    assets: {
      view: 'assets/people/body.gif'
    },
    room: null,
    x: 0,
    y: 0,
    init: function() {}
  };

  window.boot.models.Person = person;
})();