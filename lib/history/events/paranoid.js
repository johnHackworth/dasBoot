window.boot = window.boot || {};
window.boot.data = window.boot.data || {};
window.boot.data.paranoidEventCatalog = function(options) {
  var self = this;
  this.boat = options.boat;
  this.world = options.world;
  this.stage = options.stage;
  var catalog = [{
    actions: {
      "You should see a doctor, NOW": function(interlocutor) {
        interlocutor.add('morale', -15);
        interlocutor.add('loyalty', -25);
      },
    },
    title: 'YOU ARE GOING TO DIE',
    texts: ['YOU!,',
      'I know you\'re plotting',
      'agains me.',
      'I KNOW IT',
    ],
    conditions: function(person) {
      if (person.attributes.deffects.indexOf('paranoid') >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    actions: {
      "Uh... ok": function(interlocutor, modalWindow) {
        interlocutor.add('morale', 5);
        interlocutor.add('loyalty', -5);
        setTimeout(function() {

          var modal = new boot.ui.ModalWindow({
            stage: modalWindow.stage,
            actions: {
              "Damn": function() {
                self.boat.people.forEach(function(person) {
                  person.add('morale', -10);
                });
              },
            },
            title: "Crew uneasy",
            texts: ["Sir,", "The extrange behaviour and chanting",
              "from " + interlocutor.name + " is", "making everyone a little startled."
            ],
            modal: true,
            autoClose: 2000,
            interlocutor: self.boat.getBiggestRankSailor()
          });
        }, 500);
      },
    },
    title: 'Weird singing',
    texts: ["It's always summer, under the sea",
      "I know, I know, oh, oh, oh"
    ],
    conditions: function(person) {
      if (person.attributes.deffects.indexOf('paranoid') >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }, ];

  return catalog;
};