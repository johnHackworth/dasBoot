window.boot = window.boot || {};
window.boot.extensions = window.boot.extensions || {};

window.boot.extensions.personMorale = function() {};

window.boot.extensions.personMorale.prototype = {
  initMorale: function() {
    this.moraleModiffiers = [];
  },
  checkMorale: function() {
    this.checkPartners();
    this.checkEnvironment();
  },
  checkPartners: function() {
    this.moraleModiffiers = [];
    var moraleVariation = 0;
    this.inspiration = 1;
    if (this.model.morale > 90 && Math.randInt() > 90) {
      this.inspiration = 2;
    } else if (this.model.morale < 25 && Math.randInt() > 90) {
      this.inspiration = 0.2;
    } else if (this.model.morale > 50 && Math.randInt() > 90) {
      this.inspiration += Math.randInt(this.model.morale) / 100;
    }
    for (var i = this.room.people.length; i; i--) {
      var partner = this.room.people[i - 1];
      if (partner != this && partner) {
        var result = this.checkMoraleStance(partner);
        this.model.morale += result.morale;
        this.inspiration += result.inspiration;
      }
    }
  },
  checkMoraleStance: function(worker2) {
    var morale = 0;
    var inspiration = 0;
    if (worker2.model.attributes.perks.indexOf('heroic') >= 0) {
      inspiration += 0.5;
      this.moraleModiffiers.push('positive');
    }
    if (worker2.model.attributes.perks.indexOf('funny') >= 0) {
      morale += 0.1;
      this.moraleModiffiers.push('positive');
    }
    if (worker2.model.attributes.perks.indexOf('attractive') >= 0 &&
      worker2.model.gender != this.model.gender &&
      this.model.attributes.kinsey > Math.randInt()
    ) {
      inspiration += 0.5;
      morale += 0.05;
      this.moraleModiffiers.push('love');
    }
    if (worker2.model.attributes.perks.indexOf('attractive') >= 0 &&
      worker2.model.gender == this.model.gender &&
      this.model.attributes.kinsey < Math.randInt()
    ) {
      inspiration += 0.5;
      morale += 0.05;
      this.moraleModiffiers.push('love');
    }
    if (worker2.model.attributes.deffects.indexOf('rude') >= 0) {
      morale -= 0.02;
      this.moraleModiffiers.push('negative');
    }
    if (this.model.attributes.deffects.indexOf('racist') >= 0 &&
      worker2.model.culture != this.model.culture
    ) {
      morale -= 0.1;
      this.moraleModiffiers.push('racist');
    }
    if (this.model.attributes.deffects.indexOf('homophobic') >= 0 &&
      worker2.model.attributes.kinsey > 70
    ) {
      inspiration -= 0.5;
      morale -= 0.05;
      this.moraleModiffiers.push('homophobia');
    }
    return {
      morale: morale,
      inspiration: inspiration
    };
  },
  checkEnvironment: function() {
    if (this.model.attributes.perks.indexOf('claustrophobic') >= 0 &&
      this.boat.deep > Math.randInt()
    ) {
      this.inspiration -= 0.5;
      this.morale -= 0.5;
      this.moraleModiffiers.push('claustrophobic');
    }
  }
};
