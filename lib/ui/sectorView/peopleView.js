window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var peopleView = function(options) {
    this.stage = options.stage;
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init();
  };
  peopleView.prototype = {
    peopleViews: [],
    init: function() {
      this.peopleViews = [];
      this.addPeople();
    },
    addPeople: function() {
      var people = this.stage.world.playerBoat.people;
      for (var i = 0, l = people.length; i < l; i++) {
        this.addPerson(people[i]);
      }
    },
    addPerson: function(person) {

      person.initView();
      for (var i in person.view) {
        person.view[i].setInteractive(true);
        person.view[i].click = this.mouseClickPerson.bind(this, person);
        this.peopleViews.push(person.view[i]);
      }
    },
    mouseClickPerson: function(person, ev) {
      if (this.selectedPerson) {
        this.selectedPerson.unselect();
      }
      this.selectedPerson = person;
      person.select();
      this.trigger('selectedPerson', person);
    },
    unselectPerson: function(person, ev) {
      if (this.selectedPerson) {
        this.selectedPerson.unselect();
      }
      this.selectedPerson = null;
      this.trigger('unselectedPerson', person);
    }
  };
  window.boot.ui.PeopleView = peopleView;
})();