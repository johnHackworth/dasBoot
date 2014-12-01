window.boot = window.boot || {};
window.boot.dataModels = window.boot.dataModels || {};

(function() {
  var person = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init(options);
  };
  person.prototype = {
    hairColors: [0x333333, 0x444444, 0xDDBB55, 0xCDAA55, 0xEEDD88, 0x555533, 0x995555, 0x958533, 0xCCCC33, 0xCC5522],
    culture: 'germanic',
    name: 'name placeholder',
    rank: 'Seaman',
    gender: 'm',
    health: 100,
    morale: 100,
    ethics: 100,
    currentLevel: 0,
    assets: boot.assets.person,
    speed: 2.5,
    init: function() {
      this.name = pixEngine.nameGenerator(this.culture, 0);
      this.attributes = new window.boot.models.PersonAttributes();
      this.workHability = new window.boot.models.WorkHability({
        attributes: this.attributes
      });
      this.attributes = new window.boot.models.PersonAttributes();
      this.randomizeLook();
    },
    randomizeLook: function() {
      this.headType = Math.randInt(this.assets.textures.head.length);
      this.hairType = Math.randInt(this.assets.textures.hair.length);
      this.hairColor = this.hairColors.getRandom();
      this.numberOfFacialFeatures = Math.randInt(2);
      this.facialFeatures = [];
      for (var i = 0; i < this.numberOfFacialFeatures; i++) {
        var feat = Math.randInt(this.assets.textures.facialFeatures.length);
        this.facialFeatures.push(feat);
      }
    },
    die: function() {

    }
  };

  window.boot.dataModels.Person = person;
})();