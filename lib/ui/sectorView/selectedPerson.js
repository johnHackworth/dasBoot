window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var personView = function(options) {
    this.stage = options.stage;
    this.people = options.people;
    this.x = window.boot.config.width - 420;
    this.y = window.boot.config.height - 90;
    this.width = 410;
    this.height = 80;
    this.init();
  };
  personView.prototype = {
    assets: {
      background: 'assets/buttons/paper.png',
      close: 'assets/buttons/close.png',
      maximize: 'assets/buttons/maximize.png',
      minimize: 'assets/buttons/minimize.png',
      fixInactive: 'assets/buttons/fixInactive.png',
      fixActive: 'assets/buttons/fixActive.png',
      attrPath: 'assets/people/attrs/'
    },
    init: function() {
      this.addPannel();
    },
    changeTarget: function(person) {
      var self = this;
      this.person = person;
      this.clear();
      this.backPannel.visible = true;
      this.showName();
      this.showFace();
      this.showWindowButtons();
      this.showAttributes();
      this.showPersonOptionsButtons();
    },
    addPannel: function() {
      this.backPannel = new PIXI.Sprite.fromImage(this.assets.background);
      this.backPannel.position.x = this.x;
      this.backPannel.position.y = this.y;
      this.backPannel.height = this.height;
      this.backPannel.width = this.width;
      this.backPannel.tint = 0x333344;
      this.stage.addVisualEntity(this.backPannel);
      this.backPannel.visible = false;
    },
    clear: function() {
      clearInterval(this.interval);
      for (var i in this.views) {
        this.stage.removeView(this.views[i]);
      }
      this.views = [];
      this.backPannel.position.y = this.y;
      this.backPannel.height = this.height;
      this.backPannel.visible = false;
    },
    showName: function() {
      var view = this.stage.addText(this.person.rank + ' ' + this.person.name, {
        x: this.x + 70,
        y: this.y + 3,
        fontSize: '12px',
        color: '#EFEFEF'
      }, this.destroyables);
      this.views.push(view);
    },
    showFace: function() {
      var view = new PIXI.Sprite.fromImage(this.person.viewImage.front);
      view.scale.set(0.4, 0.4);
      view.position.x = this.x - 30;
      view.position.y = this.y + 3;
      view.position.y = this.y + 3;
      this.views.push(view);
      this.stage.addVisualEntity(view);
    },
    showWindowButtons: function() {
      var view = new PIXI.Sprite.fromImage(this.assets.close);
      view.width = 20;
      view.height = 20;
      view.position.x = this.x + this.width - 23;
      view.position.y = this.y + 3;
      view.setInteractive(true);
      view.click = this.unselectPerson.bind(this);
      this.views.push(view);
      this.stage.addVisualEntity(view);

      view = new PIXI.Sprite.fromImage(this.assets.maximize);
      view.width = 20;
      view.height = 20;
      view.position.x = this.x + this.width - 46;
      view.position.y = this.y + 3;
      view.setInteractive(true);
      view.click = this.maximizeWindow.bind(this);
      this.maximizeButton = view;
      this.views.push(view);
      this.stage.addVisualEntity(view);

      view = new PIXI.Sprite.fromImage(this.assets.minimize);
      view.width = 20;
      view.height = 20;
      view.position.x = this.x + this.width - 46;
      view.position.y = this.y + 3;
      view.setInteractive(true);
      view.click = this.minimizeWindow.bind(this);
      this.minimizeButton = view;
      view.visible = false;
      this.views.push(view);
      this.stage.addVisualEntity(view);
    },
    showPersonOptionsButtons: function() {

      view = new PIXI.Sprite.fromImage(this.assets.fixActive);
      view.width = 20;
      view.height = 20;
      view.position.x = this.x + this.width - 23;
      view.position.y = this.y + this.height - 23;
      view.setInteractive(true);
      view.click = this.setFix.bind(this, false);
      this.fixActive = view;
      this.views.push(view);
      this.stage.addVisualEntity(view);

      view = new PIXI.Sprite.fromImage(this.assets.fixInactive);
      view.width = 20;
      view.height = 20;
      view.position.x = this.x + this.width - 23;
      view.position.y = this.y + this.height - 23;
      view.setInteractive(true);
      view.click = this.setFix.bind(this, true);
      this.fixInactive = view;
      view.visible = false;
      this.views.push(view);
      this.stage.addVisualEntity(view);
      this.setFix(this.person.isFixer);
    },
    setFix: function(value) {
      this.person.isFixer = value;
      this.fixActive.visible = this.person.isFixer;
      this.fixInactive.visible = !this.person.isFixer;
    },
    showAttributes: function() {
      var x = 0;
      var y = 0;
      for (var i in this.person.attributes.physicalAttributes) {
        var view = new PIXI.Sprite.fromImage(this.assets.attrPath + this.person.attributes.physicalAttributes[i] + '.png');
        view.width = 40;
        view.height = 40;
        view.position.x = 10 + this.x + 100 * x;
        view.position.y = this.y + 90 + y * 55;
        this.views.push(view);
        this.stage.addVisualEntity(view);
        var value = this.person.attributes[this.person.attributes.physicalAttributes[i]];
        var text = this.stage.addText(value, {
          x: 10 + this.x + 100 * x + 45,
          y: this.y + 90 + y * 55 + 10,
          fontSize: '12px',
          color: '#EFEFEF'
        }, this.destroyables);
        this.views.push(text);
        x++;
        // console.log(10 + 10 * x, this.width - 100);
        if ((10 + 100 * x) > (this.width - 100)) {
          x = 0;
          y++;
        }
        // console.log(x, y);
      }
    },
    unselectPerson: function() {
      console.log(this.people);
      this.people.unselectPerson();
      this.clear();
    },
    hide: function() {
      this.clear();
    },
    show: function() {
      if (this.objetive) {
        this.changeTarget(this.objetive);
      }
    },
    maximizeWindow: function() {
      this.backPannel.y -= 200;
      this.backPannel.height += 200;
      this.minimizeButton.visible = true;
      this.maximizeButton.visible = false;
      for (var l = this.views.length; l; l--) {
        this.views[l - 1].y -= 200;
      }
      this.maximized = true;
    },
    minimizeWindow: function() {
      this.backPannel.y += 200;
      this.backPannel.height -= 200;
      this.minimizeButton.visible = false;
      this.maximizeButton.visible = true;
      for (var l = this.views.length; l; l--) {
        this.views[l - 1].y += 200;
      }

      this.maximized = false;
    }
  };
  window.boot.ui.PersonView = personView;
})();