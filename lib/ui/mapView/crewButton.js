window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var crewViewButton = function(options) {
    pixEngine.utils.extend.call(this, boot.ui.Button, true, options);
  };
  crewViewButton.prototype = {

    clickable: true,
    fontName: 'germania',
    marginX: 38,
    marginY: 12,
    text: 'Crew View',
    buttonImage: 'assets/buttons/metalButton.png',
    action: function() {
      boot.mainDirector.startCrewView();
    },
  };
  window.boot.ui.CrewViewButton = crewViewButton;
})();