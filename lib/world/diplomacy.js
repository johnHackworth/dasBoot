window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var diplomacy = function(options) {
    this.options = options;
    this.world = options.world;
    this.init();
  };
  diplomacy.prototype = {
    init: function() {
      this.initRelations();
    },
    initRelations: function() {
      this.relations = {};
      for (var i in this.world.nations) {
        var nation1 = this.world.nations[i];
        this.relations[nation1.name] = {};
        for (var j in this.world.nations) {
          var nation2 = this.world.nations[j];
          if (nation1 != nation2) {
            var value = window.boot.data.originalDiplomacy[nation1.name][nation2.name] || 50;
            this.relations[nation1.name][nation2.name] = value;
          }
        }
      }

    },
    convertToText: function(intValue) {
      if (intValue > 80) {
        return 'Ally';
      }
      if (intValue > 60) {
        return 'Friendly';
      }
      if (intValue > 40) {
        return 'Neutral';
      }
      if (intValue > 20) {
        return 'Wary';
      }
      if (intValue >= 0) {
        return 'Enemy';
      }
    },
    getTextRelation: function(nation1, nation2) {
      var intRelation = this.getRelation(nation1, nation2);
      return this.convertToText(intRelation);
    },
    getRelation: function(nation1, nation2) {
      return this.relations[nation1.name][nation2.name];
    },
    isEnemy: function(nation1, nation2) {
      if (this.relations[nation1.name][nation2.name] < 20) {
        return true;
      }
      return false;
    }
  };


  window.boot.models.Diplomacy = diplomacy;
})();