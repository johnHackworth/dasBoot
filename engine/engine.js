window.pixEngine = window.pixEngine || {};
pixEngine.Engine = function(options) {
  this.counter = 0;
  this.internalCounter = 0;
  this.entities = [];
  this.renderer = options.renderer;
  this.stage = options.stage;
};

pixEngine.Engine.prototype.speed = 6;

pixEngine.Engine.prototype.gameloop = function() {
  if (this.fps) {
    setTimeout(this.gameloop.bind(this), Math.floor(1000 / this.fps));
  } else {
    requestAnimFrame(this.gameloop.bind(this));
  }
  if (this.running === true) {
    this.internalCounter++;
    if (this.internalCounter % this.speed === 0) {
      this.counter++;
    }
    this.stage.tick(this.counter);
    var n = 0;
    for (var i in this.entities) {
      n++;
      this.entities[i].tick(this.counter, this.internalCounter % this.speed === 0);
    }

  }
  this.renderer.render(this.stage.pixiStage);
}

pixEngine.Engine.prototype.addEntity = function(entity) {
  if (this.searchEntity(entity) < 0) {
    this.entities.push(entity)
  }
}

pixEngine.Engine.prototype.searchEntity = function(entity) {
  for (var i in this.entities) {
    if (this.entities[i] === entity) {
      return i;
    }
  }
  return -1;
}

pixEngine.Engine.prototype.removeEntity = function(entity) {
  var n = this.searchEntity(entity);
  if (n >= 0) {
    this.entities.splice(n, 1);
  }
}