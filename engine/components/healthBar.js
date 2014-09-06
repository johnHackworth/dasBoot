window.pixEngine = window.pixEngine || {};
window.pixEngine.components = window.pixEngine.components || {};

window.pixEngine.components.HealthBar = function(options) {};

window.pixEngine.components.HealthBar.prototype = {

  initHealthBar: function(options) {
    this.healthBar = {
      posX: options.x, // this.viewX + 30,
      posY: options.y, // this.viewY + this.view.height - 2,
      width: options.width, //this.view.width - 60,
      height: options.height, //10
      attr: options.attribute
    };
    this.healthBar.background = this.stage.addBackground(this.healthBar.posX, this.healthBar.posY, this.healthBar.width, this.healthBar.height, 0x111111, 1);
    this.healthBar.progress = this.stage.addBackground(this.healthBar.posX, this.healthBar.posY, this.healthBar.width, this.healthBar.height, 0x55CC88, 1);
    this.healthBar.background.visible = false;
    this.healthBar.progress.visible = false;
    this.healthBar.visible = false;
  },
  setHealthBarVisibility: function(value) {
    if (this.healthBar.visible === value) {
      return;
    }
    this.healthBar.visible = value;
    this.healthBar.background.visible = value;
    this.healthBar.progress.visible = value;
  },
  updateHealthBar: function(x, y) {
    if (x && y) {
      this.healthBar.posX = x;
      this.healthBar.posY = y;
      this.stage.removeView(this.healthBar.background);
      var width = this.healthBar.width;
      this.healthBar.background = this.stage.addBackground(this.healthBar.posX, this.healthBar.posY, width, this.healthBar.height, 0x111111, 1);
      this.healthBar.background.visible = this.healthBar.visible;
    }
    if (this[this.healthBar.attr] < 100) {
      this.setHealthBarVisibility(true);
      this.stage.removeView(this.healthBar.progress);
      var width = Math.floor(this.healthBar.width * this[this.healthBar.attr] / 100);
      this.healthBar.progress = this.stage.addBackground(this.healthBar.posX, this.healthBar.posY, width, this.healthBar.height, this.getBarColor(), 1);
    } else {
      this.setHealthBarVisibility(false);
    }

  },
  getBarColor: function() {
    var redPercentage = Math.floor(255 * (1 - this[this.healthBar.attr] / 100)).toString(16);
    var greenPercentage = Math.floor(255 * (this[this.healthBar.attr] / 100)).toString(16);
    return 1 * ('0x' + redPercentage + greenPercentage + '00');
  }
};