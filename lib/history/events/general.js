window.boot = window.boot || {};
window.boot.data = window.boot.data || {};
window.boot.data.generalEventCatalog = function(options) {
  var self = this;
  this.boat = options.boat;
  this.world = options.world;
  var catalog = [{
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

  return catalog;
};