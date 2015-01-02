window.boot = window.boot || {};
window.boot.data = window.boot.data || {};

window.boot.data.personEventCatalog = function(options) {
  var self = this;
  this.boat = options.boat;
  this.world = options.world;
  var catalog = [{
      actions: {
        "You are held resposible on this": function(interlocutor) {
          interlocutor.add('morale', -15);
          interlocutor.add('loyalty', -5);
          console.log(this.secondPerson.name)
        },
        "This things happens": function(interlocutor) {
          interlocutor.add('loyalty', 15);
          this.secondPerson.add('morale', -25);
          this.secondPerson.add('loyalty', -15);
          console.log(this.secondPerson.name)
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
    }, {
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
      },
    }, {
      actions: {
        "kudos to you!!": function(interlocutor) {
          for (var i in self.boat.people) {
            self.boat.people[i].add('health', 15);
          }
        },
      },
      title: 'Medical revision',
      texts: ['Captain,',
        'I have made a health check',
        'of the whole crew.',
        'Now they are in a better shape.'
      ],
      conditions: function(person) {
        if (person.attributes.perks.indexOf('paramedic') >= 0) {
          return true;
        } else {
          return false;
        }
      },
    }, {
      actions: {
        "You should see a doctor": function(interlocutor) {
          interlocutor.add('morale', -5);
          interlocutor.add('health', -15);
        },
      },
      title: 'Bad health',
      texts: ['Captain,',
        'I know this is not news for you,',
        'but I have a very feeble constitution.',
        'The prolongued exposition to',
        'the boat air is making me weak.',
        'I\'m not feeling very well'
      ],
      conditions: function(person) {
        if (person.attributes.deffects.indexOf('unhealthy') >= 0) {
          return true;
        } else {
          return false;
        }
      },
    }, {
      actions: {
        "You're counterrevolutionary": function(interlocutor) {
          interlocutor.add('morale', -5);
          interlocutor.add('loyalty', -15);

        },
        "I'll talk with them": function(interlocutor) {
          interlocutor.add('morale', 5);
          for (var i in self.boat.people) {
            if (self.boat.people[i].attributes.kinsey > 45) {
              self.boat.people[i].add('morale', -5);
            }
          }
        },
      },
      title: 'Decency',
      texts: ['Captain,',
        'I don\'t feel confortable with some',
        'of my crew mates. Their behaviour',
        'is not something a decent person',
        'can ignore.',
        'I would like to have them dismissed',
        'next time we return to port'
      ],
      conditions: function(person) {
        var hasKinsey = false;
        for (var i in this.boat.people) {
          if (this.boat.people[i].attributes.kinsey > 60) {
            hasKinsey = true;
          }
        }
        if (hasKinsey && person.attributes.deffects.indexOf('homophobic') >= 0) {
          return true;
        } else {
          return false;
        }
      },
    }

  ];
  catalog.getEvent = function(person) {
    var n = Math.randInt(catalog.length);
    var data = catalog[n];
    data.interlocutor = person;
    return data;
  };
  return catalog;
};