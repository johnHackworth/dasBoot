window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var peopleList = function(options) {
    this.container = options.container;
    this.people = options.people;
    this.stage = options.stage;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.click = options.click;
    this.init();
  };
  peopleList.prototype = {
    init: function() {
      this.facesListContainer = new PIXI.DisplayObjectContainer();
      this.faces = [];
      this.container.addChild(this.facesListContainer);
      this.processPersons();
    },
    createPersonFace: function(personModel, x, y) {
      var self = this;
      var personFace = new boot.models.PersonFace({
        model: personModel,
        x: x,
        y: y
      });
      personFace.initView();
      personFace.view.scale.x = 0.75;
      personFace.view.scale.y = 0.75;
      personFace.view.interactive = true;
      personFace.view.buttonMode = true;
      personFace.view.click = function() {
        self.click(personModel);
      };
      this.faces.push(personFace);
      this.facesListContainer.addChild(personFace.view);
    },
    clear: function() {
      var n = 0;
      for (var i in this.faces) {
        this.facesListContainer.removeChild(this.faces[i].view);
      }
    },
    processPersons: function() {
      var n = 0;
      for (var i = 0; i < this.people.length; i++) {
        this.createPersonFace(this.people[i], this.x + i * 70, this.y);
        n++;
        if(n > 10) {
          return;
        }
      }
    }

  };
  window.boot.ui.PeopleList = peopleList;
})();
