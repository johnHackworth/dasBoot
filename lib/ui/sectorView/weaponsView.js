window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var weaponsLayout = function(options) {
    this.stage = options.stage;
    this.weapons = world.playerBoat.weapons;
    this.container = options.container;
    this.sea = options.sea;
    this.init();
  };
  weaponsLayout.prototype = {
    assets: {
      background: 'assets/buttons/panel.png'
    },
    init: function() {
      this.addPannel();
      this.initTorpedoTubes();
      this.createDeckGunHud();
    },
    addPannel: function() {
      this.backPannel = new PIXI.Sprite.fromImage(this.assets.background);
      this.backPannel.position.x = 10;
      this.backPannel.position.y = 10;
      this.backPannel.height = 230;
      this.backPannel.width = 180;
      this.container.addChild(this.backPannel);
    },
    getWidth: function() {
      var width = 0;
      for (var i in this.torpedoTubeViews) {
        width += 110 + 50;
      }
      return width;
    },
    selectBoat: function() {
      for (var i in this.torpedoTubeViews) {
        this.torpedoTubeViews[i].setReadyToFire(true);
      }
    },
    initTorpedoTubes: function() {
      this.torpedoTubeViews = [];
      var n = 0;
      for (var i in this.weapons.torpedoes.tubes) {
        this.createTorpedoHud(this.weapons.torpedoes.tubes[n], n);
        n++;
      }
    },
    createDeckGunHud: function() {
      var tubeView = new window.boot.ui.DeckGunButton({
        stage: this.stage,
        container: this.container,
        x: 20,
        y: 40,
        sea: this.sea,
        tube: this.weapons.mainGun,
        n: 0
      });
      this.torpedoTubeViews.push(tubeView);
      tubeView.on('fire', this.sea.createOwnProjectile.bind(this.sea));
    },
    createTorpedoHud: function(tube, n) {
      var tubeView = new window.boot.ui.TorpedoButton({
        stage: this.stage,
        container: this.container,
        x: 20,
        y: 80 + 40 * n,
        sea: this.sea,
        tube: tube,
        n: n
      });
      this.torpedoTubeViews.push(tubeView);
      tubeView.on('fire', this.sea.createTorpedo.bind(this.sea));
    }
  };
  window.boot.ui.WeaponsLayout = weaponsLayout;
})();