window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var personAttributes = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init();
  };
  personAttributes.prototype = {
    physicalAttributes: ['strength', 'stamina', 'hability',
      'intelligence', 'mathematics', 'seaKnowledge',
      'weaponKnowledge', 'engineering'
    ],
    torpedoManagement: 0,
    init: function() {
      this.initPhysicalAttributes();
    },
    initPhysicalAttributes: function() {
      for (var i in this.physicalAttributes) {
        var name = this.physicalAttributes[i];
        this[name] = 30 + Math.randInt(70);
      }
    }
  };

  window.boot.models.PersonAttributes = personAttributes;
})();