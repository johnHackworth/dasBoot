window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var workHability = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.init(options);
  };
  workHability.prototype = {
    torpedoManagement: 0,
    init: function(options) {
      this.attributes = options.attributes;
    }
  };

  window.boot.models.WorkHability = workHability;
})();