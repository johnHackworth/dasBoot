window.boot = window.boot || {};
window.boot.directors = window.boot.directors || {};

window.boot.directors.main = function() {
  this.init();
};

window.boot.directors.main.prototype = {

  init: function(stage) {
    window.boot.width = boot.config.width;
    // if (window.boot.width < 1050) {
    //   window.boot.width = 1050;
    // }
    this.start();

  },
  start: function() {
    this.stage = new window.boot.stages.testStage();
    this.stage.init({});
    boot.currentStage.engine.running = true;
  }

};
window.boot.mainDirector = new boot.directors.main();