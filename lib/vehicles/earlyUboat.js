window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var submarine = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Submarine, true, options);

  };
  submarine.prototype = {
    topRoom: 95,
    leftRoom: 150,
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
        type: 'engine',
        doors: ['left', 'right'],
        open: false
      }, {
        type: 'empty',
        doors: ['left', 'right'],
        open: false
      }, {
        type: 'sleepingQuarters',
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
        type: 'torpedo',
        doors: ['left'],
        open: false
      }]
    }],
    initWeapons: function() {
      this.weapons = {};
      this.weapons.torpedoes = {
        storage: {
          type: 'torpedo1',
          number: 15
        },
        tubes: [
          new boot.models.TorpedoTube({
            stage: this.stage,
            boat: this,
            torpedoRoom: this.layout.rooms[1][5]
          }),
          new boot.models.TorpedoTube({
            stage: this.stage,
            boat: this,
            torpedoRoom: this.layout.rooms[1][5]
          })
        ]
      };
    }
  };

  window.boot.models.EarlyUboat = submarine;
})();