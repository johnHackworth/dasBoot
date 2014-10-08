window.boot = window.boot || {};
window.boot.dataModels = window.boot.dataModels || {};

(function() {
  var person = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init(options);
  };
  person.prototype = {
    culture: 'germanic',
    name: 'name placeholder',
    rank: 'Seaman',
    gender: 'm',
    health: 100,
    currentLevel: 0,
    assets: boot.assets.person,
    speed: 2.5,
    init: function() {
      this.name = pixEngine.nameGenerator(this.culture, 0);
      this.attributes = new window.boot.models.PersonAttributes();
      this.workHability = new window.boot.models.WorkHability({
        attributes: this.attributes
      });
      this.attributes = new window.boot.models.PersonAttributes();
      this.headType = Math.floor(Math.random() * this.assets.views.length);
      this.bodyType = Math.floor(Math.random() * this.assets.bodies.length);
    },
    die: function() {

    }
  };

  window.boot.dataModels.Person = person;
})();