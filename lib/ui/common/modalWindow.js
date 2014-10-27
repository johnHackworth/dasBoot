window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var modalWindow = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.title = options.title;
    this.autoClose = options.autoClose;
    this.texts = options.texts;
    this.actionOnClose = this.actionOnClose || options.actionOnClose;
    this.init(options);
  };
  modalWindow.prototype = {
    width: 550,
    height: 400,
    assets: {
      background: 'assets/buttons/paper.png',
      close: 'assets/buttons/close.png',
      maximize: 'assets/buttons/maximize.png',
      minimize: 'assets/buttons/minimize.png',
      fixInactive: 'assets/buttons/fixInactive.png',
      fixActive: 'assets/buttons/fixActive.png',
      attrPath: 'assets/people/attrs/'
    },
    init: function(options) {
      this.x = Math.floor(boot.config.width / 2) - 550 / 2;
      this.y = Math.floor(boot.config.height / 2) - 400 / 2;
      this.destroyables = [];
      this.isModal = options.modal;
      if (this.isModal) {
        this.addBackground();
      }
      this.addWindow();
      this.stage.addNotVisualEntity(this);
    },
    tick: function(counter) {
      if (!this.firstRound) {
        this.firstRound = counter;
      }
      if (this.autoClose && (counter - this.firstRound > this.autoClose)) {
        this.close();
      }
    },
    addBackground: function() {
      this.background = this.stage.addBackground(0, 0, boot.config.width, boot.config.height, 0x333333, 0.6, this.destroyables, null, false);
    },
    addWindow: function() {

      this.backPannel = new PIXI.Sprite.fromImage(this.assets.background);
      this.backPannel.position.x = this.x;
      this.backPannel.position.y = this.y;
      this.backPannel.height = 400;
      this.backPannel.width = 550;
      // this.backPannel.tint = 0x333344;
      this.destroyables.push(this.backPannel);
      this.stage.addVisualEntity(this.backPannel);
      this.showWindowButtons();
      this.addTitle();
      this.addTexts();
      this.addButtons();
      // this.window = this.stage.addBackground(x, y, 550, 400, 0xCCCCCC, 0.9, [], null, false);
    },
    addTitle: function() {
      this.titleText = this.stage.addText(this.title, {
        x: this.x + 550 / 2,
        y: this.y + 5,
        fontSize: '30px',
        color: '#999944'
      }, this.destroyables);
      this.titleText.x = this.titleText.x - Math.floor(this.titleText.width / 2);
    },
    addTexts: function() {
      this.textsViews = [];
      var textPointer = 70;
      for (var i in this.texts) {
        var text = this.stage.addText(this.texts[i], {
          x: this.x + 550 / 2,
          y: this.y + textPointer,
          width: 500,
          fontSize: '15px',
          color: '#333333'
        }, this.destroyables);
        text.x = text.x - Math.floor(text.width / 2);
        textPointer += text.height + 10;
        this.textsViews.push(text);
      }
    },
    showWindowButtons: function() {
      var x = Math.floor(boot.config.width / 2) + 550 / 2;
      var y = Math.floor(boot.config.height / 2) - 400 / 2;
      var view = new PIXI.Sprite.fromImage(this.assets.close);
      view.width = 20;
      view.height = 20;
      view.position.x = x - 23;
      view.position.y = y + 3;
      view.interactive = true;
      view.click = this.close.bind(this);
      this.destroyables.push(view);
      this.stage.addVisualEntity(view);

      // view = new PIXI.Sprite.fromImage(this.assets.maximize);
      // view.width = 20;
      // view.height = 20;
      // view.position.x = this.x + this.width - 46;
      // view.position.y = this.y + 3;
      // view.interactive = true;
      // view.click = this.maximizeWindow.bind(this);
      // this.maximizeButton = view;
      // this.views.push(view);
      // this.stage.addVisualEntity(view);

      // view = new PIXI.Sprite.fromImage(this.assets.minimize);
      // view.width = 20;
      // view.height = 20;
      // view.position.x = this.x + this.width - 46;
      // view.position.y = this.y + 3;
      // view.interactive = true;
      // view.click = this.minimizeWindow.bind(this);
      // this.minimizeButton = view;
      // view.visible = false;
      // this.views.push(view);
      // this.stage.addVisualEntity(view);
    },
    close: function() {
      this.clear();
      if (this.actionOnClose) {
        this.actionOnClose();
      }
    },
    clear: function() {
      while (this.destroyables.length) {
        var view = this.destroyables.shift();
        this.stage.removeView(view);
      }
    },
    addButton: function() {
      this.clear();
      this.button = new PIXI.Sprite.fromImage(this.buttonImage);
      this.button.x = this.x;
      this.button.y = this.y;
      this.button.height = this.height;
      this.button.width = this.width;
      this.button.interactive = true;
      this.button.buttonMode = true;
      this.button.tint = 0xFFDDDD;
      this.stage.addVisualEntity(this.button);
      this.button.click = this.action.bind(this);
      this.button.mouseover = this.illuminateButton.bind(this);
      this.button.mouseout = this.obscureButton.bind(this);
    },
    addButtons: function() {

    }
  };
  window.boot.ui.ModalWindow = modalWindow;
})();