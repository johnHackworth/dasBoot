/** echo  * @license echo  * while read i do echo  *  done echo
 */
! function() {
  var Color, K, PITHIRD, TWOPI, X, Y, Z, bezier, brewer, chroma, clip_rgb, colors, cos, css2rgb, hex2rgb, hsi2rgb, hsl2rgb, hsv2rgb, lab2lch, lab2rgb, lab_xyz, lch2lab, lch2rgb, limit, luminance, luminance_x, rgb2hex, rgb2hsi, rgb2hsl, rgb2hsv, rgb2lab, rgb2lch, rgb_xyz, root, type, unpack, xyz_lab, xyz_rgb, _ref;
  chroma = function(x, y, z, m) {
    return new Color(x, y, z, m)
  };
  if (typeof module !== "undefined" && module !== null && module.exports != null) {
    module.exports = chroma
  }
  if (typeof define === "function" && define.amd) {
    define([], function() {
      return chroma
    })
  } else {
    root = typeof exports !== "undefined" && exports !== null ? exports : this;
    root.chroma = chroma
  }
  chroma.color = function(x, y, z, m) {
    return new Color(x, y, z, m)
  };
  chroma.hsl = function(h, s, l, a) {
    return new Color(h, s, l, a, "hsl")
  };
  chroma.hsv = function(h, s, v, a) {
    return new Color(h, s, v, a, "hsv")
  };
  chroma.rgb = function(r, g, b, a) {
    return new Color(r, g, b, a, "rgb")
  };
  chroma.hex = function(x) {
    return new Color(x)
  };
  chroma.css = function(x) {
    return new Color(x)
  };
  chroma.lab = function(l, a, b) {
    return new Color(l, a, b, "lab")
  };
  chroma.lch = function(l, c, h) {
    return new Color(l, c, h, "lch")
  };
  chroma.hsi = function(h, s, i) {
    return new Color(h, s, i, "hsi")
  };
  chroma.gl = function(r, g, b, a) {
    return new Color(r * 255, g * 255, b * 255, a, "gl")
  };
  chroma.interpolate = function(a, b, f, m) {
    if (a == null || b == null) {
      return "#000"
    }
    if (type(a) === "string") {
      a = new Color(a)
    }
    if (type(b) === "string") {
      b = new Color(b)
    }
    return a.interpolate(f, b, m)
  };
  chroma.mix = chroma.interpolate;
  chroma.contrast = function(a, b) {
    var l1, l2;
    if (type(a) === "string") {
      a = new Color(a)
    }
    if (type(b) === "string") {
      b = new Color(b)
    }
    l1 = a.luminance();
    l2 = b.luminance();
    if (l1 > l2) {
      return (l1 + .05) / (l2 + .05)
    } else {
      return (l2 + .05) / (l1 + .05)
    }
  };
  chroma.luminance = function(color) {
    return chroma(color).luminance()
  };
  chroma._Color = Color;
  Color = function() {
    function Color() {
      var a, arg, args, m, me, me_rgb, x, y, z, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
      me = this;
      args = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        if (arg != null) {
          args.push(arg)
        }
      }
      if (args.length === 0) {
        _ref = [255, 0, 255, 1, "rgb"], x = _ref[0], y = _ref[1], z = _ref[2], a = _ref[3], m = _ref[4]
      } else if (type(args[0]) === "array") {
        if (args[0].length === 3) {
          _ref1 = args[0], x = _ref1[0], y = _ref1[1], z = _ref1[2];
          a = 1
        } else if (args[0].length === 4) {
          _ref2 = args[0], x = _ref2[0], y = _ref2[1], z = _ref2[2], a = _ref2[3]
        } else {
          throw "unknown input argument"
        }
        m = (_ref3 = args[1]) != null ? _ref3 : "rgb"
      } else if (type(args[0]) === "string") {
        x = args[0];
        m = "hex"
      } else if (type(args[0]) === "object") {
        _ref4 = args[0]._rgb, x = _ref4[0], y = _ref4[1], z = _ref4[2], a = _ref4[3];
        m = "rgb"
      } else if (args.length >= 3) {
        x = args[0];
        y = args[1];
        z = args[2]
      }
      if (args.length === 3) {
        m = "rgb";
        a = 1
      } else if (args.length === 4) {
        if (type(args[3]) === "string") {
          m = args[3];
          a = 1
        } else if (type(args[3]) === "number") {
          m = "rgb";
          a = args[3]
        }
      } else if (args.length === 5) {
        a = args[3];
        m = args[4]
      }
      if (a == null) {
        a = 1
      }
      if (m === "rgb") {
        me._rgb = [x, y, z, a]
      } else if (m === "gl") {
        me._rgb = [x * 255, y * 255, z * 255, a]
      } else if (m === "hsl") {
        me._rgb = hsl2rgb(x, y, z);
        me._rgb[3] = a
      } else if (m === "hsv") {
        me._rgb = hsv2rgb(x, y, z);
        me._rgb[3] = a
      } else if (m === "hex") {
        me._rgb = hex2rgb(x)
      } else if (m === "lab") {
        me._rgb = lab2rgb(x, y, z);
        me._rgb[3] = a
      } else if (m === "lch") {
        me._rgb = lch2rgb(x, y, z);
        me._rgb[3] = a
      } else if (m === "hsi") {
        me._rgb = hsi2rgb(x, y, z);
        me._rgb[3] = a
      }
      me_rgb = clip_rgb(me._rgb)
    }
    Color.prototype.rgb = function() {
      return this._rgb.slice(0, 3)
    };
    Color.prototype.rgba = function() {
      return this._rgb
    };
    Color.prototype.hex = function() {
      return rgb2hex(this._rgb)
    };
    Color.prototype.toString = function() {
      return this.name()
    };
    Color.prototype.hsl = function() {
      return rgb2hsl(this._rgb)
    };
    Color.prototype.hsv = function() {
      return rgb2hsv(this._rgb)
    };
    Color.prototype.lab = function() {
      return rgb2lab(this._rgb)
    };
    Color.prototype.lch = function() {
      return rgb2lch(this._rgb)
    };
    Color.prototype.hsi = function() {
      return rgb2hsi(this._rgb)
    };
    Color.prototype.gl = function() {
      return [this._rgb[0] / 255, this._rgb[1] / 255, this._rgb[2] / 255, this._rgb[3]]
    };
    Color.prototype.luminance = function(lum, mode) {
      var cur_lum, eps, max_iter, test;
      if (mode == null) {
        mode = "rgb"
      }
      if (!arguments.length) {
        return luminance(this._rgb)
      }
      if (lum === 0) {
        this._rgb = [0, 0, 0, this._rgb[3]]
      }
      if (lum === 1) {
        this._rgb = [255, 255, 255, this._rgb[3]]
      }
      cur_lum = luminance(this._rgb);
      eps = 1e-7;
      max_iter = 20;
      test = function(l, h) {
        var lm, m;
        m = l.interpolate(.5, h, mode);
        lm = m.luminance();
        if (Math.abs(lum - lm) < eps || !max_iter--) {
          return m
        }
        if (lm > lum) {
          return test(l, m)
        }
        return test(m, h)
      };
      this._rgb = (cur_lum > lum ? test(new Color("black"), this) : test(this, new Color("white"))).rgba();
      return this
    };
    Color.prototype.name = function() {
      var h, k;
      h = this.hex();
      for (k in chroma.colors) {
        if (h === chroma.colors[k]) {
          return k
        }
      }
      return h
    };
    Color.prototype.alpha = function(alpha) {
      if (arguments.length) {
        this._rgb[3] = alpha;
        return this
      }
      return this._rgb[3]
    };
    Color.prototype.css = function(mode) {
      var hsl, me, rgb, rnd;
      if (mode == null) {
        mode = "rgb"
      }
      me = this;
      rgb = me._rgb;
      if (mode.length === 3 && rgb[3] < 1) {
        mode += "a"
      }
      if (mode === "rgb") {
        return mode + "(" + rgb.slice(0, 3).map(Math.round).join(",") + ")"
      } else if (mode === "rgba") {
        return mode + "(" + rgb.slice(0, 3).map(Math.round).join(",") + "," + rgb[3] + ")"
      } else if (mode === "hsl" || mode === "hsla") {
        hsl = me.hsl();
        rnd = function(a) {
          return Math.round(a * 100) / 100
        };
        hsl[0] = rnd(hsl[0]);
        hsl[1] = rnd(hsl[1] * 100) + "%";
        hsl[2] = rnd(hsl[2] * 100) + "%";
        if (mode.length === 4) {
          hsl[3] = rgb[3]
        }
        return mode + "(" + hsl.join(",") + ")"
      }
    };
    Color.prototype.interpolate = function(f, col, m) {
      var dh, hue, hue0, hue1, lbv, lbv0, lbv1, me, res, sat, sat0, sat1, xyz0, xyz1;
      me = this;
      if (m == null) {
        m = "rgb"
      }
      if (type(col) === "string") {
        col = new Color(col)
      }
      if (m === "hsl" || m === "hsv" || m === "lch" || m === "hsi") {
        if (m === "hsl") {
          xyz0 = me.hsl();
          xyz1 = col.hsl()
        } else if (m === "hsv") {
          xyz0 = me.hsv();
          xyz1 = col.hsv()
        } else if (m === "hsi") {
          xyz0 = me.hsi();
          xyz1 = col.hsi()
        } else if (m === "lch") {
          xyz0 = me.lch();
          xyz1 = col.lch()
        }
        if (m.substr(0, 1) === "h") {
          hue0 = xyz0[0], sat0 = xyz0[1], lbv0 = xyz0[2];
          hue1 = xyz1[0], sat1 = xyz1[1], lbv1 = xyz1[2]
        } else {
          lbv0 = xyz0[0], sat0 = xyz0[1], hue0 = xyz0[2];
          lbv1 = xyz1[0], sat1 = xyz1[1], hue1 = xyz1[2]
        } if (!isNaN(hue0) && !isNaN(hue1)) {
          if (hue1 > hue0 && hue1 - hue0 > 180) {
            dh = hue1 - (hue0 + 360)
          } else if (hue1 < hue0 && hue0 - hue1 > 180) {
            dh = hue1 + 360 - hue0
          } else {
            dh = hue1 - hue0
          }
          hue = hue0 + f * dh
        } else if (!isNaN(hue0)) {
          hue = hue0;
          if ((lbv1 === 1 || lbv1 === 0) && m !== "hsv") {
            sat = sat0
          }
        } else if (!isNaN(hue1)) {
          hue = hue1;
          if ((lbv0 === 1 || lbv0 === 0) && m !== "hsv") {
            sat = sat1
          }
        } else {
          hue = Number.NaN
        } if (sat == null) {
          sat = sat0 + f * (sat1 - sat0)
        }
        lbv = lbv0 + f * (lbv1 - lbv0);
        if (m.substr(0, 1) === "h") {
          res = new Color(hue, sat, lbv, m)
        } else {
          res = new Color(lbv, sat, hue, m)
        }
      } else if (m === "rgb") {
        xyz0 = me._rgb;
        xyz1 = col._rgb;
        res = new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m)
      } else if (m === "lab") {
        xyz0 = me.lab();
        xyz1 = col.lab();
        res = new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m)
      } else {
        throw "color mode " + m + " is not supported"
      }
      res.alpha(me.alpha() + f * (col.alpha() - me.alpha()));
      return res
    };
    Color.prototype.premultiply = function() {
      var a, rgb;
      rgb = this.rgb();
      a = this.alpha();
      return chroma(rgb[0] * a, rgb[1] * a, rgb[2] * a, a)
    };
    Color.prototype.darken = function(amount) {
      var lch, me;
      if (amount == null) {
        amount = 20
      }
      me = this;
      lch = me.lch();
      lch[0] -= amount;
      return chroma.lch(lch).alpha(me.alpha())
    };
    Color.prototype.darker = function(amount) {
      return this.darken(amount)
    };
    Color.prototype.brighten = function(amount) {
      if (amount == null) {
        amount = 20
      }
      return this.darken(-amount)
    };
    Color.prototype.brighter = function(amount) {
      return this.brighten(amount)
    };
    Color.prototype.saturate = function(amount) {
      var lch, me;
      if (amount == null) {
        amount = 20
      }
      me = this;
      lch = me.lch();
      lch[1] += amount;
      return chroma.lch(lch).alpha(me.alpha())
    };
    Color.prototype.desaturate = function(amount) {
      if (amount == null) {
        amount = 20
      }
      return this.saturate(-amount)
    };
    return Color
  }();
  clip_rgb = function(rgb) {
    var i;
    for (i in rgb) {
      if (i < 3) {
        if (rgb[i] < 0) {
          rgb[i] = 0
        }
        if (rgb[i] > 255) {
          rgb[i] = 255
        }
      } else if (i === 3) {
        if (rgb[i] < 0) {
          rgb[i] = 0
        }
        if (rgb[i] > 1) {
          rgb[i] = 1
        }
      }
    }
    return rgb
  };
  css2rgb = function(css) {
    var hsl, i, m, rgb, _i, _j, _k, _l;
    css = css.toLowerCase();
    if (chroma.colors != null && chroma.colors[css]) {
      return hex2rgb(chroma.colors[css])
    }
    if (m = css.match(/rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/)) {
      rgb = m.slice(1, 4);
      for (i = _i = 0; _i <= 2; i = ++_i) {
        rgb[i] = +rgb[i]
      }
      rgb[3] = 1
    } else if (m = css.match(/rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/)) {
      rgb = m.slice(1, 5);
      for (i = _j = 0; _j <= 3; i = ++_j) {
        rgb[i] = +rgb[i]
      }
    } else if (m = css.match(/rgb\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)) {
      rgb = m.slice(1, 4);
      for (i = _k = 0; _k <= 2; i = ++_k) {
        rgb[i] = Math.round(rgb[i] * 2.55)
      }
      rgb[3] = 1
    } else if (m = css.match(/rgba\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)) {
      rgb = m.slice(1, 5);
      for (i = _l = 0; _l <= 2; i = ++_l) {
        rgb[i] = Math.round(rgb[i] * 2.55)
      }
      rgb[3] = +rgb[3]
    } else if (m = css.match(/hsl\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)) {
      hsl = m.slice(1, 4);
      hsl[1] *= .01;
      hsl[2] *= .01;
      rgb = hsl2rgb(hsl);
      rgb[3] = 1
    } else if (m = css.match(/hsla\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)) {
      hsl = m.slice(1, 4);
      hsl[1] *= .01;
      hsl[2] *= .01;
      rgb = hsl2rgb(hsl);
      rgb[3] = +m[4]
    }
    return rgb
  };
  hex2rgb = function(hex) {
    var a, b, g, r, rgb, u;
    if (hex.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      if (hex.length === 4 || hex.length === 7) {
        hex = hex.substr(1)
      }
      if (hex.length === 3) {
        hex = hex.split("");
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      }
      u = parseInt(hex, 16);
      r = u >> 16;
      g = u >> 8 & 255;
      b = u & 255;
      return [r, g, b, 1]
    }
    if (hex.match(/^#?([A-Fa-f0-9]{8})$/)) {
      if (hex.length === 9) {
        hex = hex.substr(1)
      }
      u = parseInt(hex, 16);
      r = u >> 24 & 255;
      g = u >> 16 & 255;
      b = u >> 8 & 255;
      a = u & 255;
      return [r, g, b, a]
    }
    if (rgb = css2rgb(hex)) {
      return rgb
    }
    throw "unknown color: " + hex
  };
  hsi2rgb = function(h, s, i) {
    var b, g, r, _ref;
    _ref = unpack(arguments), h = _ref[0], s = _ref[1], i = _ref[2];
    h /= 360;
    if (h < 1 / 3) {
      b = (1 - s) / 3;
      r = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      g = 1 - (b + r)
    } else if (h < 2 / 3) {
      h -= 1 / 3;
      r = (1 - s) / 3;
      g = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      b = 1 - (r + g)
    } else {
      h -= 2 / 3;
      g = (1 - s) / 3;
      b = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      r = 1 - (g + b)
    }
    r = limit(i * r * 3);
    g = limit(i * g * 3);
    b = limit(i * b * 3);
    return [r * 255, g * 255, b * 255]
  };
  hsl2rgb = function() {
    var b, c, g, h, i, l, r, s, t1, t2, t3, _i, _ref, _ref1;
    _ref = unpack(arguments), h = _ref[0], s = _ref[1], l = _ref[2];
    if (s === 0) {
      r = g = b = l * 255
    } else {
      t3 = [0, 0, 0];
      c = [0, 0, 0];
      t2 = l < .5 ? l * (1 + s) : l + s - l * s;
      t1 = 2 * l - t2;
      h /= 360;
      t3[0] = h + 1 / 3;
      t3[1] = h;
      t3[2] = h - 1 / 3;
      for (i = _i = 0; _i <= 2; i = ++_i) {
        if (t3[i] < 0) {
          t3[i] += 1
        }
        if (t3[i] > 1) {
          t3[i] -= 1
        }
        if (6 * t3[i] < 1) {
          c[i] = t1 + (t2 - t1) * 6 * t3[i]
        } else if (2 * t3[i] < 1) {
          c[i] = t2
        } else if (3 * t3[i] < 2) {
          c[i] = t1 + (t2 - t1) * (2 / 3 - t3[i]) * 6
        } else {
          c[i] = t1
        }
      }
      _ref1 = [Math.round(c[0] * 255), Math.round(c[1] * 255), Math.round(c[2] * 255)], r = _ref1[0], g = _ref1[1], b = _ref1[2]
    }
    return [r, g, b]
  };
  hsv2rgb = function() {
    var b, f, g, h, i, p, q, r, s, t, v, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    _ref = unpack(arguments), h = _ref[0], s = _ref[1], v = _ref[2];
    v *= 255;
    if (s === 0) {
      r = g = b = v
    } else {
      if (h === 360) {
        h = 0
      }
      if (h > 360) {
        h -= 360
      }
      if (h < 0) {
        h += 360
      }
      h /= 60;
      i = Math.floor(h);
      f = h - i;
      p = v * (1 - s);
      q = v * (1 - s * f);
      t = v * (1 - s * (1 - f));
      switch (i) {
        case 0:
          _ref1 = [v, t, p], r = _ref1[0], g = _ref1[1], b = _ref1[2];
          break;
        case 1:
          _ref2 = [q, v, p], r = _ref2[0], g = _ref2[1], b = _ref2[2];
          break;
        case 2:
          _ref3 = [p, v, t], r = _ref3[0], g = _ref3[1], b = _ref3[2];
          break;
        case 3:
          _ref4 = [p, q, v], r = _ref4[0], g = _ref4[1], b = _ref4[2];
          break;
        case 4:
          _ref5 = [t, p, v], r = _ref5[0], g = _ref5[1], b = _ref5[2];
          break;
        case 5:
          _ref6 = [v, p, q], r = _ref6[0], g = _ref6[1], b = _ref6[2]
      }
    }
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    return [r, g, b]
  };
  K = 18;
  X = .95047;
  Y = 1;
  Z = 1.08883;
  lab2lch = function() {
    var a, b, c, h, l, _ref;
    _ref = unpack(arguments), l = _ref[0], a = _ref[1], b = _ref[2];
    c = Math.sqrt(a * a + b * b);
    h = Math.atan2(b, a) / Math.PI * 180;
    return [l, c, h]
  };
  lab2rgb = function(l, a, b) {
    var g, r, x, y, z, _ref, _ref1;
    if (l !== void 0 && l.length === 3) {
      _ref = l, l = _ref[0], a = _ref[1], b = _ref[2]
    }
    if (l !== void 0 && l.length === 3) {
      _ref1 = l, l = _ref1[0], a = _ref1[1], b = _ref1[2]
    }
    y = (l + 16) / 116;
    x = y + a / 500;
    z = y - b / 200;
    x = lab_xyz(x) * X;
    y = lab_xyz(y) * Y;
    z = lab_xyz(z) * Z;
    r = xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z);
    g = xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z);
    b = xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z);
    return [limit(r, 0, 255), limit(g, 0, 255), limit(b, 0, 255), 1]
  };
  lab_xyz = function(x) {
    if (x > .206893034) {
      return x * x * x
    } else {
      return (x - 4 / 29) / 7.787037
    }
  };
  xyz_rgb = function(r) {
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055))
  };
  lch2lab = function() {
    var c, h, l, _ref;
    _ref = unpack(arguments), l = _ref[0], c = _ref[1], h = _ref[2];
    h = h * Math.PI / 180;
    return [l, Math.cos(h) * c, Math.sin(h) * c]
  };
  lch2rgb = function(l, c, h) {
    var L, a, b, g, r, _ref, _ref1;
    _ref = lch2lab(l, c, h), L = _ref[0], a = _ref[1], b = _ref[2];
    _ref1 = lab2rgb(L, a, b), r = _ref1[0], g = _ref1[1], b = _ref1[2];
    return [limit(r, 0, 255), limit(g, 0, 255), limit(b, 0, 255)]
  };
  luminance = function(r, g, b) {
    var _ref;
    _ref = unpack(arguments), r = _ref[0], g = _ref[1], b = _ref[2];
    r = luminance_x(r);
    g = luminance_x(g);
    b = luminance_x(b);
    return .2126 * r + .7152 * g + .0722 * b
  };
  luminance_x = function(x) {
    x /= 255;
    if (x <= .03928) {
      return x / 12.92
    } else {
      return Math.pow((x + .055) / 1.055, 2.4)
    }
  };
  rgb2hex = function() {
    var b, g, r, str, u, _ref;
    _ref = unpack(arguments), r = _ref[0], g = _ref[1], b = _ref[2];
    u = r << 16 | g << 8 | b;
    str = "000000" + u.toString(16);
    return "#" + str.substr(str.length - 6)
  };
  rgb2hsi = function() {
    var TWOPI, b, g, h, i, min, r, s, _ref;
    _ref = unpack(arguments), r = _ref[0], g = _ref[1], b = _ref[2];
    TWOPI = Math.PI * 2;
    r /= 255;
    g /= 255;
    b /= 255;
    min = Math.min(r, g, b);
    i = (r + g + b) / 3;
    s = 1 - min / i;
    if (s === 0) {
      h = 0
    } else {
      h = (r - g + (r - b)) / 2;
      h /= Math.sqrt((r - g) * (r - g) + (r - b) * (g - b));
      h = Math.acos(h);
      if (b > g) {
        h = TWOPI - h
      }
      h /= TWOPI
    }
    return [h * 360, s, i]
  };
  rgb2hsl = function(r, g, b) {
    var h, l, max, min, s, _ref;
    if (r !== void 0 && r.length >= 3) {
      _ref = r, r = _ref[0], g = _ref[1], b = _ref[2]
    }
    r /= 255;
    g /= 255;
    b /= 255;
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    l = (max + min) / 2;
    if (max === min) {
      s = 0;
      h = Number.NaN
    } else {
      s = l < .5 ? (max - min) / (max + min) : (max - min) / (2 - max - min)
    } if (r === max) {
      h = (g - b) / (max - min)
    } else if (g === max) {
      h = 2 + (b - r) / (max - min)
    } else if (b === max) {
      h = 4 + (r - g) / (max - min)
    }
    h *= 60;
    if (h < 0) {
      h += 360
    }
    return [h, s, l]
  };
  rgb2hsv = function() {
    var b, delta, g, h, max, min, r, s, v, _ref;
    _ref = unpack(arguments), r = _ref[0], g = _ref[1], b = _ref[2];
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    delta = max - min;
    v = max / 255;
    if (max === 0) {
      h = Number.NaN;
      s = 0
    } else {
      s = delta / max;
      if (r === max) {
        h = (g - b) / delta
      }
      if (g === max) {
        h = 2 + (b - r) / delta
      }
      if (b === max) {
        h = 4 + (r - g) / delta
      }
      h *= 60;
      if (h < 0) {
        h += 360
      }
    }
    return [h, s, v]
  };
  rgb2lab = function() {
    var b, g, r, x, y, z, _ref;
    _ref = unpack(arguments), r = _ref[0], g = _ref[1], b = _ref[2];
    r = rgb_xyz(r);
    g = rgb_xyz(g);
    b = rgb_xyz(b);
    x = xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / X);
    y = xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / Y);
    z = xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / Z);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)]
  };
  rgb_xyz = function(r) {
    if ((r /= 255) <= .04045) {
      return r / 12.92
    } else {
      return Math.pow((r + .055) / 1.055, 2.4)
    }
  };
  xyz_lab = function(x) {
    if (x > .008856) {
      return Math.pow(x, 1 / 3)
    } else {
      return 7.787037 * x + 4 / 29
    }
  };
  rgb2lch = function() {
    var a, b, g, l, r, _ref, _ref1;
    _ref = unpack(arguments), r = _ref[0], g = _ref[1], b = _ref[2];
    _ref1 = rgb2lab(r, g, b), l = _ref1[0], a = _ref1[1], b = _ref1[2];
    return lab2lch(l, a, b)
  };
  chroma.scale = function(colors, positions) {
    var classifyValue, f, getClass, getColor, resetCache, setColors, setDomain, tmap, _colorCache, _colors, _correctLightness, _domain, _fixed, _max, _min, _mode, _nacol, _numClasses, _out, _pos, _spread;
    _mode = "rgb";
    _nacol = chroma("#ccc");
    _spread = 0;
    _fixed = false;
    _domain = [0, 1];
    _colors = [];
    _out = false;
    _pos = [];
    _min = 0;
    _max = 1;
    _correctLightness = false;
    _numClasses = 0;
    _colorCache = {};
    setColors = function(colors, positions) {
      var c, col, _i, _j, _ref, _ref1, _ref2;
      if (colors == null) {
        colors = ["#ddd", "#222"]
      }
      if (colors != null && type(colors) === "string" && ((_ref = chroma.brewer) != null ? _ref[colors] : void 0) != null) {
        colors = chroma.brewer[colors]
      }
      if (type(colors) === "array") {
        colors = colors.slice(0);
        for (c = _i = 0, _ref1 = colors.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; c = 0 <= _ref1 ? ++_i : --_i) {
          col = colors[c];
          if (type(col) === "string") {
            colors[c] = chroma(col)
          }
        }
        if (positions != null) {
          _pos = positions
        } else {
          _pos = [];
          for (c = _j = 0, _ref2 = colors.length - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; c = 0 <= _ref2 ? ++_j : --_j) {
            _pos.push(c / (colors.length - 1))
          }
        }
      }
      resetCache();
      return _colors = colors
    };
    setDomain = function(domain) {
      if (domain == null) {
        domain = []
      }
      _domain = domain;
      _min = domain[0];
      _max = domain[domain.length - 1];
      resetCache();
      if (domain.length === 2) {
        return _numClasses = 0
      } else {
        return _numClasses = domain.length - 1
      }
    };
    getClass = function(value) {
      var i, n;
      if (_domain != null) {
        n = _domain.length - 1;
        i = 0;
        while (i < n && value >= _domain[i]) {
          i++
        }
        return i - 1
      }
      return 0
    };
    tmap = function(t) {
      return t
    };
    classifyValue = function(value) {
      var i, maxc, minc, n, val;
      val = value;
      if (_domain.length > 2) {
        n = _domain.length - 1;
        i = getClass(value);
        minc = _domain[0] + (_domain[1] - _domain[0]) * (0 + _spread * .5);
        maxc = _domain[n - 1] + (_domain[n] - _domain[n - 1]) * (1 - _spread * .5);
        val = _min + (_domain[i] + (_domain[i + 1] - _domain[i]) * .5 - minc) / (maxc - minc) * (_max - _min)
      }
      return val
    };
    getColor = function(val, bypassMap) {
      var c, col, f0, i, k, p, t, _i, _ref;
      if (bypassMap == null) {
        bypassMap = false
      }
      if (isNaN(val)) {
        return _nacol
      }
      if (!bypassMap) {
        if (_domain.length > 2) {
          c = getClass(val);
          t = c / (_numClasses - 1)
        } else {
          t = f0 = _min !== _max ? (val - _min) / (_max - _min) : 0;
          t = f0 = (val - _min) / (_max - _min);
          t = Math.min(1, Math.max(0, t))
        }
      } else {
        t = val
      } if (!bypassMap) {
        t = tmap(t)
      }
      k = Math.floor(t * 1e4);
      if (_colorCache[k]) {
        col = _colorCache[k]
      } else {
        if (type(_colors) === "array") {
          for (i = _i = 0, _ref = _pos.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            p = _pos[i];
            if (t <= p) {
              col = _colors[i];
              break
            }
            if (t >= p && i === _pos.length - 1) {
              col = _colors[i];
              break
            }
            if (t > p && t < _pos[i + 1]) {
              t = (t - p) / (_pos[i + 1] - p);
              col = chroma.interpolate(_colors[i], _colors[i + 1], t, _mode);
              break
            }
          }
        } else if (type(_colors) === "function") {
          col = _colors(t)
        }
        _colorCache[k] = col
      }
      return col
    };
    resetCache = function() {
      return _colorCache = {}
    };
    setColors(colors, positions);
    f = function(v) {
      var c;
      c = getColor(v);
      if (_out && c[_out]) {
        return c[_out]()
      } else {
        return c
      }
    };
    f.domain = function(domain, classes, mode, key) {
      var d;
      if (mode == null) {
        mode = "e"
      }
      if (!arguments.length) {
        return _domain
      }
      if (classes != null) {
        d = chroma.analyze(domain, key);
        if (classes === 0) {
          domain = [d.min, d.max]
        } else {
          domain = chroma.limits(d, mode, classes)
        }
      }
      setDomain(domain);
      return f
    };
    f.mode = function(_m) {
      if (!arguments.length) {
        return _mode
      }
      _mode = _m;
      resetCache();
      return f
    };
    f.range = function(colors, _pos) {
      setColors(colors, _pos);
      return f
    };
    f.out = function(_o) {
      _out = _o;
      return f
    };
    f.spread = function(val) {
      if (!arguments.length) {
        return _spread
      }
      _spread = val;
      return f
    };
    f.correctLightness = function(v) {
      if (!arguments.length) {
        return _correctLightness
      }
      _correctLightness = v;
      resetCache();
      if (_correctLightness) {
        tmap = function(t) {
          var L0, L1, L_actual, L_diff, L_ideal, max_iter, pol, t0, t1;
          L0 = getColor(0, true).lab()[0];
          L1 = getColor(1, true).lab()[0];
          pol = L0 > L1;
          L_actual = getColor(t, true).lab()[0];
          L_ideal = L0 + (L1 - L0) * t;
          L_diff = L_actual - L_ideal;
          t0 = 0;
          t1 = 1;
          max_iter = 20;
          while (Math.abs(L_diff) > .01 && max_iter-- > 0) {
            ! function() {
              if (pol) {
                L_diff *= -1
              }
              if (L_diff < 0) {
                t0 = t;
                t += (t1 - t) * .5
              } else {
                t1 = t;
                t += (t0 - t) * .5
              }
              L_actual = getColor(t, true).lab()[0];
              return L_diff = L_actual - L_ideal
            }()
          }
          return t
        }
      } else {
        tmap = function(t) {
          return t
        }
      }
      return f
    };
    f.colors = function(out) {
      var i, samples, _i, _j, _len, _ref;
      if (out == null) {
        out = "hex"
      }
      colors = [];
      samples = [];
      if (_domain.length > 2) {
        for (i = _i = 1, _ref = _domain.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
          samples.push((_domain[i - 1] + _domain[i]) * .5)
        }
      } else {
        samples = _domain
      }
      for (_j = 0, _len = samples.length; _j < _len; _j++) {
        i = samples[_j];
        colors.push(f(i)[out]())
      }
      return colors
    };
    return f
  };
  if ((_ref = chroma.scales) == null) {
    chroma.scales = {}
  }
  chroma.scales.cool = function() {
    return chroma.scale([chroma.hsl(180, 1, .9), chroma.hsl(250, .7, .4)])
  };
  chroma.scales.hot = function() {
    return chroma.scale(["#000", "#f00", "#ff0", "#fff"], [0, .25, .75, 1]).mode("rgb")
  };
  chroma.analyze = function(data, key, filter) {
    var add, k, r, val, visit, _i, _len;
    r = {
      min: Number.MAX_VALUE,
      max: Number.MAX_VALUE * -1,
      sum: 0,
      values: [],
      count: 0
    };
    if (filter == null) {
      filter = function() {
        return true
      }
    }
    add = function(val) {
      if (val != null && !isNaN(val)) {
        r.values.push(val);
        r.sum += val;
        if (val < r.min) {
          r.min = val
        }
        if (val > r.max) {
          r.max = val
        }
        r.count += 1
      }
    };
    visit = function(val, k) {
      if (filter(val, k)) {
        if (key != null && type(key) === "function") {
          return add(key(val))
        } else if (key != null && type(key) === "string" || type(key) === "number") {
          return add(val[key])
        } else {
          return add(val)
        }
      }
    };
    if (type(data) === "array") {
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        val = data[_i];
        visit(val)
      }
    } else {
      for (k in data) {
        val = data[k];
        visit(val, k)
      }
    }
    r.domain = [r.min, r.max];
    r.limits = function(mode, num) {
      return chroma.limits(r, mode, num)
    };
    return r
  };
  chroma.limits = function(data, mode, num) {
    var assignments, best, centroids, cluster, clusterSizes, dist, i, j, kClusters, limits, max, max_log, min, min_log, mindist, n, nb_iters, newCentroids, p, pb, pr, repeat, sum, tmpKMeansBreaks, value, values, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _s, _t, _u, _v, _w;
    if (mode == null) {
      mode = "equal"
    }
    if (num == null) {
      num = 7
    }
    if (type(data) === "array") {
      data = chroma.analyze(data)
    }
    min = data.min;
    max = data.max;
    sum = data.sum;
    values = data.values.sort(function(a, b) {
      return a - b
    });
    limits = [];
    if (mode.substr(0, 1) === "c") {
      limits.push(min);
      limits.push(max)
    }
    if (mode.substr(0, 1) === "e") {
      limits.push(min);
      for (i = _i = 1, _ref1 = num - 1; 1 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 1 <= _ref1 ? ++_i : --_i) {
        limits.push(min + i / num * (max - min))
      }
      limits.push(max)
    } else if (mode.substr(0, 1) === "l") {
      if (min <= 0) {
        throw "Logarithmic scales are only possible for values > 0"
      }
      min_log = Math.LOG10E * Math.log(min);
      max_log = Math.LOG10E * Math.log(max);
      limits.push(min);
      for (i = _j = 1, _ref2 = num - 1; 1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 1 <= _ref2 ? ++_j : --_j) {
        limits.push(Math.pow(10, min_log + i / num * (max_log - min_log)))
      }
      limits.push(max)
    } else if (mode.substr(0, 1) === "q") {
      limits.push(min);
      for (i = _k = 1, _ref3 = num - 1; 1 <= _ref3 ? _k <= _ref3 : _k >= _ref3; i = 1 <= _ref3 ? ++_k : --_k) {
        p = values.length * i / num;
        pb = Math.floor(p);
        if (pb === p) {
          limits.push(values[pb])
        } else {
          pr = p - pb;
          limits.push(values[pb] * pr + values[pb + 1] * (1 - pr))
        }
      }
      limits.push(max)
    } else if (mode.substr(0, 1) === "k") {
      n = values.length;
      assignments = new Array(n);
      clusterSizes = new Array(num);
      repeat = true;
      nb_iters = 0;
      centroids = null;
      centroids = [];
      centroids.push(min);
      for (i = _l = 1, _ref4 = num - 1; 1 <= _ref4 ? _l <= _ref4 : _l >= _ref4; i = 1 <= _ref4 ? ++_l : --_l) {
        centroids.push(min + i / num * (max - min))
      }
      centroids.push(max);
      while (repeat) {
        for (j = _m = 0, _ref5 = num - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; j = 0 <= _ref5 ? ++_m : --_m) {
          clusterSizes[j] = 0
        }
        for (i = _n = 0, _ref6 = n - 1; 0 <= _ref6 ? _n <= _ref6 : _n >= _ref6; i = 0 <= _ref6 ? ++_n : --_n) {
          value = values[i];
          mindist = Number.MAX_VALUE;
          for (j = _o = 0, _ref7 = num - 1; 0 <= _ref7 ? _o <= _ref7 : _o >= _ref7; j = 0 <= _ref7 ? ++_o : --_o) {
            dist = Math.abs(centroids[j] - value);
            if (dist < mindist) {
              mindist = dist;
              best = j
            }
          }
          clusterSizes[best]++;
          assignments[i] = best
        }
        newCentroids = new Array(num);
        for (j = _p = 0, _ref8 = num - 1; 0 <= _ref8 ? _p <= _ref8 : _p >= _ref8; j = 0 <= _ref8 ? ++_p : --_p) {
          newCentroids[j] = null
        }
        for (i = _q = 0, _ref9 = n - 1; 0 <= _ref9 ? _q <= _ref9 : _q >= _ref9; i = 0 <= _ref9 ? ++_q : --_q) {
          cluster = assignments[i];
          if (newCentroids[cluster] === null) {
            newCentroids[cluster] = values[i]
          } else {
            newCentroids[cluster] += values[i]
          }
        }
        for (j = _r = 0, _ref10 = num - 1; 0 <= _ref10 ? _r <= _ref10 : _r >= _ref10; j = 0 <= _ref10 ? ++_r : --_r) {
          newCentroids[j] *= 1 / clusterSizes[j]
        }
        repeat = false;
        for (j = _s = 0, _ref11 = num - 1; 0 <= _ref11 ? _s <= _ref11 : _s >= _ref11; j = 0 <= _ref11 ? ++_s : --_s) {
          if (newCentroids[j] !== centroids[i]) {
            repeat = true;
            break
          }
        }
        centroids = newCentroids;
        nb_iters++;
        if (nb_iters > 200) {
          repeat = false
        }
      }
      kClusters = {};
      for (j = _t = 0, _ref12 = num - 1; 0 <= _ref12 ? _t <= _ref12 : _t >= _ref12; j = 0 <= _ref12 ? ++_t : --_t) {
        kClusters[j] = []
      }
      for (i = _u = 0, _ref13 = n - 1; 0 <= _ref13 ? _u <= _ref13 : _u >= _ref13; i = 0 <= _ref13 ? ++_u : --_u) {
        cluster = assignments[i];
        kClusters[cluster].push(values[i])
      }
      tmpKMeansBreaks = [];
      for (j = _v = 0, _ref14 = num - 1; 0 <= _ref14 ? _v <= _ref14 : _v >= _ref14; j = 0 <= _ref14 ? ++_v : --_v) {
        tmpKMeansBreaks.push(kClusters[j][0]);
        tmpKMeansBreaks.push(kClusters[j][kClusters[j].length - 1])
      }
      tmpKMeansBreaks = tmpKMeansBreaks.sort(function(a, b) {
        return a - b
      });
      limits.push(tmpKMeansBreaks[0]);
      for (i = _w = 1, _ref15 = tmpKMeansBreaks.length - 1; _w <= _ref15; i = _w += 2) {
        if (!isNaN(tmpKMeansBreaks[i])) {
          limits.push(tmpKMeansBreaks[i])
        }
      }
    }
    return limits
  };
  /**
  	ColorBrewer colors for chroma.js

  	Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
  	Pennsylvania State University.

  	Licensed under the Apache License, Version 2.0 (the "License");
  	you may not use this file except in compliance with the License.
  	You may obtain a copy of the License at
  	http://www.apache.org/licenses/LICENSE-2.0

  	Unless required by applicable law or agreed to in writing, software distributed
  	under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  	CONDITIONS OF ANY KIND, either express or implied. See the License for the
  	specific language governing permissions and limitations under the License.

      @preserve
  */
  chroma.brewer = brewer = {
    OrRd: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"],
    PuBu: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"],
    BuPu: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"],
    Oranges: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"],
    BuGn: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"],
    YlOrBr: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"],
    YlGn: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"],
    Reds: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
    RdPu: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"],
    Greens: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],
    YlGnBu: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
    Purples: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"],
    GnBu: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"],
    Greys: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"],
    YlOrRd: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"],
    PuRd: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"],
    Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
    PuBuGn: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"],
    Spectral: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
    RdYlGn: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
    RdBu: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
    PiYG: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
    PRGn: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
    RdYlBu: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
    BrBG: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
    RdGy: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
    PuOr: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
    Set2: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"],
    Accent: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"],
    Set1: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"],
    Set3: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"],
    Dark2: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"],
    Paired: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"],
    Pastel2: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"],
    Pastel1: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]
  };
  chroma.colors = colors = {
    indigo: "#4b0082",
    gold: "#ffd700",
    hotpink: "#ff69b4",
    firebrick: "#b22222",
    indianred: "#cd5c5c",
    yellow: "#ffff00",
    mistyrose: "#ffe4e1",
    darkolivegreen: "#556b2f",
    olive: "#808000",
    darkseagreen: "#8fbc8f",
    pink: "#ffc0cb",
    tomato: "#ff6347",
    lightcoral: "#f08080",
    orangered: "#ff4500",
    navajowhite: "#ffdead",
    lime: "#00ff00",
    palegreen: "#98fb98",
    darkslategrey: "#2f4f4f",
    greenyellow: "#adff2f",
    burlywood: "#deb887",
    seashell: "#fff5ee",
    mediumspringgreen: "#00fa9a",
    fuchsia: "#ff00ff",
    papayawhip: "#ffefd5",
    blanchedalmond: "#ffebcd",
    chartreuse: "#7fff00",
    dimgray: "#696969",
    black: "#000000",
    peachpuff: "#ffdab9",
    springgreen: "#00ff7f",
    aquamarine: "#7fffd4",
    white: "#ffffff",
    orange: "#ffa500",
    lightsalmon: "#ffa07a",
    darkslategray: "#2f4f4f",
    brown: "#a52a2a",
    ivory: "#fffff0",
    dodgerblue: "#1e90ff",
    peru: "#cd853f",
    lawngreen: "#7cfc00",
    chocolate: "#d2691e",
    crimson: "#dc143c",
    forestgreen: "#228b22",
    darkgrey: "#a9a9a9",
    lightseagreen: "#20b2aa",
    cyan: "#00ffff",
    mintcream: "#f5fffa",
    silver: "#c0c0c0",
    antiquewhite: "#faebd7",
    mediumorchid: "#ba55d3",
    skyblue: "#87ceeb",
    gray: "#808080",
    darkturquoise: "#00ced1",
    goldenrod: "#daa520",
    darkgreen: "#006400",
    floralwhite: "#fffaf0",
    darkviolet: "#9400d3",
    darkgray: "#a9a9a9",
    moccasin: "#ffe4b5",
    saddlebrown: "#8b4513",
    grey: "#808080",
    darkslateblue: "#483d8b",
    lightskyblue: "#87cefa",
    lightpink: "#ffb6c1",
    mediumvioletred: "#c71585",
    slategrey: "#708090",
    red: "#ff0000",
    deeppink: "#ff1493",
    limegreen: "#32cd32",
    darkmagenta: "#8b008b",
    palegoldenrod: "#eee8aa",
    plum: "#dda0dd",
    turquoise: "#40e0d0",
    lightgrey: "#d3d3d3",
    lightgoldenrodyellow: "#fafad2",
    darkgoldenrod: "#b8860b",
    lavender: "#e6e6fa",
    maroon: "#800000",
    yellowgreen: "#9acd32",
    sandybrown: "#f4a460",
    thistle: "#d8bfd8",
    violet: "#ee82ee",
    navy: "#000080",
    magenta: "#ff00ff",
    dimgrey: "#696969",
    tan: "#d2b48c",
    rosybrown: "#bc8f8f",
    olivedrab: "#6b8e23",
    blue: "#0000ff",
    lightblue: "#add8e6",
    ghostwhite: "#f8f8ff",
    honeydew: "#f0fff0",
    cornflowerblue: "#6495ed",
    slateblue: "#6a5acd",
    linen: "#faf0e6",
    darkblue: "#00008b",
    powderblue: "#b0e0e6",
    seagreen: "#2e8b57",
    darkkhaki: "#bdb76b",
    snow: "#fffafa",
    sienna: "#a0522d",
    mediumblue: "#0000cd",
    royalblue: "#4169e1",
    lightcyan: "#e0ffff",
    green: "#008000",
    mediumpurple: "#9370db",
    midnightblue: "#191970",
    cornsilk: "#fff8dc",
    paleturquoise: "#afeeee",
    bisque: "#ffe4c4",
    slategray: "#708090",
    darkcyan: "#008b8b",
    khaki: "#f0e68c",
    wheat: "#f5deb3",
    teal: "#008080",
    darkorchid: "#9932cc",
    deepskyblue: "#00bfff",
    salmon: "#fa8072",
    darkred: "#8b0000",
    steelblue: "#4682b4",
    palevioletred: "#db7093",
    lightslategray: "#778899",
    aliceblue: "#f0f8ff",
    lightslategrey: "#778899",
    lightgreen: "#90ee90",
    orchid: "#da70d6",
    gainsboro: "#dcdcdc",
    mediumseagreen: "#3cb371",
    lightgray: "#d3d3d3",
    mediumturquoise: "#48d1cc",
    lemonchiffon: "#fffacd",
    cadetblue: "#5f9ea0",
    lightyellow: "#ffffe0",
    lavenderblush: "#fff0f5",
    coral: "#ff7f50",
    purple: "#800080",
    aqua: "#00ffff",
    whitesmoke: "#f5f5f5",
    mediumslateblue: "#7b68ee",
    darkorange: "#ff8c00",
    mediumaquamarine: "#66cdaa",
    darksalmon: "#e9967a",
    beige: "#f5f5dc",
    blueviolet: "#8a2be2",
    azure: "#f0ffff",
    lightsteelblue: "#b0c4de",
    oldlace: "#fdf5e6"
  };
  type = function() {
    var classToType, name, _i, _len, _ref1;
    classToType = {};
    _ref1 = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      name = _ref1[_i];
      classToType["[object " + name + "]"] = name.toLowerCase()
    }
    return function(obj) {
      var strType;
      strType = Object.prototype.toString.call(obj);
      return classToType[strType] || "object"
    }
  }();
  limit = function(x, min, max) {
    if (min == null) {
      min = 0
    }
    if (max == null) {
      max = 1
    }
    if (x < min) {
      x = min
    }
    if (x > max) {
      x = max
    }
    return x
  };
  unpack = function(args) {
    if (args.length >= 3) {
      return args
    } else {
      return args[0]
    }
  };
  TWOPI = Math.PI * 2;
  PITHIRD = Math.PI / 3;
  cos = Math.cos;
  bezier = function(colors) {
    var I, I0, I1, c, lab0, lab1, lab2, lab3, _ref1, _ref2, _ref3;
    colors = function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = colors.length; _i < _len; _i++) {
        c = colors[_i];
        _results.push(chroma(c))
      }
      return _results
    }();
    if (colors.length === 2) {
      _ref1 = function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = colors.length; _i < _len; _i++) {
          c = colors[_i];
          _results.push(c.lab())
        }
        return _results
      }(), lab0 = _ref1[0], lab1 = _ref1[1];
      I = function(t) {
        var i, lab;
        lab = function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i <= 2; i = ++_i) {
            _results.push(lab0[i] + t * (lab1[i] - lab0[i]))
          }
          return _results
        }();
        return chroma.lab.apply(chroma, lab)
      }
    } else if (colors.length === 3) {
      _ref2 = function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = colors.length; _i < _len; _i++) {
          c = colors[_i];
          _results.push(c.lab())
        }
        return _results
      }(), lab0 = _ref2[0], lab1 = _ref2[1], lab2 = _ref2[2];
      I = function(t) {
        var i, lab;
        lab = function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i <= 2; i = ++_i) {
            _results.push((1 - t) * (1 - t) * lab0[i] + 2 * (1 - t) * t * lab1[i] + t * t * lab2[i])
          }
          return _results
        }();
        return chroma.lab.apply(chroma, lab)
      }
    } else if (colors.length === 4) {
      _ref3 = function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = colors.length; _i < _len; _i++) {
          c = colors[_i];
          _results.push(c.lab())
        }
        return _results
      }(), lab0 = _ref3[0], lab1 = _ref3[1], lab2 = _ref3[2], lab3 = _ref3[3];
      I = function(t) {
        var i, lab;
        lab = function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i <= 2; i = ++_i) {
            _results.push((1 - t) * (1 - t) * (1 - t) * lab0[i] + 3 * (1 - t) * (1 - t) * t * lab1[i] + 3 * (1 - t) * t * t * lab2[i] + t * t * t * lab3[i])
          }
          return _results
        }();
        return chroma.lab.apply(chroma, lab)
      }
    } else if (colors.length === 5) {
      I0 = bezier(colors.slice(0, 3));
      I1 = bezier(colors.slice(2, 5));
      I = function(t) {
        if (t < .5) {
          return I0(t * 2)
        } else {
          return I1((t - .5) * 2)
        }
      }
    }
    return I
  };
  chroma.interpolate.bezier = bezier
}.call(this);