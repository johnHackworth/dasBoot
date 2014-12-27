window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var port = function(options) {
    this.options = options;
    this.sector = options.sector;
    this.model = options.model;
    this.country = options.country;
    this.color = options.country.color;
    this.init();
  };
  port.prototype = {
    init: function() {
      this.originShips = [];
      this.destinationShips = [];
      this.name = this.model.name;
      this.people = [];
      this.initPeople();
    },
    getActiveShips: function() {
      return this.originShips.length + this.destinationShips.length;
    },
    initPeople: function() {
      var amount = 10;
      amount += Math.randInt(10);
      for (var i = 0; i < amount; i++) {
        var person = new window.boot.dataModels.Person({
          country: this.country
        });
        this.people.push(person);
      }
    }


  };

  window.boot.models.Port = port;
})();