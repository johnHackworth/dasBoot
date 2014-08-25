window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var workHability = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init(options);
  };
  workHability.prototype = {
    hasWorked: false,
    habilitiesRequired: {
      "torpedoes": ['strength', 'torpedoManagement'],
      "target": ['mathematics', 'weaponKnowledge', 'seaKnowledge'],
      "engine": ['engineering', 'stamina'],
      "helmsman": ['engineering', 'seaKnowledge']
    },
    init: function(options) {
      this.attributes = options.attributes;
      this.experience = {};
    },
    work: function(type) {
      if (!this.hasWorked) {
        this.hasWorked = true;
        var habilities = this.habilitiesRequired[type];
        var habilityShare = 100 / habilities.length;
        var value = 0;
        for (var i in habilities) {
          value += Math.floor(Math.random() * this.attributes[habilities[i]] * habilityShare);
          this.experience[habilities[i]] = this.experience[habilities[i]] || 0;
          this.experience[habilities[i]]++;
        }
        return value / 100;
      }
      return 0;
    }
  };

  window.boot.models.WorkHability = workHability;
})();