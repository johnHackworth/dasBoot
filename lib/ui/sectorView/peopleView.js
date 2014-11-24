window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var peopleView = function(options) {
    this.stage = options.stage;
    this.container = options.container;
    this.outsideContainer = options.outsideContainer;
    this.talkContainer = options.talkContainer;
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
      person.initView(this.talkContainer);
      person.view.interactive = true;
      person.view.click = this.mouseClickPerson.bind(this, person);
      this.peopleViews.push(person.view);
      this.container.addChild(person.view);
    },
    addPersonOutside: function(person) {
      person.initView(this.talkContainer);
      this.peopleViews.push(person.view);
      this.outsideContainer.addChild(person.view);
    },
    takePersonInside: function(person, room) {
      this.outsideContainer.removeChild(person.view);
      person.changeRoom(room);
      person.destination = room.getPosition(person);
      this.container.addChild(person.view);
    },
    takePersonOutside: function(person, lifeboat) {
      this.container.removeChild(person.view);
      person.room = lifeboat;
      this.outsideContainer.addChild(person.view);
    },
    mouseClickPerson: function(person, ev) {
      if (person.status == 'dead') {
        return;
      }
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