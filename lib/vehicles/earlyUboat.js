window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var submarine = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Submarine, true, options);
    this.init(options);
  };
  submarine.prototype = {
    topRoom: 50,
    leftRoom: 190,
    assets: {
      layout: 'assets/vehicles/sub1.png'
    },
    layoutMap: [{
      rooms: [
        null, null, null, {
          type: 'empty',
          doors: ['down'],
          open: true
        },
        null, null
      ]
    }, {
      rooms: [{
        type: 'empty',
        doors: ['left', 'right'],
        open: false
      }, {
        type: 'empty',
        doors: ['left', 'right'],
        open: false
      }, {
        type: 'empty',
        doors: ['left', 'right'],
        open: false
      }, {
        type: 'empty',
        doors: ['left', 'right'],
        open: false
      }, {
        type: 'empty',
        doors: ['left', 'right'],
        open: false
      }]
    }]
  };

  window.boot.models.EarlyUboat = submarine;
})();