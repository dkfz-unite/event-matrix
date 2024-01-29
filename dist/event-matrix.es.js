var bt = function(t, e) {
  return bt = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
    n.__proto__ = i;
  } || function(n, i) {
    for (var r in i)
      Object.prototype.hasOwnProperty.call(i, r) && (n[r] = i[r]);
  }, bt(t, e);
};
function se(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  bt(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var at = function() {
  return at = Object.assign || function(e) {
    for (var n, i = 1, r = arguments.length; i < r; i++) {
      n = arguments[i];
      for (var o in n)
        Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
    }
    return e;
  }, at.apply(this, arguments);
};
function tt(t, e, n) {
  if (n || arguments.length === 2)
    for (var i = 0, r = e.length, o; i < r; i++)
      (o || !(i in e)) && (o || (o = Array.prototype.slice.call(e, 0, i)), o[i] = e[i]);
  return t.concat(o || Array.prototype.slice.call(e));
}
class Ft extends Map {
  constructor(e, n = Fe) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: n } }), e != null)
      for (const [i, r] of e)
        this.set(i, r);
  }
  get(e) {
    return super.get(Pt(this, e));
  }
  has(e) {
    return super.has(Pt(this, e));
  }
  set(e, n) {
    return super.set(Ge(this, e), n);
  }
  delete(e) {
    return super.delete(Be(this, e));
  }
}
function Pt({ _intern: t, _key: e }, n) {
  const i = e(n);
  return t.has(i) ? t.get(i) : n;
}
function Ge({ _intern: t, _key: e }, n) {
  const i = e(n);
  return t.has(i) ? t.get(i) : (t.set(i, n), n);
}
function Be({ _intern: t, _key: e }, n) {
  const i = e(n);
  return t.has(i) && (n = t.get(i), t.delete(i)), n;
}
function Fe(t) {
  return t !== null && typeof t == "object" ? t.valueOf() : t;
}
function ht(t, e, n) {
  t = +t, e = +e, n = (r = arguments.length) < 2 ? (e = t, t = 0, 1) : r < 3 ? 1 : +n;
  for (var i = -1, r = Math.max(0, Math.ceil((e - t) / n)) | 0, o = new Array(r); ++i < r; )
    o[i] = t + i * n;
  return o;
}
function ae(t, e) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(t);
      break;
    default:
      this.range(e).domain(t);
      break;
  }
  return this;
}
const $t = Symbol("implicit");
function he() {
  var t = new Ft(), e = [], n = [], i = $t;
  function r(o) {
    let s = t.get(o);
    if (s === void 0) {
      if (i !== $t)
        return i;
      t.set(o, s = e.push(o) - 1);
    }
    return n[s % n.length];
  }
  return r.domain = function(o) {
    if (!arguments.length)
      return e.slice();
    e = [], t = new Ft();
    for (const s of o)
      t.has(s) || t.set(s, e.push(s) - 1);
    return r;
  }, r.range = function(o) {
    return arguments.length ? (n = Array.from(o), r) : n.slice();
  }, r.unknown = function(o) {
    return arguments.length ? (i = o, r) : i;
  }, r.copy = function() {
    return he(e, n).unknown(i);
  }, ae.apply(r, arguments), r;
}
function lt() {
  var t = he().unknown(void 0), e = t.domain, n = t.range, i = 0, r = 1, o, s, a = !1, h = 0, l = 0, c = 0.5;
  delete t.unknown;
  function f() {
    var d = e().length, p = r < i, g = p ? r : i, y = p ? i : r;
    o = (y - g) / Math.max(1, d - h + l * 2), a && (o = Math.floor(o)), g += (y - g - o * (d - h)) * c, s = o * (1 - h), a && (g = Math.round(g), s = Math.round(s));
    var m = ht(d).map(function(E) {
      return g + o * E;
    });
    return n(p ? m.reverse() : m);
  }
  return t.domain = function(d) {
    return arguments.length ? (e(d), f()) : e();
  }, t.range = function(d) {
    return arguments.length ? ([i, r] = d, i = +i, r = +r, f()) : [i, r];
  }, t.rangeRound = function(d) {
    return [i, r] = d, i = +i, r = +r, a = !0, f();
  }, t.bandwidth = function() {
    return s;
  }, t.step = function() {
    return o;
  }, t.round = function(d) {
    return arguments.length ? (a = !!d, f()) : a;
  }, t.padding = function(d) {
    return arguments.length ? (h = Math.min(1, l = +d), f()) : h;
  }, t.paddingInner = function(d) {
    return arguments.length ? (h = Math.min(1, d), f()) : h;
  }, t.paddingOuter = function(d) {
    return arguments.length ? (l = +d, f()) : l;
  }, t.align = function(d) {
    return arguments.length ? (c = Math.max(0, Math.min(1, d)), f()) : c;
  }, t.copy = function() {
    return lt(e(), [i, r]).round(a).paddingInner(h).paddingOuter(l).align(c);
  }, ae.apply(f(), arguments);
}
function At(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function le(t, e) {
  var n = Object.create(t.prototype);
  for (var i in e)
    n[i] = e[i];
  return n;
}
function Q() {
}
var W = 0.7, ct = 1 / W, F = "\\s*([+-]?\\d+)\\s*", Y = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", T = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Pe = /^#([0-9a-f]{3,8})$/, $e = new RegExp(`^rgb\\(${F},${F},${F}\\)$`), ze = new RegExp(`^rgb\\(${T},${T},${T}\\)$`), Ve = new RegExp(`^rgba\\(${F},${F},${F},${Y}\\)$`), Xe = new RegExp(`^rgba\\(${T},${T},${T},${Y}\\)$`), qe = new RegExp(`^hsl\\(${Y},${T},${T}\\)$`), Ue = new RegExp(`^hsla\\(${Y},${T},${T},${Y}\\)$`), zt = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
At(Q, K, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Vt,
  // Deprecated! Use color.formatHex.
  formatHex: Vt,
  formatHex8: We,
  formatHsl: Ye,
  formatRgb: Xt,
  toString: Xt
});
function Vt() {
  return this.rgb().formatHex();
}
function We() {
  return this.rgb().formatHex8();
}
function Ye() {
  return ce(this).formatHsl();
}
function Xt() {
  return this.rgb().formatRgb();
}
function K(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = Pe.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? qt(e) : n === 3 ? new I(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? et(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? et(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = $e.exec(t)) ? new I(e[1], e[2], e[3], 1) : (e = ze.exec(t)) ? new I(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = Ve.exec(t)) ? et(e[1], e[2], e[3], e[4]) : (e = Xe.exec(t)) ? et(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = qe.exec(t)) ? Yt(e[1], e[2] / 100, e[3] / 100, 1) : (e = Ue.exec(t)) ? Yt(e[1], e[2] / 100, e[3] / 100, e[4]) : zt.hasOwnProperty(t) ? qt(zt[t]) : t === "transparent" ? new I(NaN, NaN, NaN, 0) : null;
}
function qt(t) {
  return new I(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function et(t, e, n, i) {
  return i <= 0 && (t = e = n = NaN), new I(t, e, n, i);
}
function Ke(t) {
  return t instanceof Q || (t = K(t)), t ? (t = t.rgb(), new I(t.r, t.g, t.b, t.opacity)) : new I();
}
function It(t, e, n, i) {
  return arguments.length === 1 ? Ke(t) : new I(t, e, n, i ?? 1);
}
function I(t, e, n, i) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +i;
}
At(I, It, le(Q, {
  brighter(t) {
    return t = t == null ? ct : Math.pow(ct, t), new I(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? W : Math.pow(W, t), new I(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new I(G(this.r), G(this.g), G(this.b), ut(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Ut,
  // Deprecated! Use color.formatHex.
  formatHex: Ut,
  formatHex8: Ze,
  formatRgb: Wt,
  toString: Wt
}));
function Ut() {
  return `#${M(this.r)}${M(this.g)}${M(this.b)}`;
}
function Ze() {
  return `#${M(this.r)}${M(this.g)}${M(this.b)}${M((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Wt() {
  const t = ut(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${G(this.r)}, ${G(this.g)}, ${G(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function ut(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function G(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function M(t) {
  return t = G(t), (t < 16 ? "0" : "") + t.toString(16);
}
function Yt(t, e, n, i) {
  return i <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new D(t, e, n, i);
}
function ce(t) {
  if (t instanceof D)
    return new D(t.h, t.s, t.l, t.opacity);
  if (t instanceof Q || (t = K(t)), !t)
    return new D();
  if (t instanceof D)
    return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, i = t.b / 255, r = Math.min(e, n, i), o = Math.max(e, n, i), s = NaN, a = o - r, h = (o + r) / 2;
  return a ? (e === o ? s = (n - i) / a + (n < i) * 6 : n === o ? s = (i - e) / a + 2 : s = (e - n) / a + 4, a /= h < 0.5 ? o + r : 2 - o - r, s *= 60) : a = h > 0 && h < 1 ? 0 : s, new D(s, a, h, t.opacity);
}
function Je(t, e, n, i) {
  return arguments.length === 1 ? ce(t) : new D(t, e, n, i ?? 1);
}
function D(t, e, n, i) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +i;
}
At(D, Je, le(Q, {
  brighter(t) {
    return t = t == null ? ct : Math.pow(ct, t), new D(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? W : Math.pow(W, t), new D(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, i = n + (n < 0.5 ? n : 1 - n) * e, r = 2 * n - i;
    return new I(
      _t(t >= 240 ? t - 240 : t + 120, r, i),
      _t(t, r, i),
      _t(t < 120 ? t + 240 : t - 120, r, i),
      this.opacity
    );
  },
  clamp() {
    return new D(Kt(this.h), nt(this.s), nt(this.l), ut(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = ut(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${Kt(this.h)}, ${nt(this.s) * 100}%, ${nt(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function Kt(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function nt(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function _t(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const ue = (t) => () => t;
function Qe(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function je(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(i) {
    return Math.pow(t + i * e, n);
  };
}
function tn(t) {
  return (t = +t) == 1 ? fe : function(e, n) {
    return n - e ? je(e, n, t) : ue(isNaN(e) ? n : e);
  };
}
function fe(t, e) {
  var n = e - t;
  return n ? Qe(t, n) : ue(isNaN(t) ? e : t);
}
const Zt = function t(e) {
  var n = tn(e);
  function i(r, o) {
    var s = n((r = It(r)).r, (o = It(o)).r), a = n(r.g, o.g), h = n(r.b, o.b), l = fe(r.opacity, o.opacity);
    return function(c) {
      return r.r = s(c), r.g = a(c), r.b = h(c), r.opacity = l(c), r + "";
    };
  }
  return i.gamma = t, i;
}(1);
function L(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
var Ct = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, xt = new RegExp(Ct.source, "g");
function en(t) {
  return function() {
    return t;
  };
}
function nn(t) {
  return function(e) {
    return t(e) + "";
  };
}
function rn(t, e) {
  var n = Ct.lastIndex = xt.lastIndex = 0, i, r, o, s = -1, a = [], h = [];
  for (t = t + "", e = e + ""; (i = Ct.exec(t)) && (r = xt.exec(e)); )
    (o = r.index) > n && (o = e.slice(n, o), a[s] ? a[s] += o : a[++s] = o), (i = i[0]) === (r = r[0]) ? a[s] ? a[s] += r : a[++s] = r : (a[++s] = null, h.push({ i: s, x: L(i, r) })), n = xt.lastIndex;
  return n < e.length && (o = e.slice(n), a[s] ? a[s] += o : a[++s] = o), a.length < 2 ? h[0] ? nn(h[0].x) : en(e) : (e = h.length, function(l) {
    for (var c = 0, f; c < e; ++c)
      a[(f = h[c]).i] = f.x(l);
    return a.join("");
  });
}
var Jt = 180 / Math.PI, Et = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function de(t, e, n, i, r, o) {
  var s, a, h;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (h = t * n + e * i) && (n -= t * h, i -= e * h), (a = Math.sqrt(n * n + i * i)) && (n /= a, i /= a, h /= a), t * i < e * n && (t = -t, e = -e, h = -h, s = -s), {
    translateX: r,
    translateY: o,
    rotate: Math.atan2(e, t) * Jt,
    skewX: Math.atan(h) * Jt,
    scaleX: s,
    scaleY: a
  };
}
var it;
function on(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Et : de(e.a, e.b, e.c, e.d, e.e, e.f);
}
function sn(t) {
  return t == null || (it || (it = document.createElementNS("http://www.w3.org/2000/svg", "g")), it.setAttribute("transform", t), !(t = it.transform.baseVal.consolidate())) ? Et : (t = t.matrix, de(t.a, t.b, t.c, t.d, t.e, t.f));
}
function pe(t, e, n, i) {
  function r(l) {
    return l.length ? l.pop() + " " : "";
  }
  function o(l, c, f, d, p, g) {
    if (l !== f || c !== d) {
      var y = p.push("translate(", null, e, null, n);
      g.push({ i: y - 4, x: L(l, f) }, { i: y - 2, x: L(c, d) });
    } else
      (f || d) && p.push("translate(" + f + e + d + n);
  }
  function s(l, c, f, d) {
    l !== c ? (l - c > 180 ? c += 360 : c - l > 180 && (l += 360), d.push({ i: f.push(r(f) + "rotate(", null, i) - 2, x: L(l, c) })) : c && f.push(r(f) + "rotate(" + c + i);
  }
  function a(l, c, f, d) {
    l !== c ? d.push({ i: f.push(r(f) + "skewX(", null, i) - 2, x: L(l, c) }) : c && f.push(r(f) + "skewX(" + c + i);
  }
  function h(l, c, f, d, p, g) {
    if (l !== f || c !== d) {
      var y = p.push(r(p) + "scale(", null, ",", null, ")");
      g.push({ i: y - 4, x: L(l, f) }, { i: y - 2, x: L(c, d) });
    } else
      (f !== 1 || d !== 1) && p.push(r(p) + "scale(" + f + "," + d + ")");
  }
  return function(l, c) {
    var f = [], d = [];
    return l = t(l), c = t(c), o(l.translateX, l.translateY, c.translateX, c.translateY, f, d), s(l.rotate, c.rotate, f, d), a(l.skewX, c.skewX, f, d), h(l.scaleX, l.scaleY, c.scaleX, c.scaleY, f, d), l = c = null, function(p) {
      for (var g = -1, y = d.length, m; ++g < y; )
        f[(m = d[g]).i] = m.x(p);
      return f.join("");
    };
  };
}
var an = pe(on, "px, ", "px)", "deg)"), hn = pe(sn, ", ", ")", ")"), St = "http://www.w3.org/1999/xhtml";
const Qt = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: St,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function mt(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Qt.hasOwnProperty(e) ? { space: Qt[e], local: t } : t;
}
function ln(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === St && e.documentElement.namespaceURI === St ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function cn(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function ge(t) {
  var e = mt(t);
  return (e.local ? cn : ln)(e);
}
function un() {
}
function Ot(t) {
  return t == null ? un : function() {
    return this.querySelector(t);
  };
}
function fn(t) {
  typeof t != "function" && (t = Ot(t));
  for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
    for (var o = e[r], s = o.length, a = i[r] = new Array(s), h, l, c = 0; c < s; ++c)
      (h = o[c]) && (l = t.call(h, h.__data__, c, o)) && ("__data__" in h && (l.__data__ = h.__data__), a[c] = l);
  return new R(i, this._parents);
}
function me(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function dn() {
  return [];
}
function ve(t) {
  return t == null ? dn : function() {
    return this.querySelectorAll(t);
  };
}
function pn(t) {
  return function() {
    return me(t.apply(this, arguments));
  };
}
function gn(t) {
  typeof t == "function" ? t = pn(t) : t = ve(t);
  for (var e = this._groups, n = e.length, i = [], r = [], o = 0; o < n; ++o)
    for (var s = e[o], a = s.length, h, l = 0; l < a; ++l)
      (h = s[l]) && (i.push(t.call(h, h.__data__, l, s)), r.push(h));
  return new R(i, r);
}
function ye(t) {
  return function() {
    return this.matches(t);
  };
}
function we(t) {
  return function(e) {
    return e.matches(t);
  };
}
var mn = Array.prototype.find;
function vn(t) {
  return function() {
    return mn.call(this.children, t);
  };
}
function yn() {
  return this.firstElementChild;
}
function wn(t) {
  return this.select(t == null ? yn : vn(typeof t == "function" ? t : we(t)));
}
var _n = Array.prototype.filter;
function xn() {
  return Array.from(this.children);
}
function Rn(t) {
  return function() {
    return _n.call(this.children, t);
  };
}
function bn(t) {
  return this.selectAll(t == null ? xn : Rn(typeof t == "function" ? t : we(t)));
}
function In(t) {
  typeof t != "function" && (t = ye(t));
  for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
    for (var o = e[r], s = o.length, a = i[r] = [], h, l = 0; l < s; ++l)
      (h = o[l]) && t.call(h, h.__data__, l, o) && a.push(h);
  return new R(i, this._parents);
}
function _e(t) {
  return new Array(t.length);
}
function Cn() {
  return new R(this._enter || this._groups.map(_e), this._parents);
}
function ft(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
ft.prototype = {
  constructor: ft,
  appendChild: function(t) {
    return this._parent.insertBefore(t, this._next);
  },
  insertBefore: function(t, e) {
    return this._parent.insertBefore(t, e);
  },
  querySelector: function(t) {
    return this._parent.querySelector(t);
  },
  querySelectorAll: function(t) {
    return this._parent.querySelectorAll(t);
  }
};
function En(t) {
  return function() {
    return t;
  };
}
function Sn(t, e, n, i, r, o) {
  for (var s = 0, a, h = e.length, l = o.length; s < l; ++s)
    (a = e[s]) ? (a.__data__ = o[s], i[s] = a) : n[s] = new ft(t, o[s]);
  for (; s < h; ++s)
    (a = e[s]) && (r[s] = a);
}
function Dn(t, e, n, i, r, o, s) {
  var a, h, l = /* @__PURE__ */ new Map(), c = e.length, f = o.length, d = new Array(c), p;
  for (a = 0; a < c; ++a)
    (h = e[a]) && (d[a] = p = s.call(h, h.__data__, a, e) + "", l.has(p) ? r[a] = h : l.set(p, h));
  for (a = 0; a < f; ++a)
    p = s.call(t, o[a], a, o) + "", (h = l.get(p)) ? (i[a] = h, h.__data__ = o[a], l.delete(p)) : n[a] = new ft(t, o[a]);
  for (a = 0; a < c; ++a)
    (h = e[a]) && l.get(d[a]) === h && (r[a] = h);
}
function Nn(t) {
  return t.__data__;
}
function Tn(t, e) {
  if (!arguments.length)
    return Array.from(this, Nn);
  var n = e ? Dn : Sn, i = this._parents, r = this._groups;
  typeof t != "function" && (t = En(t));
  for (var o = r.length, s = new Array(o), a = new Array(o), h = new Array(o), l = 0; l < o; ++l) {
    var c = i[l], f = r[l], d = f.length, p = Hn(t.call(c, c && c.__data__, l, i)), g = p.length, y = a[l] = new Array(g), m = s[l] = new Array(g), E = h[l] = new Array(d);
    n(c, f, y, m, E, p, e);
    for (var C = 0, w = 0, j, k; C < g; ++C)
      if (j = y[C]) {
        for (C >= w && (w = C + 1); !(k = m[w]) && ++w < g; )
          ;
        j._next = k || null;
      }
  }
  return s = new R(s, i), s._enter = a, s._exit = h, s;
}
function Hn(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function An() {
  return new R(this._exit || this._groups.map(_e), this._parents);
}
function On(t, e, n) {
  var i = this.enter(), r = this, o = this.exit();
  return typeof t == "function" ? (i = t(i), i && (i = i.selection())) : i = i.append(t + ""), e != null && (r = e(r), r && (r = r.selection())), n == null ? o.remove() : n(o), i && r ? i.merge(r).order() : r;
}
function kn(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, i = e._groups, r = n.length, o = i.length, s = Math.min(r, o), a = new Array(r), h = 0; h < s; ++h)
    for (var l = n[h], c = i[h], f = l.length, d = a[h] = new Array(f), p, g = 0; g < f; ++g)
      (p = l[g] || c[g]) && (d[g] = p);
  for (; h < r; ++h)
    a[h] = n[h];
  return new R(a, this._parents);
}
function Ln() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var i = t[e], r = i.length - 1, o = i[r], s; --r >= 0; )
      (s = i[r]) && (o && s.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(s, o), o = s);
  return this;
}
function Mn(t) {
  t || (t = Gn);
  function e(f, d) {
    return f && d ? t(f.__data__, d.__data__) : !f - !d;
  }
  for (var n = this._groups, i = n.length, r = new Array(i), o = 0; o < i; ++o) {
    for (var s = n[o], a = s.length, h = r[o] = new Array(a), l, c = 0; c < a; ++c)
      (l = s[c]) && (h[c] = l);
    h.sort(e);
  }
  return new R(r, this._parents).order();
}
function Gn(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Bn() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function Fn() {
  return Array.from(this);
}
function Pn() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var i = t[e], r = 0, o = i.length; r < o; ++r) {
      var s = i[r];
      if (s)
        return s;
    }
  return null;
}
function $n() {
  let t = 0;
  for (const e of this)
    ++t;
  return t;
}
function zn() {
  return !this.node();
}
function Vn(t) {
  for (var e = this._groups, n = 0, i = e.length; n < i; ++n)
    for (var r = e[n], o = 0, s = r.length, a; o < s; ++o)
      (a = r[o]) && t.call(a, a.__data__, o, r);
  return this;
}
function Xn(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function qn(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Un(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function Wn(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function Yn(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function Kn(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function Zn(t, e) {
  var n = mt(t);
  if (arguments.length < 2) {
    var i = this.node();
    return n.local ? i.getAttributeNS(n.space, n.local) : i.getAttribute(n);
  }
  return this.each((e == null ? n.local ? qn : Xn : typeof e == "function" ? n.local ? Kn : Yn : n.local ? Wn : Un)(n, e));
}
function xe(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function Jn(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Qn(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function jn(t, e, n) {
  return function() {
    var i = e.apply(this, arguments);
    i == null ? this.style.removeProperty(t) : this.style.setProperty(t, i, n);
  };
}
function ti(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? Jn : typeof e == "function" ? jn : Qn)(t, e, n ?? "")) : P(this.node(), t);
}
function P(t, e) {
  return t.style.getPropertyValue(e) || xe(t).getComputedStyle(t, null).getPropertyValue(e);
}
function ei(t) {
  return function() {
    delete this[t];
  };
}
function ni(t, e) {
  return function() {
    this[t] = e;
  };
}
function ii(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function ri(t, e) {
  return arguments.length > 1 ? this.each((e == null ? ei : typeof e == "function" ? ii : ni)(t, e)) : this.node()[t];
}
function Re(t) {
  return t.trim().split(/^|\s+/);
}
function kt(t) {
  return t.classList || new be(t);
}
function be(t) {
  this._node = t, this._names = Re(t.getAttribute("class") || "");
}
be.prototype = {
  add: function(t) {
    var e = this._names.indexOf(t);
    e < 0 && (this._names.push(t), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(t) {
    var e = this._names.indexOf(t);
    e >= 0 && (this._names.splice(e, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(t) {
    return this._names.indexOf(t) >= 0;
  }
};
function Ie(t, e) {
  for (var n = kt(t), i = -1, r = e.length; ++i < r; )
    n.add(e[i]);
}
function Ce(t, e) {
  for (var n = kt(t), i = -1, r = e.length; ++i < r; )
    n.remove(e[i]);
}
function oi(t) {
  return function() {
    Ie(this, t);
  };
}
function si(t) {
  return function() {
    Ce(this, t);
  };
}
function ai(t, e) {
  return function() {
    (e.apply(this, arguments) ? Ie : Ce)(this, t);
  };
}
function hi(t, e) {
  var n = Re(t + "");
  if (arguments.length < 2) {
    for (var i = kt(this.node()), r = -1, o = n.length; ++r < o; )
      if (!i.contains(n[r]))
        return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? ai : e ? oi : si)(n, e));
}
function li() {
  this.textContent = "";
}
function ci(t) {
  return function() {
    this.textContent = t;
  };
}
function ui(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function fi(t) {
  return arguments.length ? this.each(t == null ? li : (typeof t == "function" ? ui : ci)(t)) : this.node().textContent;
}
function di() {
  this.innerHTML = "";
}
function pi(t) {
  return function() {
    this.innerHTML = t;
  };
}
function gi(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function mi(t) {
  return arguments.length ? this.each(t == null ? di : (typeof t == "function" ? gi : pi)(t)) : this.node().innerHTML;
}
function vi() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function yi() {
  return this.each(vi);
}
function wi() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function _i() {
  return this.each(wi);
}
function xi(t) {
  var e = typeof t == "function" ? t : ge(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Ri() {
  return null;
}
function bi(t, e) {
  var n = typeof t == "function" ? t : ge(t), i = e == null ? Ri : typeof e == "function" ? e : Ot(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), i.apply(this, arguments) || null);
  });
}
function Ii() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Ci() {
  return this.each(Ii);
}
function Ei() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Si() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Di(t) {
  return this.select(t ? Si : Ei);
}
function Ni(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function Ti(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function Hi(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", i = e.indexOf(".");
    return i >= 0 && (n = e.slice(i + 1), e = e.slice(0, i)), { type: e, name: n };
  });
}
function Ai(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, i = -1, r = e.length, o; n < r; ++n)
        o = e[n], (!t.type || o.type === t.type) && o.name === t.name ? this.removeEventListener(o.type, o.listener, o.options) : e[++i] = o;
      ++i ? e.length = i : delete this.__on;
    }
  };
}
function Oi(t, e, n) {
  return function() {
    var i = this.__on, r, o = Ti(e);
    if (i) {
      for (var s = 0, a = i.length; s < a; ++s)
        if ((r = i[s]).type === t.type && r.name === t.name) {
          this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, r.listener = o, r.options = n), r.value = e;
          return;
        }
    }
    this.addEventListener(t.type, o, n), r = { type: t.type, name: t.name, value: e, listener: o, options: n }, i ? i.push(r) : this.__on = [r];
  };
}
function ki(t, e, n) {
  var i = Hi(t + ""), r, o = i.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var h = 0, l = a.length, c; h < l; ++h)
        for (r = 0, c = a[h]; r < o; ++r)
          if ((s = i[r]).type === c.type && s.name === c.name)
            return c.value;
    }
    return;
  }
  for (a = e ? Oi : Ai, r = 0; r < o; ++r)
    this.each(a(i[r], e, n));
  return this;
}
function Ee(t, e, n) {
  var i = xe(t), r = i.CustomEvent;
  typeof r == "function" ? r = new r(e, n) : (r = i.document.createEvent("Event"), n ? (r.initEvent(e, n.bubbles, n.cancelable), r.detail = n.detail) : r.initEvent(e, !1, !1)), t.dispatchEvent(r);
}
function Li(t, e) {
  return function() {
    return Ee(this, t, e);
  };
}
function Mi(t, e) {
  return function() {
    return Ee(this, t, e.apply(this, arguments));
  };
}
function Gi(t, e) {
  return this.each((typeof e == "function" ? Mi : Li)(t, e));
}
function* Bi() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var i = t[e], r = 0, o = i.length, s; r < o; ++r)
      (s = i[r]) && (yield s);
}
var Lt = [null];
function R(t, e) {
  this._groups = t, this._parents = e;
}
function z() {
  return new R([[document.documentElement]], Lt);
}
function Fi() {
  return this;
}
R.prototype = z.prototype = {
  constructor: R,
  select: fn,
  selectAll: gn,
  selectChild: wn,
  selectChildren: bn,
  filter: In,
  data: Tn,
  enter: Cn,
  exit: An,
  join: On,
  merge: kn,
  selection: Fi,
  order: Ln,
  sort: Mn,
  call: Bn,
  nodes: Fn,
  node: Pn,
  size: $n,
  empty: zn,
  each: Vn,
  attr: Zn,
  style: ti,
  property: ri,
  classed: hi,
  text: fi,
  html: mi,
  raise: yi,
  lower: _i,
  append: xi,
  insert: bi,
  remove: Ci,
  clone: Di,
  datum: Ni,
  on: ki,
  dispatch: Gi,
  [Symbol.iterator]: Bi
};
function Z(t) {
  return typeof t == "string" ? new R([[document.querySelector(t)]], [document.documentElement]) : new R([[t]], Lt);
}
function Pi(t) {
  let e;
  for (; e = t.sourceEvent; )
    t = e;
  return t;
}
function Rt(t, e) {
  if (t = Pi(t), e === void 0 && (e = t.currentTarget), e) {
    var n = e.ownerSVGElement || e;
    if (n.createSVGPoint) {
      var i = n.createSVGPoint();
      return i.x = t.clientX, i.y = t.clientY, i = i.matrixTransform(e.getScreenCTM().inverse()), [i.x, i.y];
    }
    if (e.getBoundingClientRect) {
      var r = e.getBoundingClientRect();
      return [t.clientX - r.left - e.clientLeft, t.clientY - r.top - e.clientTop];
    }
  }
  return [t.pageX, t.pageY];
}
function V(t) {
  return typeof t == "string" ? new R([document.querySelectorAll(t)], [document.documentElement]) : new R([me(t)], Lt);
}
function $i(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Se = { exports: {} };
(function(t) {
  var e = Object.prototype.hasOwnProperty, n = "~";
  function i() {
  }
  Object.create && (i.prototype = /* @__PURE__ */ Object.create(null), new i().__proto__ || (n = !1));
  function r(h, l, c) {
    this.fn = h, this.context = l, this.once = c || !1;
  }
  function o(h, l, c, f, d) {
    if (typeof c != "function")
      throw new TypeError("The listener must be a function");
    var p = new r(c, f || h, d), g = n ? n + l : l;
    return h._events[g] ? h._events[g].fn ? h._events[g] = [h._events[g], p] : h._events[g].push(p) : (h._events[g] = p, h._eventsCount++), h;
  }
  function s(h, l) {
    --h._eventsCount === 0 ? h._events = new i() : delete h._events[l];
  }
  function a() {
    this._events = new i(), this._eventsCount = 0;
  }
  a.prototype.eventNames = function() {
    var l = [], c, f;
    if (this._eventsCount === 0)
      return l;
    for (f in c = this._events)
      e.call(c, f) && l.push(n ? f.slice(1) : f);
    return Object.getOwnPropertySymbols ? l.concat(Object.getOwnPropertySymbols(c)) : l;
  }, a.prototype.listeners = function(l) {
    var c = n ? n + l : l, f = this._events[c];
    if (!f)
      return [];
    if (f.fn)
      return [f.fn];
    for (var d = 0, p = f.length, g = new Array(p); d < p; d++)
      g[d] = f[d].fn;
    return g;
  }, a.prototype.listenerCount = function(l) {
    var c = n ? n + l : l, f = this._events[c];
    return f ? f.fn ? 1 : f.length : 0;
  }, a.prototype.emit = function(l, c, f, d, p, g) {
    var y = n ? n + l : l;
    if (!this._events[y])
      return !1;
    var m = this._events[y], E = arguments.length, C, w;
    if (m.fn) {
      switch (m.once && this.removeListener(l, m.fn, void 0, !0), E) {
        case 1:
          return m.fn.call(m.context), !0;
        case 2:
          return m.fn.call(m.context, c), !0;
        case 3:
          return m.fn.call(m.context, c, f), !0;
        case 4:
          return m.fn.call(m.context, c, f, d), !0;
        case 5:
          return m.fn.call(m.context, c, f, d, p), !0;
        case 6:
          return m.fn.call(m.context, c, f, d, p, g), !0;
      }
      for (w = 1, C = new Array(E - 1); w < E; w++)
        C[w - 1] = arguments[w];
      m.fn.apply(m.context, C);
    } else {
      var j = m.length, k;
      for (w = 0; w < j; w++)
        switch (m[w].once && this.removeListener(l, m[w].fn, void 0, !0), E) {
          case 1:
            m[w].fn.call(m[w].context);
            break;
          case 2:
            m[w].fn.call(m[w].context, c);
            break;
          case 3:
            m[w].fn.call(m[w].context, c, f);
            break;
          case 4:
            m[w].fn.call(m[w].context, c, f, d);
            break;
          default:
            if (!C)
              for (k = 1, C = new Array(E - 1); k < E; k++)
                C[k - 1] = arguments[k];
            m[w].fn.apply(m[w].context, C);
        }
    }
    return !0;
  }, a.prototype.on = function(l, c, f) {
    return o(this, l, c, f, !1);
  }, a.prototype.once = function(l, c, f) {
    return o(this, l, c, f, !0);
  }, a.prototype.removeListener = function(l, c, f, d) {
    var p = n ? n + l : l;
    if (!this._events[p])
      return this;
    if (!c)
      return s(this, p), this;
    var g = this._events[p];
    if (g.fn)
      g.fn === c && (!d || g.once) && (!f || g.context === f) && s(this, p);
    else {
      for (var y = 0, m = [], E = g.length; y < E; y++)
        (g[y].fn !== c || d && !g[y].once || f && g[y].context !== f) && m.push(g[y]);
      m.length ? this._events[p] = m.length === 1 ? m[0] : m : s(this, p);
    }
    return this;
  }, a.prototype.removeAllListeners = function(l) {
    var c;
    return l ? (c = n ? n + l : l, this._events[c] && s(this, c)) : (this._events = new i(), this._eventsCount = 0), this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = n, a.EventEmitter = a, t.exports = a;
})(Se);
var zi = Se.exports;
const De = /* @__PURE__ */ $i(zi);
var _;
(function(t) {
  t.GRID_CELL_HOVER = "grid:cell:hover", t.GRID_CELL_CLICK = "grid:cell:click", t.GRID_OUT = "grid:out", t.GRID_LABEL_HOVER = "grid:label:hover", t.GRID_LABEL_CLICK = "grid:label:click", t.GRID_CROSSHAIR_HOVER = "grid:crosshair:hover", t.GRID_CROSSHAIR_OUT = "grid:crosshair:out", t.GRID_SELECTION_STARTED = "grid:selection:started", t.GRID_SELECTION_FINISHED = "grid:selection:finished", t.HISTOGRAM_HOVER = "histogram:hover", t.HISTOGRAM_CLICK = "histogram:click", t.HISTOGRAM_OUT = "histogram:out", t.DESCRIPTION_LEGEND_HOVER = "description:legend:hover", t.DESCRIPTION_LEGEND_OUT = "description:legend:out", t.DESCRIPTION_BUTTONS_ADD_CLICK = "description:buttons:add:click", t.DESCRIPTION_FIELD_CLICK = "description:cell:click", t.DESCRIPTION_CELL_HOVER = "description:cell:hover", t.DESCRIPTION_CELL_OUT = "description:cell:out";
})(_ || (_ = {}));
var S;
(function(t) {
  t.INNER_RESIZE = "inner:resize", t.INNER_UPDATE = "inner:update";
})(S || (S = {}));
var b;
(function(t) {
  t.RENDER_ALL_START = "render:all:start", t.RENDER_ALL_END = "render:all:end", t.RENDER_GRID_START = "render:grid:start", t.RENDER_GRID_END = "render:grid:end", t.RENDER_X_HISTOGRAM_START = "render:x-histogram:start", t.RENDER_X_HISTOGRAM_END = "render:x-histogram:end", t.RENDER_Y_HISTOGRAM_START = "render:y-histogram:start", t.RENDER_Y_HISTOGRAM_END = "render:y-histogram:end", t.RENDER_X_DESCRIPTION_BLOCK_START = "render:x-description-block:start", t.RENDER_X_DESCRIPTION_BLOCK_END = "render:x-description-block:end", t.RENDER_Y_DESCRIPTION_BLOCK_START = "render:y-description-block:start", t.RENDER_Y_DESCRIPTION_BLOCK_END = "render:y-description-block:end";
})(b || (b = {}));
var Vi = (
  /** @class */
  function(t) {
    se(e, t);
    function e() {
      return t.call(this) || this;
    }
    return e.getInstance = function() {
      return this.instance === null && (this.instance = new this()), this.instance;
    }, e.prototype.exposeEvents = function() {
      return Object.values(_);
    }, e.instance = null, e;
  }(De)
), v = Vi.getInstance(), x;
(function(t) {
  t.Rows = "rows", t.Columns = "columns";
})(x || (x = {}));
var Dt;
(function(t) {
  t.Mutation = "mutation";
})(Dt || (Dt = {}));
var Xi = (
  /** @class */
  function() {
    function t() {
      var e;
      this.minCellHeight = 10, this.prefix = "og-", this.lookupTable = {}, this.rowsOriginal = [], this.rows = [], this.columnsOriginal = [], this.columns = [], this.entries = [], this.customFunctions = (e = {}, e[x.Rows] = {
        opacity: function(n) {
          return 1;
        },
        fill: function(n) {
          return "black";
        }
      }, e[x.Columns] = {
        opacity: function(n) {
          return 1;
        },
        fill: function(n) {
          return "black";
        }
      }, e), this.rowsOrder = null, this.columnsOrder = null;
    }
    return t.prototype.setLookupTable = function(e) {
      this.lookupTable = e;
    }, t.prototype.setOptions = function(e) {
      var n = e.minCellHeight, i = e.prefix, r = e.rows, o = e.columns, s = e.entries, a = e.columnsFillFunc, h = e.rowsOpacityFunc, l = e.rowsFillFunc, c = e.columnsOpacityFunc;
      n !== void 0 && (this.minCellHeight = n), i !== void 0 && (this.prefix = i), r !== void 0 && (this.rowsOriginal = tt([], r, !0), this.rows = r), o !== void 0 && (this.columnsOriginal = tt([], o, !0), this.columns = o), s !== void 0 && (this.entries = s.map(function(f) {
        var d;
        return at(at({}, f), { type: (d = f.type) !== null && d !== void 0 ? d : "mutation" });
      })), l !== void 0 && (this.customFunctions[x.Rows].fill = l), h !== void 0 && (this.customFunctions[x.Rows].opacity = h), a !== void 0 && (this.customFunctions[x.Columns].fill = a), c !== void 0 && (this.customFunctions[x.Columns].opacity = c);
    }, t.prototype.reset = function() {
      this.rows = tt([], this.rowsOriginal, !0), this.columns = tt([], this.columnsOriginal, !0), this.rowsOrder = null, this.rowsPrevIndex = null, this.columnsOrder = null, this.columnsPrevIndex = null;
    }, t.getInstance = function() {
      return this.instance === null && (this.instance = new this()), this.instance;
    }, t.prototype.sortRows = function(e, n) {
      var i = this;
      e === void 0 && (e = "id"), n === void 0 && (n = null), (n === null || n === this.rowsPrevIndex) && (this.rowsOrder === null ? this.rowsOrder = "ASC" : this.rowsOrder = this.rowsOrder === "ASC" ? "DESC" : "ASC"), this.rowsPrevIndex = n, this.rows.sort(function(r, o) {
        var s, a, h = (s = n === null ? r[e] : r[e][n]) !== null && s !== void 0 ? s : "0", l = (a = n === null ? o[e] : o[e][n]) !== null && a !== void 0 ? a : "0";
        return h === l ? 0 : i.rowsOrder === "ASC" ? h < l ? 1 : -1 : h > l ? 1 : -1;
      });
    }, t.prototype.sortColumns = function(e, n) {
      var i = this;
      e === void 0 && (e = "id"), n === void 0 && (n = null), (n === null || n === this.columnsPrevIndex) && (this.columnsOrder === null ? this.columnsOrder = "ASC" : this.columnsOrder = this.columnsOrder === "ASC" ? "DESC" : "ASC"), this.columnsPrevIndex = n, this.columns.sort(function(r, o) {
        var s, a, h = (s = n === null ? r[e] : r[e][n]) !== null && s !== void 0 ? s : "0", l = (a = n === null ? o[e] : o[e][n]) !== null && a !== void 0 ? a : "0";
        return h === l ? 0 : i.columnsOrder === "ASC" ? h < l ? 1 : -1 : h > l ? 1 : -1;
      });
    }, t.instance = null, t;
  }()
), u = Xi.getInstance(), qi = { value: () => {
} };
function Ne() {
  for (var t = 0, e = arguments.length, n = {}, i; t < e; ++t) {
    if (!(i = arguments[t] + "") || i in n || /[\s.]/.test(i))
      throw new Error("illegal type: " + i);
    n[i] = [];
  }
  return new rt(n);
}
function rt(t) {
  this._ = t;
}
function Ui(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var i = "", r = n.indexOf(".");
    if (r >= 0 && (i = n.slice(r + 1), n = n.slice(0, r)), n && !e.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: i };
  });
}
rt.prototype = Ne.prototype = {
  constructor: rt,
  on: function(t, e) {
    var n = this._, i = Ui(t + "", n), r, o = -1, s = i.length;
    if (arguments.length < 2) {
      for (; ++o < s; )
        if ((r = (t = i[o]).type) && (r = Wi(n[r], t.name)))
          return r;
      return;
    }
    if (e != null && typeof e != "function")
      throw new Error("invalid callback: " + e);
    for (; ++o < s; )
      if (r = (t = i[o]).type)
        n[r] = jt(n[r], t.name, e);
      else if (e == null)
        for (r in n)
          n[r] = jt(n[r], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e)
      t[n] = e[n].slice();
    return new rt(t);
  },
  call: function(t, e) {
    if ((r = arguments.length - 2) > 0)
      for (var n = new Array(r), i = 0, r, o; i < r; ++i)
        n[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(t))
      throw new Error("unknown type: " + t);
    for (o = this._[t], i = 0, r = o.length; i < r; ++i)
      o[i].value.apply(e, n);
  },
  apply: function(t, e, n) {
    if (!this._.hasOwnProperty(t))
      throw new Error("unknown type: " + t);
    for (var i = this._[t], r = 0, o = i.length; r < o; ++r)
      i[r].value.apply(e, n);
  }
};
function Wi(t, e) {
  for (var n = 0, i = t.length, r; n < i; ++n)
    if ((r = t[n]).name === e)
      return r.value;
}
function jt(t, e, n) {
  for (var i = 0, r = t.length; i < r; ++i)
    if (t[i].name === e) {
      t[i] = qi, t = t.slice(0, i).concat(t.slice(i + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var $ = 0, q = 0, X = 0, Te = 1e3, dt, U, pt = 0, B = 0, vt = 0, J = typeof performance == "object" && performance.now ? performance : Date, He = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function Mt() {
  return B || (He(Yi), B = J.now() + vt);
}
function Yi() {
  B = 0;
}
function gt() {
  this._call = this._time = this._next = null;
}
gt.prototype = Ae.prototype = {
  constructor: gt,
  restart: function(t, e, n) {
    if (typeof t != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? Mt() : +n) + (e == null ? 0 : +e), !this._next && U !== this && (U ? U._next = this : dt = this, U = this), this._call = t, this._time = n, Nt();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Nt());
  }
};
function Ae(t, e, n) {
  var i = new gt();
  return i.restart(t, e, n), i;
}
function Ki() {
  Mt(), ++$;
  for (var t = dt, e; t; )
    (e = B - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --$;
}
function te() {
  B = (pt = J.now()) + vt, $ = q = 0;
  try {
    Ki();
  } finally {
    $ = 0, Ji(), B = 0;
  }
}
function Zi() {
  var t = J.now(), e = t - pt;
  e > Te && (vt -= e, pt = t);
}
function Ji() {
  for (var t, e = dt, n, i = 1 / 0; e; )
    e._call ? (i > e._time && (i = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : dt = n);
  U = t, Nt(i);
}
function Nt(t) {
  if (!$) {
    q && (q = clearTimeout(q));
    var e = t - B;
    e > 24 ? (t < 1 / 0 && (q = setTimeout(te, t - J.now() - vt)), X && (X = clearInterval(X))) : (X || (pt = J.now(), X = setInterval(Zi, Te)), $ = 1, He(te));
  }
}
function ee(t, e, n) {
  var i = new gt();
  return e = e == null ? 0 : +e, i.restart((r) => {
    i.stop(), t(r + e);
  }, e, n), i;
}
var Qi = Ne("start", "end", "cancel", "interrupt"), ji = [], Oe = 0, ne = 1, Tt = 2, ot = 3, ie = 4, Ht = 5, st = 6;
function yt(t, e, n, i, r, o) {
  var s = t.__transition;
  if (!s)
    t.__transition = {};
  else if (n in s)
    return;
  tr(t, n, {
    name: e,
    index: i,
    // For context during callback.
    group: r,
    // For context during callback.
    on: Qi,
    tween: ji,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: Oe
  });
}
function Gt(t, e) {
  var n = N(t, e);
  if (n.state > Oe)
    throw new Error("too late; already scheduled");
  return n;
}
function H(t, e) {
  var n = N(t, e);
  if (n.state > ot)
    throw new Error("too late; already running");
  return n;
}
function N(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e]))
    throw new Error("transition not found");
  return n;
}
function tr(t, e, n) {
  var i = t.__transition, r;
  i[e] = n, n.timer = Ae(o, 0, n.time);
  function o(l) {
    n.state = ne, n.timer.restart(s, n.delay, n.time), n.delay <= l && s(l - n.delay);
  }
  function s(l) {
    var c, f, d, p;
    if (n.state !== ne)
      return h();
    for (c in i)
      if (p = i[c], p.name === n.name) {
        if (p.state === ot)
          return ee(s);
        p.state === ie ? (p.state = st, p.timer.stop(), p.on.call("interrupt", t, t.__data__, p.index, p.group), delete i[c]) : +c < e && (p.state = st, p.timer.stop(), p.on.call("cancel", t, t.__data__, p.index, p.group), delete i[c]);
      }
    if (ee(function() {
      n.state === ot && (n.state = ie, n.timer.restart(a, n.delay, n.time), a(l));
    }), n.state = Tt, n.on.call("start", t, t.__data__, n.index, n.group), n.state === Tt) {
      for (n.state = ot, r = new Array(d = n.tween.length), c = 0, f = -1; c < d; ++c)
        (p = n.tween[c].value.call(t, t.__data__, n.index, n.group)) && (r[++f] = p);
      r.length = f + 1;
    }
  }
  function a(l) {
    for (var c = l < n.duration ? n.ease.call(null, l / n.duration) : (n.timer.restart(h), n.state = Ht, 1), f = -1, d = r.length; ++f < d; )
      r[f].call(t, c);
    n.state === Ht && (n.on.call("end", t, t.__data__, n.index, n.group), h());
  }
  function h() {
    n.state = st, n.timer.stop(), delete i[e];
    for (var l in i)
      return;
    delete t.__transition;
  }
}
function er(t, e) {
  var n = t.__transition, i, r, o = !0, s;
  if (n) {
    e = e == null ? null : e + "";
    for (s in n) {
      if ((i = n[s]).name !== e) {
        o = !1;
        continue;
      }
      r = i.state > Tt && i.state < Ht, i.state = st, i.timer.stop(), i.on.call(r ? "interrupt" : "cancel", t, t.__data__, i.index, i.group), delete n[s];
    }
    o && delete t.__transition;
  }
}
function nr(t) {
  return this.each(function() {
    er(this, t);
  });
}
function ir(t, e) {
  var n, i;
  return function() {
    var r = H(this, t), o = r.tween;
    if (o !== n) {
      i = n = o;
      for (var s = 0, a = i.length; s < a; ++s)
        if (i[s].name === e) {
          i = i.slice(), i.splice(s, 1);
          break;
        }
    }
    r.tween = i;
  };
}
function rr(t, e, n) {
  var i, r;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var o = H(this, t), s = o.tween;
    if (s !== i) {
      r = (i = s).slice();
      for (var a = { name: e, value: n }, h = 0, l = r.length; h < l; ++h)
        if (r[h].name === e) {
          r[h] = a;
          break;
        }
      h === l && r.push(a);
    }
    o.tween = r;
  };
}
function or(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var i = N(this.node(), n).tween, r = 0, o = i.length, s; r < o; ++r)
      if ((s = i[r]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? ir : rr)(n, t, e));
}
function Bt(t, e, n) {
  var i = t._id;
  return t.each(function() {
    var r = H(this, i);
    (r.value || (r.value = {}))[e] = n.apply(this, arguments);
  }), function(r) {
    return N(r, i).value[e];
  };
}
function ke(t, e) {
  var n;
  return (typeof e == "number" ? L : e instanceof K ? Zt : (n = K(e)) ? (e = n, Zt) : rn)(t, e);
}
function sr(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function ar(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function hr(t, e, n) {
  var i, r = n + "", o;
  return function() {
    var s = this.getAttribute(t);
    return s === r ? null : s === i ? o : o = e(i = s, n);
  };
}
function lr(t, e, n) {
  var i, r = n + "", o;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === r ? null : s === i ? o : o = e(i = s, n);
  };
}
function cr(t, e, n) {
  var i, r, o;
  return function() {
    var s, a = n(this), h;
    return a == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), h = a + "", s === h ? null : s === i && h === r ? o : (r = h, o = e(i = s, a)));
  };
}
function ur(t, e, n) {
  var i, r, o;
  return function() {
    var s, a = n(this), h;
    return a == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), h = a + "", s === h ? null : s === i && h === r ? o : (r = h, o = e(i = s, a)));
  };
}
function fr(t, e) {
  var n = mt(t), i = n === "transform" ? hn : ke;
  return this.attrTween(t, typeof e == "function" ? (n.local ? ur : cr)(n, i, Bt(this, "attr." + t, e)) : e == null ? (n.local ? ar : sr)(n) : (n.local ? lr : hr)(n, i, e));
}
function dr(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function pr(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function gr(t, e) {
  var n, i;
  function r() {
    var o = e.apply(this, arguments);
    return o !== i && (n = (i = o) && pr(t, o)), n;
  }
  return r._value = e, r;
}
function mr(t, e) {
  var n, i;
  function r() {
    var o = e.apply(this, arguments);
    return o !== i && (n = (i = o) && dr(t, o)), n;
  }
  return r._value = e, r;
}
function vr(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (e == null)
    return this.tween(n, null);
  if (typeof e != "function")
    throw new Error();
  var i = mt(t);
  return this.tween(n, (i.local ? gr : mr)(i, e));
}
function yr(t, e) {
  return function() {
    Gt(this, t).delay = +e.apply(this, arguments);
  };
}
function wr(t, e) {
  return e = +e, function() {
    Gt(this, t).delay = e;
  };
}
function _r(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? yr : wr)(e, t)) : N(this.node(), e).delay;
}
function xr(t, e) {
  return function() {
    H(this, t).duration = +e.apply(this, arguments);
  };
}
function Rr(t, e) {
  return e = +e, function() {
    H(this, t).duration = e;
  };
}
function br(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? xr : Rr)(e, t)) : N(this.node(), e).duration;
}
function Ir(t, e) {
  if (typeof e != "function")
    throw new Error();
  return function() {
    H(this, t).ease = e;
  };
}
function Cr(t) {
  var e = this._id;
  return arguments.length ? this.each(Ir(e, t)) : N(this.node(), e).ease;
}
function Er(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    H(this, t).ease = n;
  };
}
function Sr(t) {
  if (typeof t != "function")
    throw new Error();
  return this.each(Er(this._id, t));
}
function Dr(t) {
  typeof t != "function" && (t = ye(t));
  for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
    for (var o = e[r], s = o.length, a = i[r] = [], h, l = 0; l < s; ++l)
      (h = o[l]) && t.call(h, h.__data__, l, o) && a.push(h);
  return new O(i, this._parents, this._name, this._id);
}
function Nr(t) {
  if (t._id !== this._id)
    throw new Error();
  for (var e = this._groups, n = t._groups, i = e.length, r = n.length, o = Math.min(i, r), s = new Array(i), a = 0; a < o; ++a)
    for (var h = e[a], l = n[a], c = h.length, f = s[a] = new Array(c), d, p = 0; p < c; ++p)
      (d = h[p] || l[p]) && (f[p] = d);
  for (; a < i; ++a)
    s[a] = e[a];
  return new O(s, this._parents, this._name, this._id);
}
function Tr(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function Hr(t, e, n) {
  var i, r, o = Tr(e) ? Gt : H;
  return function() {
    var s = o(this, t), a = s.on;
    a !== i && (r = (i = a).copy()).on(e, n), s.on = r;
  };
}
function Ar(t, e) {
  var n = this._id;
  return arguments.length < 2 ? N(this.node(), n).on.on(t) : this.each(Hr(n, t, e));
}
function Or(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition)
      if (+n !== t)
        return;
    e && e.removeChild(this);
  };
}
function kr() {
  return this.on("end.remove", Or(this._id));
}
function Lr(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Ot(t));
  for (var i = this._groups, r = i.length, o = new Array(r), s = 0; s < r; ++s)
    for (var a = i[s], h = a.length, l = o[s] = new Array(h), c, f, d = 0; d < h; ++d)
      (c = a[d]) && (f = t.call(c, c.__data__, d, a)) && ("__data__" in c && (f.__data__ = c.__data__), l[d] = f, yt(l[d], e, n, d, l, N(c, n)));
  return new O(o, this._parents, e, n);
}
function Mr(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = ve(t));
  for (var i = this._groups, r = i.length, o = [], s = [], a = 0; a < r; ++a)
    for (var h = i[a], l = h.length, c, f = 0; f < l; ++f)
      if (c = h[f]) {
        for (var d = t.call(c, c.__data__, f, h), p, g = N(c, n), y = 0, m = d.length; y < m; ++y)
          (p = d[y]) && yt(p, e, n, y, d, g);
        o.push(d), s.push(c);
      }
  return new O(o, s, e, n);
}
var Gr = z.prototype.constructor;
function Br() {
  return new Gr(this._groups, this._parents);
}
function Fr(t, e) {
  var n, i, r;
  return function() {
    var o = P(this, t), s = (this.style.removeProperty(t), P(this, t));
    return o === s ? null : o === n && s === i ? r : r = e(n = o, i = s);
  };
}
function Le(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Pr(t, e, n) {
  var i, r = n + "", o;
  return function() {
    var s = P(this, t);
    return s === r ? null : s === i ? o : o = e(i = s, n);
  };
}
function $r(t, e, n) {
  var i, r, o;
  return function() {
    var s = P(this, t), a = n(this), h = a + "";
    return a == null && (h = a = (this.style.removeProperty(t), P(this, t))), s === h ? null : s === i && h === r ? o : (r = h, o = e(i = s, a));
  };
}
function zr(t, e) {
  var n, i, r, o = "style." + e, s = "end." + o, a;
  return function() {
    var h = H(this, t), l = h.on, c = h.value[o] == null ? a || (a = Le(e)) : void 0;
    (l !== n || r !== c) && (i = (n = l).copy()).on(s, r = c), h.on = i;
  };
}
function Vr(t, e, n) {
  var i = (t += "") == "transform" ? an : ke;
  return e == null ? this.styleTween(t, Fr(t, i)).on("end.style." + t, Le(t)) : typeof e == "function" ? this.styleTween(t, $r(t, i, Bt(this, "style." + t, e))).each(zr(this._id, t)) : this.styleTween(t, Pr(t, i, e), n).on("end.style." + t, null);
}
function Xr(t, e, n) {
  return function(i) {
    this.style.setProperty(t, e.call(this, i), n);
  };
}
function qr(t, e, n) {
  var i, r;
  function o() {
    var s = e.apply(this, arguments);
    return s !== r && (i = (r = s) && Xr(t, s, n)), i;
  }
  return o._value = e, o;
}
function Ur(t, e, n) {
  var i = "style." + (t += "");
  if (arguments.length < 2)
    return (i = this.tween(i)) && i._value;
  if (e == null)
    return this.tween(i, null);
  if (typeof e != "function")
    throw new Error();
  return this.tween(i, qr(t, e, n ?? ""));
}
function Wr(t) {
  return function() {
    this.textContent = t;
  };
}
function Yr(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Kr(t) {
  return this.tween("text", typeof t == "function" ? Yr(Bt(this, "text", t)) : Wr(t == null ? "" : t + ""));
}
function Zr(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function Jr(t) {
  var e, n;
  function i() {
    var r = t.apply(this, arguments);
    return r !== n && (e = (n = r) && Zr(r)), e;
  }
  return i._value = t, i;
}
function Qr(t) {
  var e = "text";
  if (arguments.length < 1)
    return (e = this.tween(e)) && e._value;
  if (t == null)
    return this.tween(e, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(e, Jr(t));
}
function jr() {
  for (var t = this._name, e = this._id, n = Me(), i = this._groups, r = i.length, o = 0; o < r; ++o)
    for (var s = i[o], a = s.length, h, l = 0; l < a; ++l)
      if (h = s[l]) {
        var c = N(h, e);
        yt(h, t, n, l, s, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new O(i, this._parents, t, n);
}
function to() {
  var t, e, n = this, i = n._id, r = n.size();
  return new Promise(function(o, s) {
    var a = { value: s }, h = { value: function() {
      --r === 0 && o();
    } };
    n.each(function() {
      var l = H(this, i), c = l.on;
      c !== t && (e = (t = c).copy(), e._.cancel.push(a), e._.interrupt.push(a), e._.end.push(h)), l.on = e;
    }), r === 0 && o();
  });
}
var eo = 0;
function O(t, e, n, i) {
  this._groups = t, this._parents = e, this._name = n, this._id = i;
}
function wt(t) {
  return z().transition(t);
}
function Me() {
  return ++eo;
}
var A = z.prototype;
O.prototype = wt.prototype = {
  constructor: O,
  select: Lr,
  selectAll: Mr,
  selectChild: A.selectChild,
  selectChildren: A.selectChildren,
  filter: Dr,
  merge: Nr,
  selection: Br,
  transition: jr,
  call: A.call,
  nodes: A.nodes,
  node: A.node,
  size: A.size,
  empty: A.empty,
  each: A.each,
  on: Ar,
  attr: fr,
  attrTween: vr,
  style: Vr,
  styleTween: Ur,
  text: Kr,
  textTween: Qr,
  remove: kr,
  tween: or,
  delay: _r,
  duration: br,
  ease: Cr,
  easeVarying: Sr,
  end: to,
  [Symbol.iterator]: A[Symbol.iterator]
};
function no(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var io = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: no
};
function ro(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function oo(t) {
  var e, n;
  t instanceof O ? (e = t._id, t = t._name) : (e = Me(), (n = io).time = Mt(), t = t == null ? null : t + "");
  for (var i = this._groups, r = i.length, o = 0; o < r; ++o)
    for (var s = i[o], a = s.length, h, l = 0; l < a; ++l)
      (h = s[l]) && yt(h, t, e, l, s, n || ro(h, e));
  return new O(i, this._parents, t, e);
}
z.prototype.interrupt = nr;
z.prototype.transition = oo;
wt();
var so = (
  /** @class */
  function() {
    function t(e, n, i, r) {
      var o;
      this.rendered = !1, this.fields = [], this.collapsedFields = [], this.fieldsData = [], this.params = e, this.expandable = e.expandable, this.name = i, this.width = e.width, this.nullSentinel = e.nullSentinel || -777, this.rotated = r, this.drawGridLines = (o = e.grid) !== null && o !== void 0 ? o : !1, this.domain = e.domain, this.blockType = n, this.wrapper = Z(e.wrapper || "body");
    }
    return t.prototype.setTransform = function(e, n) {
      this.container.attr("transform", "translate(".concat(e, ",").concat(n, ")"));
    }, t.prototype.addDescriptionFields = function(e) {
      for (var n = this, i = 0, r = e; i < r.length; i++) {
        var o = r[i];
        !this.rendered && o.collapsed && this.expandable ? this.collapsedFields.push(o) : this.fields.push(o);
      }
      this.collapsedFields = this.collapsedFields.filter(function(s) {
        return !n.fields.some(function(a) {
          return s.fieldName === a.fieldName;
        });
      }), this.rendered && (this.refreshData(), v.emit(S.INNER_RESIZE));
    }, t.prototype.removeField = function(e) {
      var n = this.fields.splice(e, 1);
      this.collapsedFields = this.collapsedFields.concat(n), this.refreshData(), v.emit(S.INNER_RESIZE);
    }, t.prototype.refreshData = function() {
      var e;
      this.fieldsData = [];
      for (var n = 0; n < this.domain.length; n++)
        for (var i = this.domain[n], r = 0, o = this.fields; r < o.length; r++) {
          var s = o[r], a = i[s.fieldName], h = a === this.nullSentinel;
          this.fieldsData.push({
            id: i.id,
            displayId: (e = i.displayId) !== null && e !== void 0 ? e : this.rotated ? i.symbol : i.id,
            domainIndex: n,
            value: a,
            displayValue: h ? "Not Verified" : a,
            notNullSentinel: !h,
            displayName: s.name,
            fieldName: s.fieldName,
            type: s.type
          });
        }
    }, t.prototype.getTotalHeight = function() {
      var e = this.getFieldDimensions(), n = this.getFieldsGroupDimensions().height;
      return n + (this.collapsedFields.length ? e.height : 0);
    }, t.prototype.init = function(e) {
      this.container = e, this.label = this.container.append("text").attr("x", -6).attr("y", -11).attr("dy", ".32em").attr("text-anchor", "end").attr("class", "".concat(u.prefix, "track-group-label")).text(this.name), this.legendObject = this.container.append("svg:foreignObject").attr("width", 20).attr("height", 20), this.legend = this.legendObject.attr("x", 0).attr("y", -22).append("xhtml:div").html(this.params.label);
      var n = this.getFieldsGroupDimensions(), i = n.height, r = n.width;
      this.background = this.container.append("rect").attr("class", "".concat(u.prefix, "background")).attr("width", r).attr("height", i), this.refreshData();
    }, t.prototype.render = function() {
      var e = this;
      this.rendered = !0, this.computeCoordinates(), this.renderData(), this.legend.on("mouseover", function(n) {
        v.emit(_.DESCRIPTION_LEGEND_HOVER, {
          target: n.target,
          group: e.name
        });
      }).on("mouseout", function() {
        v.emit(_.DESCRIPTION_LEGEND_OUT);
      });
    }, t.prototype.getFieldsGroupDimensions = function() {
      return {
        width: this.width,
        height: this.params.cellHeight * this.fields.length,
        length: this.fields.length
      };
    }, t.prototype.getFieldDimensions = function() {
      return {
        width: this.domain.length > 0 ? this.width / this.domain.length : 0,
        height: this.params.cellHeight
      };
    }, t.prototype.update = function(e) {
      var n = this;
      this.domain = e;
      for (var i = {}, r = 0; r < e.length; r += 1)
        i[e[r].id] = r;
      for (var o = [], s = 0, a = this.fieldsData; s < a.length; s++) {
        var h = a[s], l = i[h.id];
        (l || l === 0) && (h.domainIndex = l, o.push(h));
      }
      this.fieldsData = o, this.computeCoordinates();
      var c = this.getFieldDimensions().width;
      this.container.selectAll(".".concat(u.prefix, "track-data")).data(this.fieldsData).attr("x", function(f) {
        var d, p = f.domainIndex, g = n.domain[p];
        return (d = n.rotated ? g.y : g.x) !== null && d !== void 0 ? d : 0;
      }).attr("data-track-data-index", function(f, d) {
        return d;
      }).attr("width", c);
    }, t.prototype.resize = function(e) {
      var n = this.getFieldsGroupDimensions().height;
      this.width = e, this.background.attr("class", "background").attr("width", e).attr("height", n), this.computeCoordinates(), this.renderData();
    }, t.prototype.computeCoordinates = function() {
      var e = this, n = this.getFieldsGroupDimensions(), i = n.height, r = n.length, o = this.getFieldDimensions().height;
      this.y = lt().domain(ht(this.fields.length).map(String)).range([0, i]), this.column && this.column.remove(), this.drawGridLines && (this.column = this.container.selectAll(".".concat(u.prefix, "column")).data(this.domain).enter().append("line").attr("class", "".concat(u.prefix, "column")).attr("column", function(h) {
        return h.id;
      }).attr("transform", function(h) {
        return "translate(".concat(e.rotated ? h.y : h.x, "),rotate(-90)");
      }).style("pointer-events", "none").attr("x1", -i)), this.row !== void 0 && this.row.remove(), this.row = this.container.selectAll(".".concat(u.prefix, "row")).data(this.fields).enter().append("g").attr("class", "".concat(u.prefix, "row")).attr("transform", function(h, l) {
        return "translate(0,".concat(e.y(String(l)), ")");
      }), this.drawGridLines && this.row.append("line").style("pointer-events", "none").attr("x2", this.width);
      var s = this.row.append("text");
      s.attr("class", "".concat(u.prefix, "track-label ").concat(u.prefix, "label-text-font")).attr("data-field", function(h) {
        return h.fieldName;
      }).on("click", function(h) {
        e.rotated ? u.sortRows(h.target.dataset.field) : u.sortColumns(h.target.dataset.field), v.emit(S.INNER_UPDATE, !1);
      }).transition().attr("x", -6).attr("y", o / 2).attr("dy", ".32em").attr("text-anchor", "end").text(function(h) {
        return h.name;
      }), this.expandable && setTimeout(function() {
        var h = "".concat(u.prefix, "remove-track");
        e.container.selectAll(".".concat(h)).remove();
        var l = {};
        s.each(function(c) {
          l[c.name] = c.getComputedTextLength();
        }), e.row.append("text").attr("class", h).text("-").attr("y", o / 2).attr("dy", ".32em").on("click", function(c, f) {
          e.removeField(f);
        }).attr("x", function(c) {
          return -(l[c.name] + 12 + c.getComputedTextLength());
        });
      });
      var a = this.container.selectAll(".".concat(u.prefix, "add-track"));
      this.collapsedFields.length && this.expandable ? (a.empty() && (a = this.container.append("text").text("+").attr("class", "".concat(u.prefix, "add-track")).attr("x", -6).attr("dy", ".32em").attr("text-anchor", "end").on("click", function() {
        v.emit(_.DESCRIPTION_BUTTONS_ADD_CLICK, {
          hiddenTracks: e.collapsedFields.slice(),
          addTrack: e.addDescriptionFields.bind(e)
        });
      })), a.attr("y", o / 2 + (r * o + this.y((r - 1).toString())))) : a.remove();
    }, t.prototype.setGridLines = function(e) {
      this.drawGridLines !== e && (this.drawGridLines = e, this.computeCoordinates());
    }, t.prototype.renderData = function() {
      for (var e = this, n = {}, i = 0; i < this.fields.length; i++)
        n[this.fields[i].fieldName] = i.toString();
      this.container.on("click", function(h) {
        var l = h.target, c = e.fieldsData[l.dataset.trackDataIndex];
        c && v.emit(_.DESCRIPTION_FIELD_CLICK, {
          target: l,
          domainId: c.id,
          type: e.rotated ? x.Rows : x.Columns,
          field: c.fieldName
        });
      }).on("mouseover", function(h) {
        var l = h.target, c = e.fieldsData[l.dataset.trackDataIndex];
        c && v.emit(_.DESCRIPTION_CELL_HOVER, {
          target: l,
          domainId: c.id,
          type: e.rotated ? x.Rows : x.Columns,
          field: c.fieldName
        });
      }).on("mouseout", function() {
        v.emit(_.DESCRIPTION_CELL_OUT);
      });
      var r = this.getFieldDimensions(), o = r.height, s = r.width, a = this.container.selectAll(".".concat(u.prefix, "track-data")).data(this.fieldsData);
      a.enter().append("rect").attr("data-track-data-index", function(h, l) {
        return l;
      }).attr("x", function(h) {
        var l, c = h.domainIndex, f = e.domain[c];
        return (l = e.rotated ? f.y : f.x) !== null && l !== void 0 ? l : 0;
      }).attr("y", function(h) {
        var l, c = h.fieldName;
        return (l = e.y(n[c])) !== null && l !== void 0 ? l : 0;
      }).attr("width", s).attr("height", o).attr("fill", u.customFunctions[this.blockType].fill).attr("opacity", u.customFunctions[this.blockType].opacity).attr("class", function(h) {
        var l = h.id, c = h.value, f = h.fieldName;
        return [
          "".concat(u.prefix, "track-data"),
          "".concat(u.prefix, "track-").concat(f),
          "".concat(u.prefix, "track-").concat(c),
          "".concat(u.prefix).concat(l, "-cell")
        ].join(" ");
      }), a.exit().remove();
    }, t;
  }()
), re = (
  /** @class */
  function() {
    function t(e, n, i, r, o, s) {
      this.width = 0, this.height = 0, this.groupMap = {}, this.groups = [], this.parentHeight = 0, this.blockType = n, this.offset = s, this.params = e, this.svg = i, this.rotated = r || !1, this.domain = (this.rotated ? e.rows : e.columns) || [], this.width = (this.rotated ? e.parentHeight : e.width) || 500, this.cellHeight = e.height || 10, this.cellWidth = this.domain.length > 0 ? this.width / this.domain.length : 0, this.fields = o || [], this.drawGridLines = e.grid || !1, this.nullSentinel = e.nullSentinel || -777, this.parseGroups();
    }
    return t.prototype.getDimensions = function() {
      var e;
      return {
        padding: (e = this.params.padding) !== null && e !== void 0 ? e : 20,
        margin: this.params.margin || { top: 30, right: 15, bottom: 15, left: 80 }
      };
    }, t.prototype.isGroupExpandable = function(e) {
      var n, i;
      return (i = (n = this.params.expandableGroups) === null || n === void 0 ? void 0 : n.includes(e)) !== null && i !== void 0 ? i : !1;
    }, t.prototype.getDescriptionFieldsGroupParams = function(e) {
      return {
        cellHeight: this.cellHeight,
        width: this.width,
        grid: this.drawGridLines,
        nullSentinel: this.nullSentinel,
        domain: this.domain,
        label: this.params.label,
        expandable: e,
        wrapper: this.params.wrapper
      };
    }, t.prototype.parseGroups = function() {
      var e = this;
      this.fields.forEach(function(n) {
        var i = n.group;
        if (e.groupMap[i] === void 0) {
          var r = new so(e.getDescriptionFieldsGroupParams(e.isGroupExpandable(i)), e.blockType, i, e.rotated);
          e.groupMap[i] = r, e.groups.push(r);
        }
        e.groupMap[i].addDescriptionFields([n]);
      });
    }, t.prototype.init = function() {
      var e = this;
      this.container = this.svg.append("g");
      var n = this.rotated ? 16.5 : 0;
      this.height = 0;
      for (var i = this.getDimensions().padding, r = 0, o = this.groups; r < o.length; r++) {
        var s = o[r], a = this.container.append("g").attr("transform", "translate(0," + this.parentHeight + ")");
        s.init(a), this.height += s.getTotalHeight() + i;
      }
      var h = this.rotated ? -(this.offset + this.parentHeight) : i + this.offset;
      this.container.attr("width", this.width).attr("height", this.height).attr("class", "".concat(u.prefix, "track")).attr("transform", function() {
        return "".concat(e.rotated ? "rotate(90) " : "", "translate(0,").concat(h, ")");
      }), this.height += n;
    }, t.prototype.render = function() {
      for (var e = 0, n = this.groups; e < n.length; e++) {
        var i = n[e];
        i.render();
      }
    }, t.prototype.resize = function(e, n, i) {
      var r = this;
      this.offset = i || this.offset, this.width = this.rotated ? n : e, this.parentHeight = 0;
      for (var o = this.rotated ? 16.5 : 0, s = this.getDimensions().padding, a = 0, h = this.groups; a < h.length; a++) {
        var l = h[a];
        l.setTransform(0, this.parentHeight), l.resize(this.width), this.parentHeight += l.getTotalHeight() + s;
      }
      var c = this.rotated ? -(this.offset + this.parentHeight) : s + this.offset;
      this.container.attr("width", this.width).attr("height", this.parentHeight).attr("transform", function() {
        return "".concat(r.rotated ? "rotate(90) " : "", "translate(0,").concat(c, ")");
      }), this.parentHeight += o;
    }, t.prototype.update = function(e) {
      this.domain = e;
      for (var n = 0, i = this.groups; n < i.length; n++) {
        var r = i[n];
        r.update(e);
      }
    }, t.prototype.setGridLines = function(e) {
      for (var n = 0, i = this.groups; n < i.length; n++) {
        var r = i[n];
        r.setGridLines(e);
      }
    }, t;
  }()
);
wt();
var oe = (
  /** @class */
  function() {
    function t(e, n, i) {
      var r, o;
      this.padding = 10, this.centerText = -10, this.histogramHeight = 80, this.topCount = 1, this.container = null, this.lineWidthOffset = ((r = e.histogramBorderPadding) === null || r === void 0 ? void 0 : r.left) || 10, this.lineHeightOffset = ((o = e.histogramBorderPadding) === null || o === void 0 ? void 0 : o.bottom) || 5, this.svg = n, this.rotated = i || !1, this.domain = this.rotated ? u.rows : u.columns, this.margin = e.margin || { top: 15, right: 15, bottom: 15, left: 80 }, this.width = e.width || 500, this.height = e.height || 500, this.histogramWidth = this.rotated ? this.height : this.width, this.numDomain = this.domain.length, this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length, this.totalHeight = this.histogramHeight + this.lineHeightOffset + this.padding, this.wrapper = Z(e.wrapper || "body");
    }
    return t.prototype.getHistogramHeight = function() {
      return this.totalHeight;
    }, t.prototype.render = function() {
      var e = this, n = this.getLargestCount(this.domain);
      this.topCount = n, this.container = this.svg.append("g").attr("class", "".concat(u.prefix, "histogram")).attr("width", function() {
        return e.rotated ? e.height : e.width + e.margin.left + e.margin.right;
      }).attr("height", this.histogramHeight).style("margin-left", this.margin.left + "px").attr("transform", function() {
        return e.rotated ? "rotate(90)translate(0,-" + e.width + ")" : "";
      }), this.histogram = this.container.append("g").attr("transform", "translate(0,-" + (this.totalHeight + this.centerText) + ")"), this.renderAxis(n), this.histogram.on("mouseover", function(i) {
        var r = i.target, o = e.domain[r.dataset.domainIndex];
        o && v.emit(_.HISTOGRAM_HOVER, {
          target: r,
          domainId: o.id,
          type: e.rotated ? x.Rows : x.Columns
        });
      }).on("mouseout", function() {
        v.emit(_.HISTOGRAM_OUT);
      }).on("click", function(i) {
        var r = i.target, o = e.domain[r.dataset.domainIndex];
        o && (e.rotated ? u.sortColumns("countByRow", o.id) : u.sortRows("countByColumn", o.id), v.emit(S.INNER_UPDATE, !1), v.emit(_.HISTOGRAM_CLICK, {
          target: r,
          domainId: o.id,
          type: e.rotated ? x.Rows : x.Columns
        }));
      }), this.histogram.selectAll("rect").data(this.domain).enter().append("rect").attr("class", function(i) {
        return "".concat(u.prefix, "sortable-bar ").concat(u.prefix).concat(i.id, "-bar");
      }).attr("data-domain-index", function(i, r) {
        return r;
      }).attr("width", this.barWidth - (this.barWidth < 3 ? 0 : 1)).attr("height", function(i) {
        return e.histogramHeight * i.count / n;
      }).attr("x", function(i) {
        return e.rotated ? i.y : i.x;
      }).attr("y", function(i) {
        return e.histogramHeight - e.histogramHeight * i.count / n;
      }).attr("fill", "#1693C0");
    }, t.prototype.update = function(e) {
      var n = this;
      this.domain = e, this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length;
      var i = this.topCount || this.getLargestCount(this.domain);
      this.updateAxis(i), this.histogram.selectAll("rect").data(this.domain).attr("data-domain-index", function(r, o) {
        return o;
      }).transition().attr("width", this.barWidth - (this.barWidth < 3 ? 0 : 1)).attr("height", function(r) {
        return n.histogramHeight * r.count / i;
      }).attr("y", function(r) {
        return n.histogramHeight - n.histogramHeight * r.count / i;
      }).attr("x", function(r) {
        return n.rotated ? r.y : r.x;
      });
    }, t.prototype.resize = function(e, n) {
      var i = this;
      this.container !== null && (this.width = e, this.height = n, this.histogramWidth = this.rotated ? this.height : this.width, this.container.attr("width", function() {
        return i.rotated ? i.height : i.width + i.margin.left + i.margin.right;
      }).attr("transform", function() {
        return i.rotated ? "rotate(90)translate(0,-" + i.width + ")" : "";
      }), this.histogram.attr("transform", "translate(0,-" + (this.totalHeight + this.centerText) + ")"), this.bottomAxis.attr("x2", this.histogramWidth + 10));
    }, t.prototype.renderAxis = function(e) {
      this.bottomAxis = this.histogram.append("line").attr("class", "".concat(u.prefix, "histogram-axis")), this.leftAxis = this.histogram.append("line").attr("class", "".concat(u.prefix, "histogram-axis")), this.topText = this.histogram.append("text").attr("class", "".concat(u.prefix, "label-text-font")).attr("dy", ".32em").attr("text-anchor", "end"), this.middleText = this.histogram.append("text").attr("class", "".concat(u.prefix, "label-text-font")).attr("dy", ".32em").attr("text-anchor", "end"), this.leftLabel = this.histogram.append("text").text("Mutation freq.").attr("class", "".concat(u.prefix, "label-text-font")).attr("text-anchor", "middle").attr("transform", "rotate(-90)").attr("x", "-40").attr("y", "-25"), this.updateAxis(e);
    }, t.prototype.updateAxis = function(e) {
      this.bottomAxis.attr("y1", this.histogramHeight + this.lineHeightOffset).attr("y2", this.histogramHeight + this.lineHeightOffset).attr("x2", this.histogramWidth + this.lineWidthOffset).attr("transform", "translate(-" + this.lineHeightOffset + ",0)"), this.leftAxis.attr("y1", 0).attr("y2", this.histogramHeight + this.lineHeightOffset).attr("transform", "translate(-" + this.lineHeightOffset + ",0)"), this.topText.attr("x", this.centerText).text(e);
      var n = parseInt(String(e / 2)), i = this.histogramHeight - this.histogramHeight / (e / n);
      this.middleText.attr("x", this.centerText).attr("y", i).text(n), this.leftLabel.attr("x", -this.histogramHeight / 2).attr("y", -this.lineHeightOffset - this.padding);
    }, t.prototype.getLargestCount = function(e) {
      for (var n = 1, i = 0, r = e; i < r.length; i++) {
        var o = r[i];
        n = Math.max(n, o.count);
      }
      return n;
    }, t.prototype.destroy = function() {
      var e;
      this.histogram.remove(), (e = this.container) === null || e === void 0 || e.remove();
    }, t;
  }()
);
wt();
var ao = (
  /** @class */
  function() {
    function t(e, n, i) {
      var r, o;
      this.leftTextWidth = 80, this.types = [Dt.Mutation], this.colorMap = {
        missense_variant: "#ff9b6c",
        frameshift_variant: "#57dba4",
        stop_gained: "#af57db",
        start_lost: "#ff2323",
        stop_lost: "#d3ec00",
        initiator_codon_variant: "#5abaff"
      }, this.width = 500, this.height = 500, this.inputWidth = 500, this.inputHeight = 500, this.margin = { top: 30, right: 100, bottom: 15, left: 80 }, this.heatMap = !1, this.drawGridLines = !1, this.crosshair = !1, this.heatMapColor = "#D33682", this.fullscreen = !1, this.params = e, this.x = n, this.y = i, this.loadParams(e), this.createRowMap(), this.init();
      var s = this.getDescriptionBlockParams(), a = this.getHistogramParams();
      this.horizontalHistogram = new oe(a, this.container, !1), this.horizontalDescriptionBlock = new re(s, x.Columns, this.container, !1, (r = e.columnFields) !== null && r !== void 0 ? r : [], this.height + 10), this.horizontalDescriptionBlock.init(), this.verticalHistogram = new oe(a, this.container, !0), this.verticalDescriptionBlock = new re(s, x.Rows, this.container, !0, (o = e.rowFields) !== null && o !== void 0 ? o : [], this.width + 10 + this.verticalHistogram.getHistogramHeight() + 10 + u.minCellHeight * this.types.length), this.verticalDescriptionBlock.init();
    }
    return t.prototype.getDescriptionBlockParams = function() {
      return {
        padding: this.params.trackPadding,
        offset: this.params.offset,
        label: this.params.fieldLegendLabel,
        margin: this.params.margin,
        rows: this.params.rows,
        columns: this.params.columns,
        width: this.params.width,
        parentHeight: this.params.height,
        height: this.params.fieldHeight,
        nullSentinel: this.params.nullSentinel,
        grid: this.params.grid,
        wrapper: this.params.wrapper,
        expandableGroups: this.params.expandableGroups
      };
    }, t.prototype.getHistogramParams = function() {
      return {
        histogramBorderPadding: this.params.histogramBorderPadding,
        type: this.params.type,
        rows: this.params.rows,
        columns: this.params.columns,
        margin: this.params.margin,
        width: this.params.width,
        height: this.params.height,
        wrapper: this.params.wrapper
      };
    }, t.prototype.loadParams = function(e) {
      var n = e.leftTextWidth, i = e.wrapper, r = e.colorMap, o = e.width, s = e.height, a = e.margin, h = e.heatMap, l = e.heatMapColor, c = e.grid;
      n !== void 0 && (this.leftTextWidth = n), this.wrapper = Z(i || "body"), r !== void 0 && (this.colorMap = r), o !== void 0 && (this.inputWidth = o), s !== void 0 && (this.inputHeight = s), this.initDimensions(o, s), a !== void 0 && (this.margin = a), h !== void 0 && (this.heatMap = h), c !== void 0 && (this.drawGridLines = c), l !== void 0 && (this.heatMapColor = l);
    }, t.prototype.init = function() {
      this.svg = this.wrapper.append("svg").attr("class", "".concat(u.prefix, "maingrid-svg")).attr("id", "".concat(u.prefix, "maingrid-svg")).attr("width", "100%"), this.container = this.svg.append("g"), this.background = this.container.append("rect").attr("class", "".concat(u.prefix, "background")).attr("width", this.width).attr("height", this.height), this.gridContainer = this.container.append("g");
    }, t.prototype.render = function() {
      var e = this;
      v.emit(b.RENDER_GRID_START), this.computeCoordinates(), this.svg.on("mouseover", function(n) {
        var i = n.target, r = Rt(n, i), o = e.getIndexFromScaleBand(e.x, r[0]), s = e.getIndexFromScaleBand(e.y, r[1]);
        if (!(!i.dataset.obsIndex || e.crosshair)) {
          var a = i.dataset.obsIndex.split(" "), h = u.entries.filter(function(c) {
            return c.columnId === a[0] && c.rowId === a[1];
          }), l = h.find(function(c) {
            return c.id == a[2];
          });
          v.emit(_.GRID_CELL_HOVER, {
            target: i,
            entryIds: h.map(function(c) {
              return c.id;
            }),
            entryId: l.id,
            columnId: u.columns[o].id,
            rowId: u.rows[s].id
          });
        }
      }), this.svg.on("mouseout", function() {
        v.emit(_.GRID_OUT);
      }), this.svg.on("click", function(n) {
        var i, r = (i = n.target.dataset.obsIndex) === null || i === void 0 ? void 0 : i.split(" ");
        r && v.emit(_.GRID_CELL_CLICK, {
          target: n.target,
          columnId: r[0],
          rowId: r[1],
          entryId: r[2]
        });
      }), this.container.selectAll(".".concat(u.prefix, "maingrid-svg")).data(u.entries).enter().append("path").attr("data-obs-index", function(n) {
        return "".concat(n.columnId, " ").concat(n.rowId, " ").concat(n.id);
      }).attr("class", function(n) {
        return "".concat(u.prefix, "sortable-rect ").concat(u.prefix).concat(n.columnId, "-cell ").concat(u.prefix).concat(n.rowId, "-cell");
      }).attr("cons", function(n) {
        return e.getValueByType(n);
      }).attr("d", function(n) {
        return e.getRectangularPath(n);
      }).attr("fill", function(n) {
        return e.getColor(n);
      }).attr("opacity", function(n) {
        return e.getOpacity(n);
      }), v.emit(b.RENDER_GRID_END), u.entries.length && (v.emit(b.RENDER_X_HISTOGRAM_START), this.horizontalHistogram.render(), v.emit(b.RENDER_X_HISTOGRAM_END), v.emit(b.RENDER_Y_HISTOGRAM_START), this.verticalHistogram.render(), v.emit(b.RENDER_Y_HISTOGRAM_END)), v.emit(b.RENDER_X_DESCRIPTION_BLOCK_START), this.horizontalDescriptionBlock.render(), v.emit(b.RENDER_X_DESCRIPTION_BLOCK_END), v.emit(b.RENDER_Y_DESCRIPTION_BLOCK_START), this.verticalDescriptionBlock.render(), v.emit(b.RENDER_Y_DESCRIPTION_BLOCK_END), this.defineCrosshairBehaviour(), this.resizeSvg();
    }, t.prototype.update = function(e, n) {
      var i = this;
      this.computeCoordinates(), this.createRowMap(), this.x = e, this.y = n, this.row.selectAll("text").attr("style", function() {
        return i.cellHeight < u.minCellHeight ? "display: none;" : "";
      }), this.row.transition().attr("transform", function(r) {
        return "translate( 0, " + r.y + ")";
      }), this.container.selectAll(".".concat(u.prefix, "sortable-rect")).transition().attr("d", function(r) {
        return i.getRectangularPath(r);
      }), this.horizontalDescriptionBlock.update(u.columns), this.verticalDescriptionBlock.update(u.rows), this.horizontalHistogram.update(u.columns), this.verticalHistogram.update(u.rows);
    }, t.prototype.computeCoordinates = function() {
      var e = this, n, i;
      this.cellWidth = this.width / u.columns.length, (n = this.column) === null || n === void 0 || n.remove(), this.drawGridLines && (this.column = this.gridContainer.selectAll(".".concat(u.prefix, "column-column")).data(u.columns).enter().append("line").attr("x1", function(r) {
        return r.x;
      }).attr("x2", function(r) {
        return r.x;
      }).attr("y1", 0).attr("y2", this.height).attr("class", "".concat(u.prefix, "column-column")).style("pointer-events", "none")), this.cellHeight = this.height / u.rows.length, (i = this.row) === null || i === void 0 || i.remove(), this.row = this.gridContainer.selectAll(".".concat(u.prefix, "row-row")).data(u.rows).enter().append("g").attr("class", "".concat(u.prefix, "row-row")).attr("transform", function(r) {
        return "translate(0," + r.y + ")";
      }), this.drawGridLines && this.row.append("line").attr("x2", this.width).style("pointer-events", "none"), this.row.append("text").attr("class", function(r) {
        return "".concat(u.prefix).concat(r.id, "-label ").concat(u.prefix, "row-label ").concat(u.prefix, "label-text-font");
      }).attr("data-row", function(r) {
        return r.id;
      }).attr("x", -8).attr("y", this.cellHeight / 2).attr("dy", ".32em").attr("text-anchor", "end").attr("style", function() {
        return e.cellHeight < u.minCellHeight ? "display: none;" : "";
      }).text(function(r) {
        return r.symbol;
      }).on("mouseover", function(r) {
        var o = r.target, s = o.dataset.row;
        s && v.emit(_.GRID_LABEL_HOVER, {
          target: o,
          rowId: s
        });
      }).on("click", function(r) {
        var o = r.target, s = o.dataset.row;
        s && (u.sortColumns("countByRow", s), v.emit(S.INNER_UPDATE, !1), v.emit(_.GRID_LABEL_CLICK, {
          target: o,
          rowId: s
        }));
      });
    }, t.prototype.initDimensions = function(e, n) {
      e !== void 0 && (this.width = e), n !== void 0 && (this.height = n), this.cellWidth = this.width / u.columns.length, this.cellHeight = this.height / u.rows.length, this.cellHeight < u.minCellHeight && (this.cellHeight = u.minCellHeight, this.height = u.rows.length * u.minCellHeight);
    }, t.prototype.resize = function(e, n, i, r) {
      this.createRowMap(), this.x = i, this.y = r, this.initDimensions(e, n), this.background.attr("width", this.width).attr("height", this.height), this.computeCoordinates(), u.entries.length && (this.horizontalHistogram.resize(e, this.height), this.verticalHistogram.resize(e, this.height));
      var o = this.horizontalHistogram.getHistogramHeight();
      this.horizontalDescriptionBlock.resize(e, this.height, this.height), this.verticalDescriptionBlock.resize(e, this.height, this.width + o + 120), this.resizeSvg(), this.update(this.x, this.y), this.verticalCross.attr("y2", this.height + this.horizontalDescriptionBlock.height), this.horizontalCross.attr("x2", this.width + o * this.types.length + this.verticalDescriptionBlock.height);
    }, t.prototype.resizeSvg = function() {
      var e = this.horizontalHistogram.getHistogramHeight(), n = this.margin.left + this.leftTextWidth + this.width + e * this.types.length + this.verticalDescriptionBlock.height + this.margin.right, i = this.margin.top + 10 + e + 10 + this.height + this.horizontalDescriptionBlock.height + this.margin.bottom;
      this.svg.attr("width", n).attr("height", i).attr("viewBox", "0 0 ".concat(n, " ").concat(i)), this.container.attr("transform", "translate(" + (this.margin.left + this.leftTextWidth) + "," + (this.margin.top + e * this.types.length + 10) + ")");
    }, t.prototype.defineCrosshairBehaviour = function() {
      var e = this, n = function(r, o) {
        if (e.crosshair) {
          var s = Rt(o, o.target);
          e.verticalCross.attr("x1", s[0]).attr("opacity", 1), e.verticalCross.attr("x2", s[0]).attr("opacity", 1), e.horizontalCross.attr("y1", s[1]).attr("opacity", 1), e.horizontalCross.attr("y2", s[1]).attr("opacity", 1), r === "mousemove" && e.selectionRegion !== void 0 && e.changeSelection(s);
          var a = e.width < s[0] ? -1 : e.getIndexFromScaleBand(e.x, s[0]), h = e.height < s[1] ? -1 : e.getIndexFromScaleBand(e.y, s[1]), l = u.columns[a], c = u.rows[h];
          if (!l || !c)
            return;
          r === "mouseover" && v.emit(_.GRID_CROSSHAIR_HOVER, {
            target: o.target,
            columnId: l.id,
            rowId: c.id
          });
        }
      }, i = this.horizontalHistogram.getHistogramHeight();
      this.verticalCross = this.container.append("line").attr("class", "".concat(u.prefix, "vertical-cross")).attr("y1", -i).attr("y2", this.height + this.horizontalDescriptionBlock.height).attr("opacity", 0).attr("style", "pointer-events: none"), this.horizontalCross = this.container.append("line").attr("class", "".concat(u.prefix, "horizontal-cross")).attr("x1", 0).attr("x2", this.width + i + this.verticalDescriptionBlock.height).attr("opacity", 0).attr("style", "pointer-events: none"), this.container.on("mousedown", function(r) {
        e.startSelection(r);
      }).on("mouseover", function(r) {
        n("mouseover", r);
      }).on("mousemove", function(r) {
        n("mousemove", r);
      }).on("mouseout", function() {
        e.crosshair && (e.verticalCross.attr("opacity", 0), e.horizontalCross.attr("opacity", 0), v.emit(_.GRID_CROSSHAIR_OUT));
      }).on("mouseup", function(r) {
        e.verticalCross.attr("opacity", 0), e.horizontalCross.attr("opacity", 0), e.finishSelection(r);
      });
    }, t.prototype.startSelection = function(e) {
      if (this.crosshair && this.selectionRegion === void 0) {
        e.stopPropagation();
        var n = Rt(e, e.target);
        v.emit(_.GRID_SELECTION_STARTED, {
          target: e.target,
          x: n[0],
          y: n[1]
        }), this.selectionRegion = this.container.append("rect").attr("x", n[0]).attr("y", n[1]).attr("width", 1).attr("height", 1).attr("class", "".concat(u.prefix, "selection-region")).attr("stroke", "black").attr("stroke-width", "2").attr("opacity", 0.2);
      }
    }, t.prototype.changeSelection = function(e) {
      var n = {
        x: parseInt(this.selectionRegion.attr("x"), 10),
        y: parseInt(this.selectionRegion.attr("y"), 10),
        width: parseInt(this.selectionRegion.attr("width"), 10),
        height: parseInt(this.selectionRegion.attr("height"), 10)
      }, i = {
        x: e[0] - Number(this.selectionRegion.attr("x")),
        y: e[1] - Number(this.selectionRegion.attr("y"))
      };
      i.x < 1 || i.x * 2 < n.width ? (n.x = e[0], n.width -= i.x) : n.width = i.x, i.y < 1 || i.y * 2 < n.height ? (n.y = e[1], n.height -= i.y) : n.height = i.y, this.selectionRegion.attr("x", n.x), this.selectionRegion.attr("y", n.y), this.selectionRegion.attr("width", n.width), this.selectionRegion.attr("height", n.height);
    }, t.prototype.getIndexFromScaleBand = function(e, n) {
      var i = e.step(), r = Math.floor(n / i);
      return e.domain()[r];
    }, t.prototype.finishSelection = function(e) {
      if (this.crosshair && this.selectionRegion !== void 0) {
        e.stopPropagation();
        var n = Number(this.selectionRegion.attr("x")), i = n + Number(this.selectionRegion.attr("width")), r = Number(this.selectionRegion.attr("y")), o = r + Number(this.selectionRegion.attr("height")), s = this.getIndexFromScaleBand(this.x, n), a = this.getIndexFromScaleBand(this.x, i), h = this.getIndexFromScaleBand(this.y, r), l = this.getIndexFromScaleBand(this.y, o);
        this.sliceColumns(parseInt(s), parseInt(a)), this.sliceRows(parseInt(h), parseInt(l)), this.selectionRegion.remove(), delete this.selectionRegion, v.emit(_.GRID_SELECTION_FINISHED, {
          target: e.target,
          x: i,
          y: o
        }), v.emit(S.INNER_UPDATE, !0);
      }
    }, t.prototype.sliceRows = function(e, n) {
      for (var i = 0; i < u.rows.length; i++) {
        var r = u.rows[i];
        (i < e || i > n) && (V(".".concat(u.prefix).concat(r.id, "-cell")).remove(), V(".".concat(u.prefix).concat(r.id, "-bar")).remove(), u.rows.splice(i, 1), i--, e--, n--);
      }
    }, t.prototype.sliceColumns = function(e, n) {
      for (var i = 0; i < u.columns.length; i++) {
        var r = u.columns[i];
        (i < e || i > n) && (V(".".concat(u.prefix).concat(r.id, "-cell")).remove(), V(".".concat(u.prefix).concat(r.id, "-bar")).remove(), u.columns.splice(i, 1), i--, e--, n--);
      }
    }, t.prototype.createRowMap = function() {
      for (var e = {}, n = 0, i = u.rows; n < i.length; n++) {
        var r = i[n];
        e[r.id] = r;
      }
      this.rowMap = e;
    }, t.prototype.getY = function(e) {
      var n, i = e.id, r = e.rowId, o = e.columnId, s = (n = this.rowMap[r].y) !== null && n !== void 0 ? n : 0;
      if (this.heatMap)
        return s;
      var a = u.lookupTable[o][r];
      return a.length === 0 ? s : s + this.cellHeight / a.length * a.indexOf(i);
    }, t.prototype.getCellX = function(e) {
      var n;
      return (n = u.lookupTable[e.columnId].x) !== null && n !== void 0 ? n : 0;
    }, t.prototype.getColor = function(e) {
      var n, i = (n = e.value) !== null && n !== void 0 ? n : e.consequence;
      return this.heatMap ? this.heatMapColor : this.colorMap[i];
    }, t.prototype.getOpacity = function(e) {
      return e && this.heatMap ? 0.25 : 1;
    }, t.prototype.getHeight = function(e) {
      var n, i = e.columnId, r = e.rowId, o = (n = this.cellHeight) !== null && n !== void 0 ? n : 0;
      if (this.heatMap)
        return o;
      var s = u.lookupTable[i][r].length;
      return s === 0 ? o : o / s;
    }, t.prototype.getValueByType = function(e) {
      var n;
      return (n = e.value) !== null && n !== void 0 ? n : "";
    }, t.prototype.getRectangularPath = function(e) {
      var n = this.getCellX(e), i = this.getY(e);
      return "M " + n + " " + i + " H " + (n + this.cellWidth) + " V " + (i + this.getHeight(e)) + " H " + n + "Z";
    }, t.prototype.setHeatmap = function(e) {
      var n = this;
      return e === this.heatMap ? this.heatMap : (this.heatMap = e, V(".".concat(u.prefix, "sortable-rect")).transition().attr("d", function(i) {
        return n.getRectangularPath(i);
      }).attr("fill", function(i) {
        return n.getColor(i);
      }).attr("opacity", function(i) {
        return n.getOpacity(i);
      }), this.heatMap);
    }, t.prototype.setGridLines = function(e) {
      return this.drawGridLines === e ? this.drawGridLines : (this.drawGridLines = e, this.verticalDescriptionBlock.setGridLines(this.drawGridLines), this.horizontalDescriptionBlock.setGridLines(this.drawGridLines), this.computeCoordinates(), this.drawGridLines);
    }, t.prototype.setCrosshair = function(e) {
      return this.crosshair = e, this.crosshair;
    }, t.prototype.destroy = function() {
      this.wrapper.select(".".concat(u.prefix, "maingrid-svg")).remove();
    }, t;
  }()
), ho = (
  /** @class */
  function(t) {
    se(e, t);
    function e(n) {
      var i, r, o = t.call(this) || this;
      return o.heatMapMode = !1, o.drawGridLines = !1, o.crosshairMode = !1, o.charts = [], o.fullscreen = !1, u.setOptions(n), o.params = n, o.width = (i = n.width) !== null && i !== void 0 ? i : 500, o.height = (r = n.height) !== null && r !== void 0 ? r : 500, o.height / u.rows.length < u.minCellHeight && (o.height = u.rows.length * u.minCellHeight), n.wrapper = ".".concat(u.prefix, "container"), o.container = Z(n.element || "body").append("div").attr("class", "".concat(u.prefix, "container")).style("position", "relative"), o.initCharts(), v.exposeEvents().forEach(function(s) {
        v.on(s, function(a) {
          return o.emit(s, a);
        });
      }), o;
    }
    return e.create = function(n) {
      return new e(n);
    }, e.prototype.initCharts = function(n) {
      var i = this;
      this.createLookupTable(), this.computeColumnCounts(), this.computeRowCounts(), this.computeRowScoresAndCount(), this.rowsSortByScores(), this.computeScores(), this.sortByScores(), this.calculatePositions(), n && (this.params.width = this.width, this.params.height = this.height), this.mainGrid = new ao(this.params, this.x, this.y), v.off(S.INNER_RESIZE), v.off(S.INNER_UPDATE), v.on(S.INNER_RESIZE, function() {
        i.resize(i.width, i.height, i.fullscreen);
      }), v.on(S.INNER_UPDATE, function(r) {
        i.update(r);
      }), this.heatMapMode = this.mainGrid.heatMap, this.drawGridLines = this.mainGrid.drawGridLines, this.crosshairMode = this.mainGrid.crosshair, this.charts = [], this.charts.push(this.mainGrid);
    }, e.prototype.calculatePositions = function() {
      for (var n, i = lt().domain(ht(u.columns.length).map(String)).range([0, this.width]), r = lt().domain(ht(u.rows.length).map(String)).range([0, this.height]), o = 0; o < u.columns.length; o++) {
        var s = u.columns[o], a = s.id, h = i(String(o));
        s.x = h, u.lookupTable[a] = u.lookupTable[a] || {}, u.lookupTable[a].x = h;
      }
      for (var o = 0; o < u.rows.length; o++)
        u.rows[o].y = (n = r(String(o))) !== null && n !== void 0 ? n : 0;
      this.x = i, this.y = r;
    }, e.prototype.createLookupTable = function() {
      var n = {};
      u.entries.forEach(function(i) {
        var r = i.columnId, o = i.rowId;
        n[r] === void 0 && (n[r] = {}), n[r][o] === void 0 && (n[r][o] = []), n[r][o].push(i.id);
      }), u.setLookupTable(n);
    }, e.prototype.render = function() {
      var n = this;
      v.emit(b.RENDER_ALL_START), setTimeout(function() {
        n.charts.forEach(function(i) {
          i.render();
        }), v.emit(b.RENDER_ALL_END);
      });
    }, e.prototype.update = function(n) {
      var i = this;
      n === void 0 && (n = !1), n && (this.computeScores(), this.sortByScores()), this.calculatePositions(), this.charts.forEach(function(r) {
        r.update(i.x, i.y);
      });
    }, e.prototype.resize = function(n, i, r) {
      var o = this;
      this.fullscreen = r, this.mainGrid.fullscreen = r, this.width = Number(n), this.height = Number(i), this.height / u.rows.length < u.minCellHeight && (this.height = u.rows.length * u.minCellHeight), this.calculatePositions(), this.charts.forEach(function(s) {
        s.fullscreen = r, s.resize(o.width, o.height, o.x, o.y);
      });
    }, e.prototype.sortByScores = function() {
      u.columns.sort(this.sortScore);
    }, e.prototype.rowsSortByScores = function() {
      u.rows.sort(this.sortScore);
    }, e.prototype.cluster = function() {
      this.rowsSortByScores(), this.computeScores(), this.sortByScores(), this.update(!1);
    }, e.prototype.setHeatmap = function(n) {
      this.heatMapMode = n, this.mainGrid.setHeatmap(n);
    }, e.prototype.toggleHeatmap = function() {
      this.setHeatmap(!this.heatMapMode);
    }, e.prototype.setGridLines = function(n) {
      this.drawGridLines = n, this.mainGrid.setGridLines(n);
    }, e.prototype.toggleGridLines = function() {
      this.setGridLines(!this.drawGridLines);
    }, e.prototype.setCrosshair = function(n) {
      this.crosshairMode = n, this.mainGrid.setCrosshair(n);
    }, e.prototype.toggleCrosshair = function() {
      this.setCrosshair(!this.crosshairMode);
    }, e.prototype.mutationScore = function(n, i) {
      var r, o;
      return ((o = (r = u.lookupTable) === null || r === void 0 ? void 0 : r[n]) === null || o === void 0 ? void 0 : o[i]) !== void 0 ? 1 : 0;
    }, e.prototype.mutationRowScore = function(n, i) {
      var r, o;
      if (((o = (r = u.lookupTable) === null || r === void 0 ? void 0 : r[n]) === null || o === void 0 ? void 0 : o[i]) !== void 0) {
        var s = u.lookupTable[n][i];
        return s.length;
      } else
        return 0;
    }, e.prototype.computeScores = function() {
      for (var n = 0, i = u.columns; n < i.length; n++) {
        var r = i[n];
        r.score = 0;
        for (var o = 0; o < u.rows.length; o++) {
          var s = u.rows[o];
          r.score += this.mutationScore(r.id, s.id) * Math.pow(2, u.rows.length + 1 - o);
        }
      }
    }, e.prototype.computeRowScoresAndCount = function() {
      for (var n = 0, i = u.rows; n < i.length; n++) {
        var r = i[n];
        r.score = 0;
        for (var o = 0, s = u.columns; o < s.length; o++) {
          var a = s[o];
          r.score += this.mutationRowScore(a.id, r.id);
        }
        r.count = r.score;
      }
    }, e.prototype.computeColumnCounts = function() {
      for (var n, i = 0, r = u.columns; i < r.length; i++) {
        var o = r[i], s = Object.values((n = u.lookupTable[o.id]) !== null && n !== void 0 ? n : {});
        o.count = 0;
        for (var a = 0, h = s; a < h.length; a++) {
          var l = h[a];
          o.count += l.length;
        }
        o.countByRow = {};
        for (var c = 0, f = u.entries; c < f.length; c++) {
          var d = f[c];
          o.id === d.columnId && (o.countByRow[d.rowId] === void 0 && (o.countByRow[d.rowId] = 0), o.countByRow[d.rowId]++);
        }
      }
    }, e.prototype.computeRowCounts = function() {
      for (var n = 0, i = u.rows; n < i.length; n++) {
        var r = i[n];
        r.count = 0, r.countByColumn = {};
        for (var o = 0, s = u.entries; o < s.length; o++) {
          var a = s[o];
          r.id === a.rowId && (r.count++, r.countByColumn[a.columnId] === void 0 && (r.countByColumn[a.columnId] = 0), r.countByColumn[a.columnId]++);
        }
      }
    }, e.prototype.sortScore = function(n, i) {
      return n.score < i.score ? 1 : n.score > i.score ? -1 : n.id >= i.id ? 1 : -1;
    }, e.prototype.destroy = function() {
      this.charts.forEach(function(n) {
        n.destroy();
      }), this.container.remove();
    }, e.prototype.reload = function() {
      this.charts.forEach(function(n) {
        n.destroy();
      }), u.reset(), this.container = Z(this.params.element || "body").append("div").attr("class", "".concat(u.prefix, "container")).style("position", "relative"), this.initCharts(!0), this.render();
    }, e;
  }(De)
);
export {
  ho as default
};
//# sourceMappingURL=event-matrix.es.js.map
