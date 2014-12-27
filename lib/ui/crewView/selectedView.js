window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var selectedCrewView = function(options) {
    this.stage = options.stage;
    this.player = options.player;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = 700;
    this.height = 500;
    this.container = options.container;
    this.init();
  };
  selectedCrewView.prototype = {
    assets: {
      attrPath: 'assets/people/attrs/'
    },
    init: function() {
      this.views = [];
    },
    changeTarget: function(person) {
      var self = this;
      this.clear();
      this.person = person;
      this.showName();
      this.showFace();
      this.showHealthAndMorale();
      this.showPerkAndDeffects(90);
      this.showAttributes(205);
      if (this.player.people.indexOf(person) < 0) {
        this.showHiringButtons();
      } else {
        this.showDismissButtons();
      }
    },

    clear: function() {
      for (var i in this.views) {
        this.container.removeChild(this.views[i]);
      }
      if (this.healthBar) {
        this.healthBar.clear();
        this.moraleBar.clear();
        this.loyaltyBar.clear();
      }
      if (this.recruitButton) {
        this.recruitButton.clear();
      }
      if (this.dismissButton) {
        this.dismissButton.clear();
      }
      this.views = [];
    },
    showName: function() {
      var view = this.stage.addTextToContainer(this.container, this.person.rank + ' ' + this.person.name, {
        x: this.x + 175,
        y: this.y + 10,
        fontSize: '22px',
        fontName: 'specialElite',
        color: '#EFEFEF'
      }, this.destroyables);
      this.views.push(view);
    },
    addLabel: function(text, x, y, size, notCentered) {
      var centered = !notCentered;
      size = size || 14;
      var view = this.stage.addTextToContainer(this.container, text, {
        x: x,
        y: y,
        fontSize: size + 'px',
        fontName: 'specialElite',
        color: '#EFEFEF',
        centered: centered
      }, this.destroyables);
      this.views.push(view);
    },
    showFace: function() {
      var face = new boot.models.PersonFace({
        model: this.person,
        stage: this.stage,
        backgroundColor: 0x88BB88,
        lineColor: 0x339933,
        x: this.x + 10,
        y: this.y
      });
      face.initView();
      face.view.scale.x = 1.5;
      face.view.scale.y = 1.5;
      this.views.push(face.view);
      this.container.addChild(face.view);
    },

    showHealthAndMorale: function() {
      this.addLabel('Health', this.x + 200, this.y + 48);
      this.healthBar = new pixEngine.components.HealthBar({
        x: this.x + 250,
        y: this.y + 45,
        width: 150,
        height: 25,
        attribute: 'health',
        origin: this.person,
        container: this.container,
        stage: this.stage,
        alwaysVisible: true
      });
      this.addLabel('Morale', this.x + 200, this.y + 83);
      this.moraleBar = new pixEngine.components.HealthBar({
        x: this.x + 250,
        y: this.y + 80,
        width: 150,
        height: 25,
        attribute: 'morale',
        color: 0x5588CC,
        origin: this.person,
        container: this.container,
        stage: this.stage,
        alwaysVisible: true
      });
      this.addLabel('Loyalty', this.x + 200, this.y + 118);
      this.loyaltyBar = new pixEngine.components.HealthBar({
        x: this.x + 250,
        y: this.y + 115,
        width: 150,
        height: 25,
        attribute: 'loyalty',
        color: 0xCCCC88,
        origin: this.person,
        container: this.container,
        stage: this.stage,
        alwaysVisible: true
      });
    },

    showAttributes: function(initY) {
      var x = 0;
      var y = 0;
      var attrs = this.person.attributes.physicalAttributes.concat(this.person.attributes.mentalAttributes);
      for (var i in attrs) {
        var view = new PIXI.Sprite.fromImage(this.assets.attrPath + attrs[i] + '.png');
        view.width = 20;
        view.height = 20;
        view.position.x = this.x + 30 + 250 * x;
        view.position.y = this.y + initY + y * 45;
        this.addLabel(attrs[i], this.x + 55 + 250 * x, this.y + initY + 3 + y * 45, 14, true);
        var value = this.person.attributes[attrs[i]];
        this.addLabel(value, this.x + 30 + 250 * x + 180, this.y + initY + y * 45, 20);
        this.views.push(view);
        this.container.addChild(view);
        x++;
        // console.log(10 + 10 * x, this.width - 100);
        if ((30 + 250 * x) > (this.width - 100)) {
          x = 0;
          y++;
        }
        // console.log(x, y);
      }
    },
    showPerkAndDeffects: function(initY) {
      var x = 0;
      var y = 0;
      var view = null;
      for (var i in this.person.attributes.perks) {
        view = new PIXI.Sprite.fromImage(this.assets.attrPath + 'perks/' + this.person.attributes.perks[i] + '.png');
        view.width = 30;
        view.height = 30;
        view.position.x = this.x + 450 + 60 * x;
        view.position.y = this.y + 45;
        this.addLabel(this.person.attributes.perks[i], this.x + 15 + 450 + 60 * x, this.y + 80, 10);
        this.views.push(view);
        this.container.addChild(view);
        x++;
      }
      x = 0;
      for (i in this.person.attributes.deffects) {
        view = new PIXI.Sprite.fromImage(this.assets.attrPath + 'deffects/' + this.person.attributes.deffects[i] + '.png');
        view.width = 30;
        view.height = 30;
        view.position.x = this.x + 450 + 60 * x;
        view.position.y = this.y + 100;
        this.addLabel(this.person.attributes.deffects[i], this.x + 15 + 450 + 60 * x, this.y + 135, 10);
        this.views.push(view);
        this.container.addChild(view);
        x++;
      }
    },
    unselectPerson: function() {
      this.clear();
    },
    showHiringButtons: function() {
      this.recruitButton = new window.boot.ui.Button({
        stage: this.stage,
        width: 110,
        height: 20,
        fontSize: '12px',
        marginY: 5,
        action: this.recruit.bind(this),
        x: 40,
        y: 270,
        baseTint: 0xFFFFFF,
        text: 'Recruit',
        buttonImage: 'assets/buttons/metalButton.png'
      });
    },
    recruit: function() {

    },
    showDismissButtons: function() {
      this.dismissButton = new window.boot.ui.Button({
        stage: this.stage,
        width: 110,
        height: 20,
        fontSize: '12px',
        marginY: 5,
        action: this.dismiss.bind(this),
        x: 40,
        y: 270,
        baseTint: 0xFF9999,
        text: 'Dismiss',
        buttonImage: 'assets/buttons/metalButton.png'
      });
    },
    dismiss: function() {

    }
  };
  window.boot.ui.SelectedCrewView = selectedCrewView;
})();