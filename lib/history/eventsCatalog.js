window.boot = window.boot || {};
window.boot.data = window.boot.data || {};

window.boot.data.eventCatalog = function(options) {
  var self = this;
  this.boat = options.boat;
  this.world = options.world;
  return [{
      actions: {
        "go cetaceans!": function() {
          self.boat.people.forEach(function(person) {
            person.add('morale', 5);
          });
        },
      },
      title: 'Dolphins!',
      texts: ['Captain!',
        'We are being followed by a',
        'pod of dolphins!',
        'Our guys seem happy to see',
        'them arround.'
      ],
      interlocutor: options.boat.getBiggestRankSailor()
    }, {
      actions: {
        "Get better": function(interlocutor) {
          interlocutor.add('health', -20);
          interlocutor.isSick = true;
        },
      },
      title: 'Feeling Sick',
      texts: ['Sir,',
        "I'm feeling a little",
        'under the weather today.',
        'I think I have caught some',
        'kind of virus'
      ],
      interlocutor: function() {
        return options.boat.people.getRandom();
      }
    }, {
      actions: {
        "We'll return soon": function(interlocutor) {
          interlocutor.add('morale', -10);
          interlocutor.add('loyalty', 10);
        },
        "Sailor! keep the morale up": function(interlocutor) {
          interlocutor.add('morale', -10);
          interlocutor.add('loyalty', -10);
        },
        "How do you dare?": function(interlocutor) {
          interlocutor.add('morale', 0);
          interlocutor.add('loyalty', -20);
        },
      },
      title: 'Missing home',
      texts: ['Sir,',
        "I think we should return home",
        'as soon as possible.',
        "I can't help but miss my family",
        'and friends.'
      ],
      interlocutor: function() {
        return options.boat.people.getRandom();
      }
    }, {
      actions: {
        "Let's see where they hide": function() {
          self.world.notifyThePositionOfShips(30);
        },
      },
      title: 'Incoming radio message',
      texts: ['Sir',
        'The HQ have send us the positions',
        'of several ships they have located',
        'on northern atlantic.',
      ],
      interlocutor: options.boat.getBiggestRankSailor()
    }


  ];

};