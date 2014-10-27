window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var hydro = function(options) {
    this.init(options);
  };
  hydro.prototype = {
    assets: {
      background: 'assets/ui/hydrophoneBackground.png',
    },
    init: function(options) {
      this.ships = [];
      this.sea = options.sea;
      this.stage = options.stage;
      this.container = options.container;
      this.playerBoat = this.stage.playerBoat;
      this.x = options.x;
      this.y = options.y;
      this.sea = options.sea;
      this.paintBackground();
      this.paintBoats();
      this.stage.addNotVisualEntity(this);
    },
    paintBackground: function() {
      var texture = PIXI.Texture.fromImage(this.assets.background);
      var texture2 = new PIXI.Texture(texture, new PIXI.Rectangle(0, 150, 1200, 250));
      texture2.width = boot.config.width;
      this.view = new PIXI.Sprite(texture2);
      this.view.x = 0;
      this.view.y = 0;
      this.container.addChild(this.view);
    },
    paintBoats: function() {
      var boats = this.sea.boats;
      for (var i = 0, l = boats.length; i < l; i++) {
        this.paintBoat(boats[i], i);
      }
    },
    getDistance: function(objetive) {
      var hydrowork = this.playerBoat.getHydrophoneWork();
      if (hydrowork < 20) {
        return this.getNoData();
      } else if (hydrowork < 40) {
        return this.getMinimalData(objetive);
      } else if (hydrowork < 80) {
        return this.getApproximateDistance(objetive);
      } else {
        return this.getExactData(objetive);
      }
    },
    getNoData: function() {
      return 'No Data';
    },
    getMinimalData: function(objetive) {
      var distance = this.sea.combatSimulator.getDistance(this.playerBoat, objetive);
      if (distance <= 2000) {
        return 'Near';
      } else {
        return 'Far';
      }
    },
    getApproximateDistance: function(objetive) {

      var distance = this.sea.combatSimulator.getDistance(this.playerBoat, objetive);
      if (distance <= 500) {
        return 'Over us';
      } else if (distance <= 1000) {
        return 'Very Near';
      } else if (distance <= 2000) {
        return 'Near';
      } else if (distance <= 4000) {
        return 'Far';
      } else {
        return 'Very Far';
      }
    },
    getExactData: function(objetive) {

      var distance = this.sea.combatSimulator.getDistance(this.playerBoat, objetive);
      distance = Math.floor(distance / 100) * 100;
      return distance + 'm. away';
    },
    paintBoat: function(boat, n) {
      var nPos = Math.floor(n / 3);
      var yPos = n % 2;
      var ship = {};
      ship.x = this.x + 200 + 300 * nPos;
      ship.y = this.y + 10 + yPos * 100;
      ship.boat = boat;
      ship.shipContainer = new PIXI.DisplayObjectContainer();
      ship.background = this.stage.addBackgroundToContainer(ship.shipContainer, ship.x, ship.y, 250, 80, 0xDEDEDE, 1);

      ship.sillouette = new PIXI.Sprite.fromImage(boat.assets.side);
      ship.sillouette.scale.set(0.2, 0.2);

      ship.sillouette.position.x = ship.x + 10;
      ship.sillouette.position.y = ship.y + 10;
      ship.shipContainer.addChild(ship.sillouette);
      this.container.addChild(ship.shipContainer);
      ship.textDistance = this.stage.addTextToContainer(ship.shipContainer,
        'Distance: ' + this.getDistance(boat), {
          x: ship.x + 10,
          y: ship.y + 60,
          fontSize: '10px',
          color: '#555555'
        });

      this.ships.push(ship);
    },
    tick: function(counter) {
      if (counter % 60 === 0) {
        for (var i = 0, l = this.ships.length; i < l; i++) {
          var ship = this.ships[i];
          ship.textDistance.setText('Distance:' + this.getDistance(ship.boat));
        }
      }
    }

  };

  window.boot.ui.HydrophoneScreen = hydro;
})();