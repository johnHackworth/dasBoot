window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var comments = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
  };
  comments.prototype = {
    workComments: [
      'Working on it!',
      'I\'m on it',
      'Let\'s do it'
    ],
    torpedoes: [
      'Loading tubes'
    ],
    fixing: [
      'We can fix it!',
      'Let\'s fix this'
    ],
    hydrophone: [
      'Shhhh!',
      'Silence, please'
    ],
    getWorkComment: function(type) {
      if (!type || !this[type]) {
        return this.workComments.getRandom();
      } else {
        return this[type].getRandom();
      }
    }
  };

  window.boot.models.Comments = comments;
})();