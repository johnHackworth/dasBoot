window.boot = window.boot || {};
window.boot.data = window.boot.data || {};
window.boot.data.paramedicEventCatalog = function(options) {
  var self = this;
  this.boat = options.boat;
  this.world = options.world;
  var catalog = [{
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
  }];

  return catalog;
};