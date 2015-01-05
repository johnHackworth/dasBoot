window.boot = window.boot || {};
window.boot.data = window.boot.data || {};

window.boot.data.personEventCatalog = function(options) {
  var self = this;
  this.boat = options.boat;
  this.stage = options.stage;
  this.world = options.world;
  var catalog = [];
  var general = new window.boot.data.generalEventCatalog(options);
  catalog = catalog.concat(general);
  var paranoid = new window.boot.data.paranoidEventCatalog(options);
  catalog = catalog.concat(paranoid);
  var drunkCatalog = new window.boot.data.drunkEventCatalog(options);
  catalog = catalog.concat(drunkCatalog);
  var paramedicCatalog = new window.boot.data.paramedicEventCatalog(options);
  catalog = catalog.concat(paramedicCatalog);

  catalog.getEvent = function(person) {
    var n = Math.randInt(catalog.length);
    var data = catalog[n];
    data.interlocutor = person;
    return data;
  };
  return catalog;
};