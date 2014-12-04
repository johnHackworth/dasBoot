window.boot = window.boot || {};
window.boot.extensions = window.boot.extensions || {};

window.boot.extensions.personDecoration = function() {};

window.boot.extensions.personDecoration.prototype = {
  iconAssets: boot.assets.person.modifiersTextures,
  select: function() {
    this.selectedHalo = new PIXI.Sprite.fromImage('assets/ui/selected.png');
    this.selectedHalo.width = this.view.width;
    this.selectedHalo.height = this.view.height;
    this.view.addChild(this.selectedHalo);
    this.addDestinationView();
  },
  unselect: function() {
    this.view.removeChild(this.selectedHalo);
    this.view.removeChild(this.destinationView);
    this.selectedHalo = null;
  },
  adjustUI: function(counter) {
    if (this.selectedHalo) {
      this.selectedHalo.y = -7;
    }
    this.updateHealthBar(this.pos.x, this.pos.y);
    if (this.status === 'dead') {
      this.setHealthBarVisibility(false);
    }

    this.adjustMoraleMarker(counter);
    this.adjustModiffiers(counter);

  },
  initMoraleMarker: function() {
    this.currentModifierMarker = new PIXI.Sprite(this.iconAssets.lowMorale);
    this.moraleMarker = new PIXI.Sprite(this.iconAssets.highMorale);

    this.currentModifierMarker.width = 18;
    this.currentModifierMarker.height = 16;
    this.currentModifierMarker.anchor.x = 0.5;
    this.currentModifierMarker.anchor.y = 0.5;
    this.currentModifierMarker.visible = false;

    this.moraleMarker.width = 18;
    this.moraleMarker.height = 16;
    this.moraleMarker.anchor.x = 0.5;
    this.moraleMarker.anchor.y = 0.5;

    this.view.addChild(this.moraleMarker);
    this.view.addChild(this.currentModifierMarker);
  },
  adjustMoraleMarker: function(counter) {
    if (counter % 5 === 0) {
      this.moraleMarker.y = -15;
      this.moraleMarker.x = 22;
      if (this.inspiration === 1) {
        this.moraleMarker.visible = false;
      } else {
        this.moraleMarker.visible = true;
        if (counter % 20 === 0) {
          this.moraleMarker.height = 16 + counter % 40 / 40;
          this.moraleMarker.width = 18 + counter % 40 / 40;
          this.moraleMarker.x -= (counter % 40 / 40);
          this.moraleMarker.y -= (counter % 40 / 40);
        }
        if (counter % 5 === 0) {
          if (this.inspiration > 1) {
            this.moraleMarker.rotation += 0.1;
          } else {
            this.moraleMarker.rotation = 0;
          }
        }
      }
    }
  },
  setMoraleMarker: function(type) {
    if (type != 'high') {
      this.moraleMarker.setTexture(this.iconAssets.lowMorale);
    } else {
      this.moraleMarker.setTexture(this.iconAssets.highMorale);
    }
  },
  adjustModiffiers: function(counter) {
    if (this.currentModiffier) {
      this.adjustCurrentModiffier(counter);
    } else if (this.moraleModiffiers && this.moraleModiffiers.length) {
      this.adjustNewModiffier(counter);
    }
    this.currentModifierMarker.visible = false;
  },
  adjustCurrentModiffier: function(counter) {
    this.currentModiffier--;
    if (counter % 5 === 0) {
      this.currentModifierMarker.y = -15 + this.currentModiffier / 2;
      this.currentModifierMarker.x = 22;

    }

    if (!this.currentModiffier) {
      this.currentModifierMarker.visible = false;
    }
  },
  adjustNewModiffier: function(counter) {
    this.currentModiffier = 60;
    var type = this.moraleModiffiers.shift();
    this.currentModifierMarker.setTexture(this.iconAssets[type]);
  }
};