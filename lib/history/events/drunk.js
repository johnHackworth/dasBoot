window.boot = window.boot || {};
window.boot.data = window.boot.data || {};
window.boot.data.drunkEventCatalog = function(options) {
  var self = this;
  this.boat = options.boat;
  this.world = options.world;
  var catalog = [{
    actions: {
      "You are held resposible on this": function(interlocutor) {
        interlocutor.add('morale', -15);
        interlocutor.add('loyalty', -5);
      },
      "This things happens": function(interlocutor) {
        interlocutor.add('loyalty', 15);
        this.secondPerson.add('morale', -25);
        this.secondPerson.add('loyalty', -15);
      },
    },
    title: 'Drunken Brawl',
    texts: ['Sir,',
      'Me and %name% has gotten',
      'into a fist fight.',
      'Maybe, and only maybe, I have',
      'drank a little too much after',
      'lunch, but that asshole went',
      'for me'
    ],
    secondPerson: function() {
      return options.boat.people.getRandom();
    },
    conditions: function(person) {
      if (Math.randInt() > 90 || person.attributes.deffects.indexOf('alcoholic') >= 0) {

        return true;
      } else {
        return false;
      }
    },
  }];

  return catalog;
};