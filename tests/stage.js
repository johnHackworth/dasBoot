window.boot = window.boot || {};
window.boot.stages = window.boot.stages || {};

window.boot.stages.testStage = function(options) {
  pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
  this.options = options;
};


window.boot.stages.testStage.prototype = {
  init: function(options) {

    window.boot.currentStage = new pixEngine.Stage({
      fps: null,
      width: window.boot.config.width,
      height: window.boot.config.height,
      assets: [],
      init: function(stage) {
        var self = this;
        document.getElementById('loader').remove();
        window.test = new boot.models.SpriteTest({
          stage: this,
          x: 100,
          y: 100,
          step: 8,
          spriteHeight: 80,
          spriteWidth: 70 * 80 / 100,
          spriteName: 'tests/sailors.png',
          spriteNumber: 9
        });
        window.testhead1 = new boot.models.SpriteTest({
          stage: this,
          x: 116,
          y: 90,
          step: 20,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteName: 'tests/heads2.png',
          spriteNumber: 2
        });
        window.testhair = new boot.models.SpriteTest({
          stage: this,
          x: 116,
          y: 90,
          step: 1000,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteOffset: 30,
          spriteTint: 0x111111,
          spriteName: 'tests/hair2.png',
          spriteNumber: 1
        });
        window.test2 = new boot.models.SpriteTest({
          stage: this,
          x: 200,
          y: 100,
          spriteHeight: 80,
          spriteWidth: 70 * 80 / 100,
          step: 8,
          spriteName: 'tests/sailors.png',
          spriteNumber: 8
        });
        window.testhead2 = new boot.models.SpriteTest({
          stage: this,
          x: 216,
          y: 90,
          step: 20,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteName: 'tests/heads2.png',
          spriteNumber: 2
        });
        window.testhair2 = new boot.models.SpriteTest({
          stage: this,
          x: 216,
          y: 90,
          step: 1000,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteOffset: 30,
          spriteTint: 0xFF6611,
          spriteName: 'tests/hair.png',
          spriteNumber: 1
        });
        window.test3 = new boot.models.SpriteTest({
          stage: this,
          x: 300,
          y: 100,
          step: 15,
          spriteOffset: 70,
          spriteName: 'tests/sailors2.png',
          spriteNumber: 7
        });
        window.testhead3 = new boot.models.SpriteTest({
          stage: this,
          x: 320,
          y: 103,
          step: 10,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteName: 'tests/heads.png',
          spriteNumber: 4
        });
        window.testhair3 = new boot.models.SpriteTest({
          stage: this,
          x: 320,
          y: 103,
          step: 1000,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteOffset: 60,
          spriteTint: 0xFF6611,
          spriteName: 'tests/hair.png',
          spriteNumber: 1
        });
        window.test4 = new boot.models.SpriteTest({
          stage: this,
          x: 400,
          y: 100,
          step: 20,
          spriteOffset: 70,
          spriteName: 'tests/sailors2.png',
          spriteNumber: 7
        });
        window.test5 = new boot.models.SpriteTest({
          stage: this,
          x: 500,
          y: 100,
          step: 20,
          spriteOffset: 0,
          spriteName: 'tests/sailors3.png',
          spriteNumber: 4
        });
      }
    });
    window.boot.currentStage.init();
  }
};