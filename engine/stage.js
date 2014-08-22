window.pixEngine = window.pixEngine || {};

pixEngine.Stage = function(options) {
  this.supportsWebGL = function() {
    try {
      var canvas = document.createElement('canvas');
      return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
    return true;
  };
  var self = this;
  pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
  // this.pixiStage = new PIXI.Stage(0x67EBA1, true);
  this.pixiStage = new PIXI.Stage(0x444444, true);

  //  if (this.supportsWebGL()) {
  this.renderer = PIXI.autoDetectRenderer(
    options.width,
    options.height,
    null,
    null,
    true
  );
  this.assets = options.assets;
  this.engine = new window.pixEngine.Engine({
    renderer: this.renderer,
    stage: this
  });

  this.engine.fps = options.fps;

  this.mouse = new pixEngine.Mouse(options.width, options.height, this);
  this.mouse.on('click', function(mousedata) {
    self.engine.running = true;
    self.trigger('click', mousedata);
  });
  this.initStage = options.init;

  this.keyManager = new pixEngine.utils.Keyboard();

  this.viewport = new pixEngine.Viewport({
    keyManager: this.keyManager,
    maxX: options.maxX || options.width,
    maxY: options.maxY || options.height,
    minX: options.minX || 0,
    minY: options.minY || 0,
    width: options.width,
    height: options.height,
    x: Math.floor(options.width / 2),
    y: Math.floor(options.height / 2)
  });
  /* } else {
    var loader = document.getElementById('loader');
    loader.innerHTML = 'Your browser doesn\'t support webGL, sorry';
    loader.setAttribute('class', 'warning');
    this.init = function() {};
  }*/
};

pixEngine.Stage.prototype.baseEntityNumber = 0;
pixEngine.Stage.prototype.init = function() {
  var self = this;
  document.body.appendChild(this.renderer.view);

  this.viewport.trackMouse();
  if (this.assets && this.assets.length) {
    this.loader = new PIXI.AssetLoader(this.assets);
    this.loader.onComplete = function() {
      self.initStage(self);
      self.engine.gameloop();
    };
    this.loader.load();
  } else {
    self.initStage(self);
    self.engine.gameloop();
  }
};

pixEngine.Stage.prototype.tick = function(counter) {
  this.viewport.tick(counter);
  this.trigger('tick');
};

pixEngine.Stage.prototype.addEntity = function(entity) {
  if (entity.view.length > 0) {
    for (var i in entity.view) {
      this.pixiStage.addChild(entity.view[i]);
    }
  } else {
    this.pixiStage.addChild(entity.view);
  }
  this.engine.addEntity(entity);

};
pixEngine.Stage.prototype.addEntityAfter = function(entity, after) {
  if (entity.view.length > 0) {
    for (var i in entity.view) {
      this.addViewAfter(entity.view[i], after);
    }
  } else {
    this.addViewAfter(entity.view, after);
  }
  this.engine.addEntity(entity);
};
pixEngine.Stage.prototype.addEntityBefore = function(entity, before) {
  if (entity.view.length > 0) {
    for (var i in entity.view) {
      this.addViewBefore(entity.view[i], before);
    }
  } else {
    this.addViewBefore(entity.view, before);
  }
  this.engine.addEntity(entity);
};
pixEngine.Stage.prototype.removeEntity = function(entity) {
  if (entity.view && entity.view.length) {
    for (var l = entity.view.length - 1; l; l--) {
      this.removeView(entity.view[l]);
    }
  } else if (entity.view) {
    this.removeView(entity.view);
  }

  this.engine.removeEntity(entity);
};

pixEngine.Stage.prototype.addVisualEntity = function(entity) {
  this.pixiStage.addChild(entity);
};

pixEngine.Stage.prototype.addNotVisualEntity = function(entity) {
  this.engine.addEntity(entity);
};

pixEngine.Stage.prototype.removeView = function(entity) {
  this.pixiStage.removeChild(entity);
};

pixEngine.Stage.prototype.addViewAfter = function(entity, afterEntity) {
  this.pixiStage.addChild(entity);
  var i = this.pixiStage.children.indexOf(afterEntity);
  i = i > this.baseEntityNumber ? i : this.baseEntityNumber;
  if (i >= 0) {
    var pixiEntity = this.pixiStage.children.pop();
    this.pixiStage.children.splice(i + 1, 0, pixiEntity);
  }
};
pixEngine.Stage.prototype.addViewBefore = function(entity, afterEntity) {
  this.pixiStage.addChild(entity);
  var i = this.pixiStage.children.indexOf(afterEntity);
  var position = i > 1 ? i : 0;
  var pixiEntity = this.pixiStage.children.pop();
  this.pixiStage.children.splice(position, 0, pixiEntity);
};
pixEngine.Stage.prototype.resetPixiView = function(condition, value) {
  var removables = [];
  for (var i in this.pixiStage.children) {
    if (!condition || this.pixiStage.children[i][condition] === value) {
      removables.push(this.pixiStage.children[i]);
    }
  }
  for (var j in removables) {
    this.pixiStage.removeChild(removables[j]);
  }
};

pixEngine.Stage.prototype.toFrontPixiView = function(condition, value) {
  var removables = [];
  for (var i in this.pixiStage.children) {
    if (!condition || this.pixiStage.children[i][condition] === value) {
      removables.push(this.pixiStage.children[i]);
    }
  }
  for (var j in removables) {
    this.pixiStage.removeChild(removables[j]);
    this.pixiStage.addChild(removables[j]);
  }
};

pixEngine.Stage.prototype.addText = function(text, options, destroyables) {
  fontSize = options.fontSize || '30px';
  color = options.color || '#333333';
  x = options.x || 0;
  y = options.y || 0;
  centered = options.centered || 0;
  var textView = new PIXI.Text(text, {
    font: fontSize + " Verdana",
    fill: color
  });
  textView.x = x;
  if (centered) {
    textView.x -= textView.width / 2;
  }
  textView.y = y;
  textView.viewType = 'text';
  this.addVisualEntity(textView);
  if (destroyables) {
    destroyables.push(textView);
  }
  return textView;
};


pixEngine.Stage.prototype.addImage = function(image, options, destroyables) {
  var x = options.x || 0;
  var y = options.y || 0;
  var scale = options.scale || 1;
  var centered = options.centered || false;
  var height = options.height;
  var width = options.width;
  var picture = new PIXI.Sprite.fromImage(image);
  if (height) {
    picture.height = height;
  }
  if (width) {
    picture.width = width;
  }
  picture.x = x;
  if (centered) {
    picture.x -= picture.width * scale / 2;
  }
  picture.y = y;
  picture.scale.set(scale);
  picture.viewType = 'text';
  if (options.after) {
    this.addViewAfter(picture, options.after);
  } else if (options.before) {
    this.addViewBefore(picture, options.before);
  } else {
    this.addVisualEntity(picture);
  }
  if (destroyables) {
    destroyables.push(picture);
  }
  return picture;
};

pixEngine.Stage.prototype.addBackground = function(x, y, width, height, color, opacity, destroyables) {
  x = x || 0;
  y = y || 0;
  width = width || 500;
  height = height || 500;
  color = color || 0xD2F47A;
  opacity = opacity || 0.5;
  background = new PIXI.Graphics();
  background.clear();
  background.beginFill(color);

  background.moveTo(x, y);
  background.lineTo(x + width, y);
  background.lineTo(x + width, y + height);
  background.lineTo(x, y + height);
  background.lineTo(x, y);
  background.endFill();
  background.alpha = opacity;
  background.viewType = 'text';
  this.addVisualEntity(background);
  if (destroyables) {
    destroyables.push(background);
  }

  return background;
};