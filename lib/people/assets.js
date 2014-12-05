window.boot = window.boot || {};
window.boot.assets = window.boot.assets || {};

window.boot.assets.person = {
  views: [{
    front: 'assets/people/head_m_0.png',
    side: 'assets/people/head_m_0_side.png',
    back: 'assets/people/head_m_0_back.png'
  }, {
    front: 'assets/people/head_m_1.png',
    side: 'assets/people/head_m_1_side.png',
    back: 'assets/people/head_m_1_back.png'
  }, {
    front: 'assets/people/head_m_2.png',
    side: 'assets/people/head_m_2_side.png',
    back: 'assets/people/head_m_2_back.png'
  }, {
    front: 'assets/people/head_m_3.png',
    side: 'assets/people/head_m_3_side.png',
    back: 'assets/people/head_m_3_back.png'
  }, {
    front: 'assets/people/head_m_4.png',
    side: 'assets/people/head_m_4_side.png',
    back: 'assets/people/head_m_4_back.png'
  }, {
    front: 'assets/people/head_m_5.png',
    side: 'assets/people/head_m_5_side.png',
    back: 'assets/people/head_m_5_back.png'
  }, {
    front: 'assets/people/head_m_6.png',
    side: 'assets/people/head_m_6_side.png',
    back: 'assets/people/head_m_6_back.png'
  }],
  bodies: [{
    standing: 'assets/people/body_m_front.png',
    sidework: 'assets/people/body_m_sidework.png',
    moving: ['assets/people/body_m_0.png', 'assets/people/body_m_1.png', 'assets/people/body_m_2.png', 'assets/people/body_m_3.png', 'assets/people/body_m_4.png', 'assets/people/body_m_5.png', 'assets/people/body_m_6.png', 'assets/people/body_m_7.png'],
    working: ['assets/people/body_m_3_back_0.png', 'assets/people/body_m_3_back_1.png', 'assets/people/body_m_3_back_2.png', 'assets/people/body_m_3_back_3.png', 'assets/people/body_m_3_back_4.png', 'assets/people/body_m_3_back_5.png'],
    climbing: ['assets/people/body_m_climb_0.png', 'assets/people/body_m_climb_1.png'],
    fixing: ['assets/people/body_m_fixing_1.png', 'assets/people/body_m_fixing_2.png', 'assets/people/body_m_fixing_3.png', 'assets/people/body_m_fixing_4.png'],
    death: ['assets/people/body_m_death_0.png', 'assets/people/body_m_death_1.png', 'assets/people/body_m_death_2.png', 'assets/people/body_m_death_3.png']
  }],
  initTextures: function() {
    this.textures = {};
    this.initBodyTextures();
    this.initHeadTextures();
    this.initHairTextures();
    this.initFacialTextures();
    this.initPersonIconTextures();
  },
  initPersonIconTextures: function() {
    this.modifiersTextures = {
      highMorale: PIXI.Texture.fromImage('assets/people/star.png'),
      lowMorale: PIXI.Texture.fromImage('assets/people/warning.png'),
      positive: PIXI.Texture.fromImage('assets/people/plus.png'),
      negative: PIXI.Texture.fromImage('assets/people/less.png'),
      love: PIXI.Texture.fromImage('assets/people/love.png'),
      racist: PIXI.Texture.fromImage('assets/people/less.png'),
      homophobia: PIXI.Texture.fromImage('assets/people/homophobia.png'),
      claustrophobic: PIXI.Texture.fromImage('assets/people/claustrophobic.png')
    };
  },
  initBodyTextures: function() {
    this.bodySpriteSheet = PIXI.Texture.fromImage('assets/people/person.sheet.png');

    this.textures.body = {};
    var i = 0;
    var h = 100;
    var w = 70 * 100 / 100;
    this.textures.body.standing = [];
    for (i = 0; i < 8; i++) {
      this.textures.body.standing.push(this.getTexture(this.bodySpriteSheet, w, h, h * 0, i));
    }
    this.textures.body.working = [];
    for (i = 1; i < 8; i++) {
      this.textures.body.working.push(this.getTexture(this.bodySpriteSheet, w, h, h * 0, i));
    }
    this.textures.body.running = [];
    for (i = 0; i < 9; i++) {
      this.textures.body.running.push(this.getTexture(this.bodySpriteSheet, w, h, h, i));
    }
    this.textures.body.runningLeft = [];
    for (i = 0; i < 9; i++) {
      this.textures.body.runningLeft.push(this.getTexture(this.bodySpriteSheet, w, h, h * 2, i));
    }
    this.textures.body.climbing = [];
    for (i = 0; i < 4; i++) {
      this.textures.body.climbing.push(this.getTexture(this.bodySpriteSheet, w, h, h * 3, i));
    }
    this.textures.body.fixing = [];
    for (i = 0; i < 4; i++) {
      this.textures.body.fixing.push(this.getTexture(this.bodySpriteSheet, w, h, h * 4, i));
    }
    this.textures.body.fixing2 = [];
    for (i = 0; i < 6; i++) {
      this.textures.body.fixing2.push(this.getTexture(this.bodySpriteSheet, w, h, h * 5, i));
    }
    this.textures.body.standingColor = [];
    for (i = 0; i < 8; i++) {
      this.textures.body.standingColor.push(this.getTexture(this.bodySpriteSheet, w, h, h * 6, i));
    }
    this.textures.body.sideWork = [];
    for (i = 0; i < 1; i++) {
      this.textures.body.sideWork.push(this.getTexture(this.bodySpriteSheet, w, h, h * 7, i));
    }
    this.textures.body.death = [];
    for (i = 0; i < 6; i++) {
      this.textures.body.death.push(this.getTexture(this.bodySpriteSheet, w, h, h * 8, i));
    }

    this.textures.body.attack = [];
    for (i = 0; i < 2; i++) {
      this.textures.body.attack.push(this.getTexture(this.bodySpriteSheet, w, h, h * 9, i));
    }
    this.textures.body.attackLeft = [];
    for (i = 0; i < 2; i++) {
      this.textures.body.attackLeft.push(this.getTexture(this.bodySpriteSheet, w, h, h * 10, i));
    }
  },
  initHeadTextures: function() {
    this.headSpriteSheet = PIXI.Texture.fromImage('assets/people/head.sheet.png');
    this.textures.head = [];
    var i = 0;
    var j = 0;
    var w = 100;
    for (i = 0; i < 2; i++) {
      this.textures.head[i] = {};
      this.textures.head[i].standing = (
        new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(0, w + i * w * 2, w, w))
      );
      this.textures.head[i].back = (
        new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(w * 4, w + i * w * 2, w, w))
      );
      this.textures.head[i].blinking = (
        new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(w, w + i * w * 2, w, w))
      );
      this.textures.head[i].talking = [];
      for (j = 0; j < 2; j++) {
        this.textures.head[i].talking.push(
          new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(w * 2 + w * j, w + i * w * 2, w, w))
        );
      }
      this.textures.head[i].side = [];
      for (j = 0; j < 2; j++) {
        this.textures.head[i].side.push(
          new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(w * j, i * w * 2, w, w))
        );
      }
      this.textures.head[i].sideLeft = [];
      for (j = 0; j < 2; j++) {
        this.textures.head[i].sideLeft.push(
          new PIXI.Texture(this.headSpriteSheet, new PIXI.Rectangle(2 * w + w * j, i * w * 2, w, w))
        );
      }
    }
  },
  initHairTextures: function() {
    this.hairSpriteSheet = PIXI.Texture.fromImage('assets/people/hair.sheet.png');
    this.textures.hair = [];
    var i = 0;
    var j = 0;
    var w = 100;
    for (i = 0; i < 5; i++) {
      this.textures.hair[i] = {};
      this.textures.hair[i].standing = (
        new PIXI.Texture(this.hairSpriteSheet, new PIXI.Rectangle(0, w * i, w, w))
      );

      this.textures.hair[i].back = (
        new PIXI.Texture(this.hairSpriteSheet, new PIXI.Rectangle(2 * w, w * i, w, w))
      );

      this.textures.hair[i].side = (
        new PIXI.Texture(this.hairSpriteSheet, new PIXI.Rectangle(w, w * i, w, w))
      );

      this.textures.hair[i].sideLeft = (
        new PIXI.Texture(this.hairSpriteSheet, new PIXI.Rectangle(3 * w, w * i, w, w))
      );

    }
  },
  initFacialTextures: function() {
    this.facialSpriteSheet = PIXI.Texture.fromImage('assets/people/facefeatures.sheet.png');
    this.textures.facialFeatures = [];
    var i = 0;
    var j = 0;
    var w = 100;
    for (i = 0; i < 7; i++) {
      this.textures.facialFeatures[i] = {};
      this.textures.facialFeatures[i].standing = (
        new PIXI.Texture(this.facialSpriteSheet, new PIXI.Rectangle(0, w * i, w, w))
      );

      this.textures.facialFeatures[i].back = (
        new PIXI.Texture(this.facialSpriteSheet, new PIXI.Rectangle(2 * w, w * i, w, w))
      );

      this.textures.facialFeatures[i].side = (
        new PIXI.Texture(this.facialSpriteSheet, new PIXI.Rectangle(w, w * i, w, w))
      );

      this.textures.facialFeatures[i].sideLeft = (
        new PIXI.Texture(this.facialSpriteSheet, new PIXI.Rectangle(3 * w, w * i, w, w))
      );

    }
  },
  getTexture: function(spriteSheet, width, height, offsetY, i) {
    var sheetHeight = 100 * 10;
    return new PIXI.Texture(spriteSheet, new PIXI.Rectangle(width * i, sheetHeight - offsetY, width, height));
  }
};
window.boot.assets.person.initTextures();
