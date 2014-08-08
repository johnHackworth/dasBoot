window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var peopleView = function(options) {
    this.stage = options.stage;
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
      var imageView = this.stage.addImage(
        person.assets.view, {
          x: person.room.getPosition(person).x,
          y: 300 + person.room.getPosition(person).y,
          scale: 0.3,
          centered: false
        }
      );
      imageView.setInteractive(true);
      imageView.click = this.mouseClickPerson.bind(this);
      this.peopleViews.push(imageView);
    },
    mouseClickPerson: function(ev) {
      console.log(ev);
    }
  };
  window.boot.ui.PeopleView = peopleView;
})();