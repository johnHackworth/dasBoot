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
          step: 6,
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
          x: 150,
          y: 100,
          spriteHeight: 80,
          spriteWidth: 70 * 80 / 100,
          step: 8,
          spriteName: 'tests/sailors.png',
          spriteNumber: 8
        });
        window.testhead2 = new boot.models.SpriteTest({
          stage: this,
          x: 166,
          y: 90,
          step: 20,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteName: 'tests/heads2.png',
          spriteNumber: 2
        });
        window.testhair2 = new boot.models.SpriteTest({
          stage: this,
          x: 166,
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
          x: 200,
          y: 100,
          step: 15,
          spriteOffset: 70 * 80 / 100,
          spriteHeight: 80,
          spriteWidth: 70 * 80 / 100,
          spriteName: 'tests/sailors2.png',
          spriteNumber: 7
        });
        window.testhead3 = new boot.models.SpriteTest({
          stage: this,
          x: 213,
          y: 90,
          step: 10,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteName: 'tests/heads.png',
          spriteNumber: 4
        });
        window.testhair3 = new boot.models.SpriteTest({
          stage: this,
          x: 213,
          y: 90,
          step: 1000,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteOffset: 60,
          spriteTint: 0xAA8811,
          spriteName: 'tests/hair.png',
          spriteNumber: 1
        });

        window.testitch2 = new boot.models.SpriteTest({
          stage: this,
          x: 250,
          y: 103,
          step: 5,
          spriteHeight: 80,
          spriteWidth: 70 * 80 / 100,
          spriteName: 'tests/itch.png',
          spriteNumber: 8
        });
        window.testheaditch2 = new boot.models.SpriteTest({
          stage: this,
          x: 262,
          y: 93,
          step: 20,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteName: 'tests/heads-model2.png',
          spriteNumber: 2
        });
        window.testitchhair2 = new boot.models.SpriteTest({
          stage: this,
          x: 262,
          y: 93,
          step: 1000,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteTint: 0x996666,
          spriteName: 'tests/hair.png',
          spriteNumber: 1
        });

        window.testClimbing = new boot.models.SpriteTest({
          stage: this,
          x: 300,
          y: 100,
          step: 20,
          spriteOffset: 0,
          spriteHeight: 80,
          spriteWidth: 70 * 80 / 100,
          spriteName: 'tests/climbing.png',
          spriteNumber: 4
        });
        window.testheadclimbing = new boot.models.SpriteTest({
          stage: this,
          x: 313,
          y: 96,
          step: 100000,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteOffset: 0,
          spriteName: 'tests/heads.png',
          spriteNumber: 4
        });

        window.testhairclimbing = new boot.models.SpriteTest({
          stage: this,
          x: 313,
          y: 96,
          step: 1000,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteOffset: 60,
          spriteTint: 0x773311,
          spriteName: 'tests/hair.png',
          spriteNumber: 1
        });
        window.testfix1 = new boot.models.SpriteTest({
          stage: this,
          x: 350,
          y: 103,
          step: 10,
          spriteHeight: 80,
          spriteWidth: 70 * 80 / 100,
          spriteName: 'tests/fixing1.png',
          spriteNumber: 4
        });
        window.testfixhead = new boot.models.SpriteTest({
          stage: this,
          x: 362,
          y: 93,
          step: 20,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteName: 'tests/heads2.png',
          spriteNumber: 2
        });
        window.testfixhair = new boot.models.SpriteTest({
          stage: this,
          x: 362,
          y: 93,
          step: 1000,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteOffset: 30,
          spriteTint: 0x996666,
          spriteName: 'tests/hair.png',
          spriteNumber: 1
        });
        window.testfix2 = new boot.models.SpriteTest({
          stage: this,
          x: 420,
          y: 103,
          step: 10,
          spriteHeight: 80,
          spriteWidth: 70 * 80 / 100,
          spriteName: 'tests/fixing2.png',
          spriteNumber: 6
        });
        window.testfixhead2 = new boot.models.SpriteTest({
          stage: this,
          x: 432,
          y: 93,
          step: 20,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteName: 'tests/heads2.png',
          spriteNumber: 2
        });
        window.testfixhair2 = new boot.models.SpriteTest({
          stage: this,
          x: 432,
          y: 93,
          step: 1000,
          spriteHeight: 30,
          spriteWidth: 30,
          spriteOffset: 30,
          spriteTint: 0x996666,
          spriteName: 'tests/hair.png',
          spriteNumber: 1
        });
      }
    });
    window.boot.currentStage.init();
  }
};