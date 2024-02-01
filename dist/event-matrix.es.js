var G = function(e, t) {
  return G = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(i, n) {
    i.__proto__ = n;
  } || function(i, n) {
    for (var r in n)
      Object.prototype.hasOwnProperty.call(n, r) && (i[r] = n[r]);
  }, G(e, t);
};
function K(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  G(e, t);
  function i() {
    this.constructor = e;
  }
  e.prototype = t === null ? Object.create(t) : (i.prototype = t.prototype, new i());
}
function S(e, t, i) {
  if (i || arguments.length === 2)
    for (var n = 0, r = t.length, o; n < r; n++)
      (o || !(n in t)) && (o || (o = Array.prototype.slice.call(t, 0, n)), o[n] = t[n]);
  return e.concat(o || Array.prototype.slice.call(t));
}
class P extends Map {
  constructor(t, i = ut) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: i } }), t != null)
      for (const [n, r] of t)
        this.set(n, r);
  }
  get(t) {
    return super.get(F(this, t));
  }
  has(t) {
    return super.has(F(this, t));
  }
  set(t, i) {
    return super.set(lt(this, t), i);
  }
  delete(t) {
    return super.delete(ct(this, t));
  }
}
function F({ _intern: e, _key: t }, i) {
  const n = t(i);
  return e.has(n) ? e.get(n) : i;
}
function lt({ _intern: e, _key: t }, i) {
  const n = t(i);
  return e.has(n) ? e.get(n) : (e.set(n, i), i);
}
function ct({ _intern: e, _key: t }, i) {
  const n = t(i);
  return e.has(n) && (i = e.get(n), e.delete(n)), i;
}
function ut(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
function b(e, t, i) {
  e = +e, t = +t, i = (r = arguments.length) < 2 ? (t = e, e = 0, 1) : r < 3 ? 1 : +i;
  for (var n = -1, r = Math.max(0, Math.ceil((t - e) / i)) | 0, o = new Array(r); ++n < r; )
    o[n] = e + n * i;
  return o;
}
function X(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
const z = Symbol("implicit");
function Y() {
  var e = new P(), t = [], i = [], n = z;
  function r(o) {
    let s = e.get(o);
    if (s === void 0) {
      if (n !== z)
        return n;
      e.set(o, s = t.push(o) - 1);
    }
    return i[s % i.length];
  }
  return r.domain = function(o) {
    if (!arguments.length)
      return t.slice();
    t = [], e = new P();
    for (const s of o)
      e.has(s) || e.set(s, t.push(s) - 1);
    return r;
  }, r.range = function(o) {
    return arguments.length ? (i = Array.from(o), r) : i.slice();
  }, r.unknown = function(o) {
    return arguments.length ? (n = o, r) : n;
  }, r.copy = function() {
    return Y(t, i).unknown(n);
  }, X.apply(r, arguments), r;
}
function L() {
  var e = Y().unknown(void 0), t = e.domain, i = e.range, n = 0, r = 1, o, s, a = !1, h = 0, c = 0, u = 0.5;
  delete e.unknown;
  function f() {
    var d = t().length, v = r < n, p = v ? r : n, x = v ? n : r;
    o = (x - p) / Math.max(1, d - h + c * 2), a && (o = Math.floor(o)), p += (x - p - o * (d - h)) * u, s = o * (1 - h), a && (p = Math.round(p), s = Math.round(s));
    var g = b(d).map(function(E) {
      return p + o * E;
    });
    return i(v ? g.reverse() : g);
  }
  return e.domain = function(d) {
    return arguments.length ? (t(d), f()) : t();
  }, e.range = function(d) {
    return arguments.length ? ([n, r] = d, n = +n, r = +r, f()) : [n, r];
  }, e.rangeRound = function(d) {
    return [n, r] = d, n = +n, r = +r, a = !0, f();
  }, e.bandwidth = function() {
    return s;
  }, e.step = function() {
    return o;
  }, e.round = function(d) {
    return arguments.length ? (a = !!d, f()) : a;
  }, e.padding = function(d) {
    return arguments.length ? (h = Math.min(1, c = +d), f()) : h;
  }, e.paddingInner = function(d) {
    return arguments.length ? (h = Math.min(1, d), f()) : h;
  }, e.paddingOuter = function(d) {
    return arguments.length ? (c = +d, f()) : c;
  }, e.align = function(d) {
    return arguments.length ? (u = Math.max(0, Math.min(1, d)), f()) : u;
  }, e.copy = function() {
    return L(t(), [n, r]).round(a).paddingInner(h).paddingOuter(c).align(u);
  }, X.apply(f(), arguments);
}
var M = "http://www.w3.org/1999/xhtml";
const V = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: M,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function q(e) {
  var t = e += "", i = t.indexOf(":");
  return i >= 0 && (t = e.slice(0, i)) !== "xmlns" && (e = e.slice(i + 1)), V.hasOwnProperty(t) ? { space: V[t], local: e } : e;
}
function ft(e) {
  return function() {
    var t = this.ownerDocument, i = this.namespaceURI;
    return i === M && t.documentElement.namespaceURI === M ? t.createElement(e) : t.createElementNS(i, e);
  };
}
function dt(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Z(e) {
  var t = q(e);
  return (t.local ? dt : ft)(t);
}
function pt() {
}
function J(e) {
  return e == null ? pt : function() {
    return this.querySelector(e);
  };
}
function gt(e) {
  typeof e != "function" && (e = J(e));
  for (var t = this._groups, i = t.length, n = new Array(i), r = 0; r < i; ++r)
    for (var o = t[r], s = o.length, a = n[r] = new Array(s), h, c, u = 0; u < s; ++u)
      (h = o[u]) && (c = e.call(h, h.__data__, u, o)) && ("__data__" in h && (c.__data__ = h.__data__), a[u] = c);
  return new I(n, this._parents);
}
function Q(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function mt() {
  return [];
}
function vt(e) {
  return e == null ? mt : function() {
    return this.querySelectorAll(e);
  };
}
function yt(e) {
  return function() {
    return Q(e.apply(this, arguments));
  };
}
function _t(e) {
  typeof e == "function" ? e = yt(e) : e = vt(e);
  for (var t = this._groups, i = t.length, n = [], r = [], o = 0; o < i; ++o)
    for (var s = t[o], a = s.length, h, c = 0; c < a; ++c)
      (h = s[c]) && (n.push(e.call(h, h.__data__, c, s)), r.push(h));
  return new I(n, r);
}
function wt(e) {
  return function() {
    return this.matches(e);
  };
}
function $(e) {
  return function(t) {
    return t.matches(e);
  };
}
var xt = Array.prototype.find;
function Rt(e) {
  return function() {
    return xt.call(this.children, e);
  };
}
function It() {
  return this.firstElementChild;
}
function Ct(e) {
  return this.select(e == null ? It : Rt(typeof e == "function" ? e : $(e)));
}
var Et = Array.prototype.filter;
function Dt() {
  return Array.from(this.children);
}
function St(e) {
  return function() {
    return Et.call(this.children, e);
  };
}
function Ht(e) {
  return this.selectAll(e == null ? Dt : St(typeof e == "function" ? e : $(e)));
}
function At(e) {
  typeof e != "function" && (e = wt(e));
  for (var t = this._groups, i = t.length, n = new Array(i), r = 0; r < i; ++r)
    for (var o = t[r], s = o.length, a = n[r] = [], h, c = 0; c < s; ++c)
      (h = o[c]) && e.call(h, h.__data__, c, o) && a.push(h);
  return new I(n, this._parents);
}
function j(e) {
  return new Array(e.length);
}
function Ot() {
  return new I(this._enter || this._groups.map(j), this._parents);
}
function N(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
N.prototype = {
  constructor: N,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Tt(e) {
  return function() {
    return e;
  };
}
function bt(e, t, i, n, r, o) {
  for (var s = 0, a, h = t.length, c = o.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = o[s], n[s] = a) : i[s] = new N(e, o[s]);
  for (; s < h; ++s)
    (a = t[s]) && (r[s] = a);
}
function Lt(e, t, i, n, r, o, s) {
  var a, h, c = /* @__PURE__ */ new Map(), u = t.length, f = o.length, d = new Array(u), v;
  for (a = 0; a < u; ++a)
    (h = t[a]) && (d[a] = v = s.call(h, h.__data__, a, t) + "", c.has(v) ? r[a] = h : c.set(v, h));
  for (a = 0; a < f; ++a)
    v = s.call(e, o[a], a, o) + "", (h = c.get(v)) ? (n[a] = h, h.__data__ = o[a], c.delete(v)) : i[a] = new N(e, o[a]);
  for (a = 0; a < u; ++a)
    (h = t[a]) && c.get(d[a]) === h && (r[a] = h);
}
function Nt(e) {
  return e.__data__;
}
function kt(e, t) {
  if (!arguments.length)
    return Array.from(this, Nt);
  var i = t ? Lt : bt, n = this._parents, r = this._groups;
  typeof e != "function" && (e = Tt(e));
  for (var o = r.length, s = new Array(o), a = new Array(o), h = new Array(o), c = 0; c < o; ++c) {
    var u = n[c], f = r[c], d = f.length, v = Gt(e.call(u, u && u.__data__, c, n)), p = v.length, x = a[c] = new Array(p), g = s[c] = new Array(p), E = h[c] = new Array(d);
    i(u, f, x, g, E, v, t);
    for (var C = 0, y = 0, T, H; C < p; ++C)
      if (T = x[C]) {
        for (C >= y && (y = C + 1); !(H = g[y]) && ++y < p; )
          ;
        T._next = H || null;
      }
  }
  return s = new I(s, n), s._enter = a, s._exit = h, s;
}
function Gt(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Mt() {
  return new I(this._exit || this._groups.map(j), this._parents);
}
function Bt(e, t, i) {
  var n = this.enter(), r = this, o = this.exit();
  return typeof e == "function" ? (n = e(n), n && (n = n.selection())) : n = n.append(e + ""), t != null && (r = t(r), r && (r = r.selection())), i == null ? o.remove() : i(o), n && r ? n.merge(r).order() : r;
}
function Pt(e) {
  for (var t = e.selection ? e.selection() : e, i = this._groups, n = t._groups, r = i.length, o = n.length, s = Math.min(r, o), a = new Array(r), h = 0; h < s; ++h)
    for (var c = i[h], u = n[h], f = c.length, d = a[h] = new Array(f), v, p = 0; p < f; ++p)
      (v = c[p] || u[p]) && (d[p] = v);
  for (; h < r; ++h)
    a[h] = i[h];
  return new I(a, this._parents);
}
function Ft() {
  for (var e = this._groups, t = -1, i = e.length; ++t < i; )
    for (var n = e[t], r = n.length - 1, o = n[r], s; --r >= 0; )
      (s = n[r]) && (o && s.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(s, o), o = s);
  return this;
}
function zt(e) {
  e || (e = Vt);
  function t(f, d) {
    return f && d ? e(f.__data__, d.__data__) : !f - !d;
  }
  for (var i = this._groups, n = i.length, r = new Array(n), o = 0; o < n; ++o) {
    for (var s = i[o], a = s.length, h = r[o] = new Array(a), c, u = 0; u < a; ++u)
      (c = s[u]) && (h[u] = c);
    h.sort(t);
  }
  return new I(r, this._parents).order();
}
function Vt(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Wt() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Ut() {
  return Array.from(this);
}
function Kt() {
  for (var e = this._groups, t = 0, i = e.length; t < i; ++t)
    for (var n = e[t], r = 0, o = n.length; r < o; ++r) {
      var s = n[r];
      if (s)
        return s;
    }
  return null;
}
function Xt() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function Yt() {
  return !this.node();
}
function qt(e) {
  for (var t = this._groups, i = 0, n = t.length; i < n; ++i)
    for (var r = t[i], o = 0, s = r.length, a; o < s; ++o)
      (a = r[o]) && e.call(a, a.__data__, o, r);
  return this;
}
function Zt(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Jt(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Qt(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function $t(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function jt(e, t) {
  return function() {
    var i = t.apply(this, arguments);
    i == null ? this.removeAttribute(e) : this.setAttribute(e, i);
  };
}
function te(e, t) {
  return function() {
    var i = t.apply(this, arguments);
    i == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, i);
  };
}
function ee(e, t) {
  var i = q(e);
  if (arguments.length < 2) {
    var n = this.node();
    return i.local ? n.getAttributeNS(i.space, i.local) : n.getAttribute(i);
  }
  return this.each((t == null ? i.local ? Jt : Zt : typeof t == "function" ? i.local ? te : jt : i.local ? $t : Qt)(i, t));
}
function tt(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function ie(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function ne(e, t, i) {
  return function() {
    this.style.setProperty(e, t, i);
  };
}
function re(e, t, i) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.style.removeProperty(e) : this.style.setProperty(e, n, i);
  };
}
function oe(e, t, i) {
  return arguments.length > 1 ? this.each((t == null ? ie : typeof t == "function" ? re : ne)(e, t, i ?? "")) : se(this.node(), e);
}
function se(e, t) {
  return e.style.getPropertyValue(t) || tt(e).getComputedStyle(e, null).getPropertyValue(t);
}
function ae(e) {
  return function() {
    delete this[e];
  };
}
function he(e, t) {
  return function() {
    this[e] = t;
  };
}
function le(e, t) {
  return function() {
    var i = t.apply(this, arguments);
    i == null ? delete this[e] : this[e] = i;
  };
}
function ce(e, t) {
  return arguments.length > 1 ? this.each((t == null ? ae : typeof t == "function" ? le : he)(e, t)) : this.node()[e];
}
function et(e) {
  return e.trim().split(/^|\s+/);
}
function B(e) {
  return e.classList || new it(e);
}
function it(e) {
  this._node = e, this._names = et(e.getAttribute("class") || "");
}
it.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function nt(e, t) {
  for (var i = B(e), n = -1, r = t.length; ++n < r; )
    i.add(t[n]);
}
function rt(e, t) {
  for (var i = B(e), n = -1, r = t.length; ++n < r; )
    i.remove(t[n]);
}
function ue(e) {
  return function() {
    nt(this, e);
  };
}
function fe(e) {
  return function() {
    rt(this, e);
  };
}
function de(e, t) {
  return function() {
    (t.apply(this, arguments) ? nt : rt)(this, e);
  };
}
function pe(e, t) {
  var i = et(e + "");
  if (arguments.length < 2) {
    for (var n = B(this.node()), r = -1, o = i.length; ++r < o; )
      if (!n.contains(i[r]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? de : t ? ue : fe)(i, t));
}
function ge() {
  this.textContent = "";
}
function me(e) {
  return function() {
    this.textContent = e;
  };
}
function ve(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function ye(e) {
  return arguments.length ? this.each(e == null ? ge : (typeof e == "function" ? ve : me)(e)) : this.node().textContent;
}
function _e() {
  this.innerHTML = "";
}
function we(e) {
  return function() {
    this.innerHTML = e;
  };
}
function xe(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Re(e) {
  return arguments.length ? this.each(e == null ? _e : (typeof e == "function" ? xe : we)(e)) : this.node().innerHTML;
}
function Ie() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Ce() {
  return this.each(Ie);
}
function Ee() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function De() {
  return this.each(Ee);
}
function Se(e) {
  var t = typeof e == "function" ? e : Z(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function He() {
  return null;
}
function Ae(e, t) {
  var i = typeof e == "function" ? e : Z(e), n = t == null ? He : typeof t == "function" ? t : J(t);
  return this.select(function() {
    return this.insertBefore(i.apply(this, arguments), n.apply(this, arguments) || null);
  });
}
function Oe() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Te() {
  return this.each(Oe);
}
function be() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Le() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Ne(e) {
  return this.select(e ? Le : be);
}
function ke(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Ge(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Me(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var i = "", n = t.indexOf(".");
    return n >= 0 && (i = t.slice(n + 1), t = t.slice(0, n)), { type: t, name: i };
  });
}
function Be(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var i = 0, n = -1, r = t.length, o; i < r; ++i)
        o = t[i], (!e.type || o.type === e.type) && o.name === e.name ? this.removeEventListener(o.type, o.listener, o.options) : t[++n] = o;
      ++n ? t.length = n : delete this.__on;
    }
  };
}
function Pe(e, t, i) {
  return function() {
    var n = this.__on, r, o = Ge(t);
    if (n) {
      for (var s = 0, a = n.length; s < a; ++s)
        if ((r = n[s]).type === e.type && r.name === e.name) {
          this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, r.listener = o, r.options = i), r.value = t;
          return;
        }
    }
    this.addEventListener(e.type, o, i), r = { type: e.type, name: e.name, value: t, listener: o, options: i }, n ? n.push(r) : this.__on = [r];
  };
}
function Fe(e, t, i) {
  var n = Me(e + ""), r, o = n.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var h = 0, c = a.length, u; h < c; ++h)
        for (r = 0, u = a[h]; r < o; ++r)
          if ((s = n[r]).type === u.type && s.name === u.name)
            return u.value;
    }
    return;
  }
  for (a = t ? Pe : Be, r = 0; r < o; ++r)
    this.each(a(n[r], t, i));
  return this;
}
function ot(e, t, i) {
  var n = tt(e), r = n.CustomEvent;
  typeof r == "function" ? r = new r(t, i) : (r = n.document.createEvent("Event"), i ? (r.initEvent(t, i.bubbles, i.cancelable), r.detail = i.detail) : r.initEvent(t, !1, !1)), e.dispatchEvent(r);
}
function ze(e, t) {
  return function() {
    return ot(this, e, t);
  };
}
function Ve(e, t) {
  return function() {
    return ot(this, e, t.apply(this, arguments));
  };
}
function We(e, t) {
  return this.each((typeof t == "function" ? Ve : ze)(e, t));
}
function* Ue() {
  for (var e = this._groups, t = 0, i = e.length; t < i; ++t)
    for (var n = e[t], r = 0, o = n.length, s; r < o; ++r)
      (s = n[r]) && (yield s);
}
var st = [null];
function I(e, t) {
  this._groups = e, this._parents = t;
}
function Ke() {
  return this;
}
I.prototype = {
  constructor: I,
  select: gt,
  selectAll: _t,
  selectChild: Ct,
  selectChildren: Ht,
  filter: At,
  data: kt,
  enter: Ot,
  exit: Mt,
  join: Bt,
  merge: Pt,
  selection: Ke,
  order: Ft,
  sort: zt,
  call: Wt,
  nodes: Ut,
  node: Kt,
  size: Xt,
  empty: Yt,
  each: qt,
  attr: ee,
  style: oe,
  property: ce,
  classed: pe,
  text: ye,
  html: Re,
  raise: Ce,
  lower: De,
  append: Se,
  insert: Ae,
  remove: Te,
  clone: Ne,
  datum: ke,
  on: Fe,
  dispatch: We,
  [Symbol.iterator]: Ue
};
function A(e) {
  return typeof e == "string" ? new I([[document.querySelector(e)]], [document.documentElement]) : new I([[e]], st);
}
function Xe(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function k(e, t) {
  if (e = Xe(e), t === void 0 && (t = e.currentTarget), t) {
    var i = t.ownerSVGElement || t;
    if (i.createSVGPoint) {
      var n = i.createSVGPoint();
      return n.x = e.clientX, n.y = e.clientY, n = n.matrixTransform(t.getScreenCTM().inverse()), [n.x, n.y];
    }
    if (t.getBoundingClientRect) {
      var r = t.getBoundingClientRect();
      return [e.clientX - r.left - t.clientLeft, e.clientY - r.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
function O(e) {
  return typeof e == "string" ? new I([document.querySelectorAll(e)], [document.documentElement]) : new I([Q(e)], st);
}
function Ye(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var at = { exports: {} };
(function(e) {
  var t = Object.prototype.hasOwnProperty, i = "~";
  function n() {
  }
  Object.create && (n.prototype = /* @__PURE__ */ Object.create(null), new n().__proto__ || (i = !1));
  function r(h, c, u) {
    this.fn = h, this.context = c, this.once = u || !1;
  }
  function o(h, c, u, f, d) {
    if (typeof u != "function")
      throw new TypeError("The listener must be a function");
    var v = new r(u, f || h, d), p = i ? i + c : c;
    return h._events[p] ? h._events[p].fn ? h._events[p] = [h._events[p], v] : h._events[p].push(v) : (h._events[p] = v, h._eventsCount++), h;
  }
  function s(h, c) {
    --h._eventsCount === 0 ? h._events = new n() : delete h._events[c];
  }
  function a() {
    this._events = new n(), this._eventsCount = 0;
  }
  a.prototype.eventNames = function() {
    var c = [], u, f;
    if (this._eventsCount === 0)
      return c;
    for (f in u = this._events)
      t.call(u, f) && c.push(i ? f.slice(1) : f);
    return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(u)) : c;
  }, a.prototype.listeners = function(c) {
    var u = i ? i + c : c, f = this._events[u];
    if (!f)
      return [];
    if (f.fn)
      return [f.fn];
    for (var d = 0, v = f.length, p = new Array(v); d < v; d++)
      p[d] = f[d].fn;
    return p;
  }, a.prototype.listenerCount = function(c) {
    var u = i ? i + c : c, f = this._events[u];
    return f ? f.fn ? 1 : f.length : 0;
  }, a.prototype.emit = function(c, u, f, d, v, p) {
    var x = i ? i + c : c;
    if (!this._events[x])
      return !1;
    var g = this._events[x], E = arguments.length, C, y;
    if (g.fn) {
      switch (g.once && this.removeListener(c, g.fn, void 0, !0), E) {
        case 1:
          return g.fn.call(g.context), !0;
        case 2:
          return g.fn.call(g.context, u), !0;
        case 3:
          return g.fn.call(g.context, u, f), !0;
        case 4:
          return g.fn.call(g.context, u, f, d), !0;
        case 5:
          return g.fn.call(g.context, u, f, d, v), !0;
        case 6:
          return g.fn.call(g.context, u, f, d, v, p), !0;
      }
      for (y = 1, C = new Array(E - 1); y < E; y++)
        C[y - 1] = arguments[y];
      g.fn.apply(g.context, C);
    } else {
      var T = g.length, H;
      for (y = 0; y < T; y++)
        switch (g[y].once && this.removeListener(c, g[y].fn, void 0, !0), E) {
          case 1:
            g[y].fn.call(g[y].context);
            break;
          case 2:
            g[y].fn.call(g[y].context, u);
            break;
          case 3:
            g[y].fn.call(g[y].context, u, f);
            break;
          case 4:
            g[y].fn.call(g[y].context, u, f, d);
            break;
          default:
            if (!C)
              for (H = 1, C = new Array(E - 1); H < E; H++)
                C[H - 1] = arguments[H];
            g[y].fn.apply(g[y].context, C);
        }
    }
    return !0;
  }, a.prototype.on = function(c, u, f) {
    return o(this, c, u, f, !1);
  }, a.prototype.once = function(c, u, f) {
    return o(this, c, u, f, !0);
  }, a.prototype.removeListener = function(c, u, f, d) {
    var v = i ? i + c : c;
    if (!this._events[v])
      return this;
    if (!u)
      return s(this, v), this;
    var p = this._events[v];
    if (p.fn)
      p.fn === u && (!d || p.once) && (!f || p.context === f) && s(this, v);
    else {
      for (var x = 0, g = [], E = p.length; x < E; x++)
        (p[x].fn !== u || d && !p[x].once || f && p[x].context !== f) && g.push(p[x]);
      g.length ? this._events[v] = g.length === 1 ? g[0] : g : s(this, v);
    }
    return this;
  }, a.prototype.removeAllListeners = function(c) {
    var u;
    return c ? (u = i ? i + c : c, this._events[u] && s(this, u)) : (this._events = new n(), this._eventsCount = 0), this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = i, a.EventEmitter = a, e.exports = a;
})(at);
var qe = at.exports;
const ht = /* @__PURE__ */ Ye(qe);
var _;
(function(e) {
  e.GRID_CELL_HOVER = "grid:cell:hover", e.GRID_CELL_CLICK = "grid:cell:click", e.GRID_OUT = "grid:out", e.GRID_LABEL_HOVER = "grid:label:hover", e.GRID_LABEL_CLICK = "grid:label:click", e.GRID_CROSSHAIR_HOVER = "grid:crosshair:hover", e.GRID_CROSSHAIR_OUT = "grid:crosshair:out", e.GRID_SELECTION_STARTED = "grid:selection:started", e.GRID_SELECTION_FINISHED = "grid:selection:finished", e.HISTOGRAM_HOVER = "histogram:hover", e.HISTOGRAM_CLICK = "histogram:click", e.HISTOGRAM_OUT = "histogram:out", e.DESCRIPTION_LEGEND_HOVER = "description:legend:hover", e.DESCRIPTION_LEGEND_OUT = "description:legend:out", e.DESCRIPTION_BUTTONS_ADD_CLICK = "description:buttons:add:click", e.DESCRIPTION_FIELD_CLICK = "description:cell:click", e.DESCRIPTION_CELL_HOVER = "description:cell:hover", e.DESCRIPTION_CELL_OUT = "description:cell:out";
})(_ || (_ = {}));
var D;
(function(e) {
  e.INNER_RESIZE = "inner:resize", e.INNER_UPDATE = "inner:update";
})(D || (D = {}));
var R;
(function(e) {
  e.RENDER_ALL_START = "render:all:start", e.RENDER_ALL_END = "render:all:end", e.RENDER_GRID_START = "render:grid:start", e.RENDER_GRID_END = "render:grid:end", e.RENDER_X_HISTOGRAM_START = "render:x-histogram:start", e.RENDER_X_HISTOGRAM_END = "render:x-histogram:end", e.RENDER_Y_HISTOGRAM_START = "render:y-histogram:start", e.RENDER_Y_HISTOGRAM_END = "render:y-histogram:end", e.RENDER_X_DESCRIPTION_BLOCK_START = "render:x-description-block:start", e.RENDER_X_DESCRIPTION_BLOCK_END = "render:x-description-block:end", e.RENDER_Y_DESCRIPTION_BLOCK_START = "render:y-description-block:start", e.RENDER_Y_DESCRIPTION_BLOCK_END = "render:y-description-block:end";
})(R || (R = {}));
var Ze = (
  /** @class */
  function(e) {
    K(t, e);
    function t() {
      return e.call(this) || this;
    }
    return t.getInstance = function() {
      return this.instance === null && (this.instance = new this()), this.instance;
    }, t.prototype.exposeEvents = function() {
      return Object.values(_);
    }, t.instance = null, t;
  }(ht)
), m = Ze.getInstance(), w;
(function(e) {
  e.Rows = "rows", e.Columns = "columns", e.Entries = "entries";
})(w || (w = {}));
var Je = (
  /** @class */
  function() {
    function e() {
      var t;
      this.minCellHeight = 10, this.layer = null, this.prefix = "og-", this.lookupTable = {}, this.rowsOriginal = [], this.rows = [], this.columnsOriginal = [], this.columns = [], this.entriesOriginal = [], this.entries = [], this.customFunctions = (t = {}, t[w.Rows] = function(i) {
        return { color: "black", opacity: 1 };
      }, t[w.Columns] = function(i) {
        return { color: "black", opacity: 1 };
      }, t[w.Entries] = function(i) {
        return { color: "black", opacity: 1 };
      }, t), this.rowsPrevIndex = null, this.rowsOrder = null, this.columnsPrevIndex = null, this.columnsOrder = null;
    }
    return e.prototype.setLookupTable = function(t) {
      this.lookupTable = t;
    }, e.prototype.setOptions = function(t) {
      var i = t.minCellHeight, n = t.prefix, r = n === void 0 ? this.prefix : n, o = t.rows, s = o === void 0 ? this.rowsOriginal : o, a = t.columns, h = a === void 0 ? this.columnsOriginal : a, c = t.entries, u = c === void 0 ? this.entries : c, f = t.columnsAppearanceFunc, d = t.rowsAppearanceFunc, v = t.cellAppearanceFunc;
      this.minCellHeight = i ?? 10, this.prefix = r ?? "og-", this.rowsOriginal = S([], s, !0), this.rows = S([], s, !0), this.columnsOriginal = S([], h, !0), this.columns = S([], h, !0), this.entriesOriginal = S([], u, !0), this.entries = S([], u, !0), d !== void 0 && (this.customFunctions[w.Rows] = d), f !== void 0 && (this.customFunctions[w.Columns] = f), v !== void 0 && (this.customFunctions[w.Entries] = v);
    }, e.prototype.reset = function() {
      var t = this;
      this.rows = S([], this.rowsOriginal, !0), this.columns = S([], this.columnsOriginal, !0), this.entries = S([], this.entriesOriginal.filter(function(i) {
        return t.layer === null ? !0 : i.layer === t.layer;
      }), !0), this.rowsOrder = null, this.columnsOrder = null, this.rowsPrevIndex = null, this.columnsPrevIndex = null;
    }, e.prototype.setLayer = function(t) {
      var i = this;
      this.layer = t, this.entries = S([], this.entriesOriginal.filter(function(n) {
        return i.layer === null ? !0 : n.layer === i.layer;
      }), !0);
    }, e.getInstance = function() {
      return this.instance || (this.instance = new this()), this.instance;
    }, e.prototype.toggleOrder = function(t) {
      return t === "ASC" ? "DESC" : "ASC";
    }, e.prototype.sortItems = function(t, i, n, r) {
      t.sort(function(o, s) {
        var a, h, c = (a = n === null ? o[i] : o[i][n]) !== null && a !== void 0 ? a : "0", u = (h = n === null ? s[i] : s[i][n]) !== null && h !== void 0 ? h : "0";
        return c === u ? 0 : r === "ASC" ? c.toString().localeCompare(u) : u.toString().localeCompare(c);
      });
    }, e.prototype.sortRows = function(t, i) {
      t === void 0 && (t = "id"), i === void 0 && (i = null), (i === null || i === this.rowsPrevIndex) && (this.rowsOrder = this.toggleOrder(this.rowsOrder)), this.rowsPrevIndex = i, this.sortItems(this.rows, t, i, this.rowsOrder);
    }, e.prototype.sortColumns = function(t, i) {
      t === void 0 && (t = "id"), i === void 0 && (i = null), (i === null || i === this.columnsPrevIndex) && (this.columnsOrder = this.toggleOrder(this.columnsOrder)), this.columnsPrevIndex = i, this.sortItems(this.columns, t, i, this.columnsOrder);
    }, e.instance = null, e;
  }()
), l = Je.getInstance(), Qe = (
  /** @class */
  function() {
    function e(t, i, n, r) {
      var o;
      this.rendered = !1, this.fields = [], this.collapsedFields = [], this.fieldsData = [], this.params = t, this.expandable = t.expandable, this.name = n, this.width = t.width, this.nullSentinel = t.nullSentinel || -777, this.rotated = r, this.drawGridLines = (o = t.grid) !== null && o !== void 0 ? o : !1, this.domain = t.domain, this.blockType = i, this.wrapper = A(t.wrapper || "body");
    }
    return e.prototype.setTransform = function(t, i) {
      this.container.attr("transform", "translate(".concat(t, ",").concat(i, ")"));
    }, e.prototype.addDescriptionFields = function(t) {
      for (var i = this, n = 0, r = t; n < r.length; n++) {
        var o = r[n];
        !this.rendered && o.collapsed && this.expandable ? this.collapsedFields.push(o) : this.fields.push(o);
      }
      this.collapsedFields = this.collapsedFields.filter(function(s) {
        return !i.fields.some(function(a) {
          return s.fieldName === a.fieldName;
        });
      }), this.rendered && (this.refreshData(), m.emit(D.INNER_RESIZE));
    }, e.prototype.removeField = function(t) {
      var i = this.fields.splice(t, 1);
      this.collapsedFields = this.collapsedFields.concat(i), this.refreshData(), m.emit(D.INNER_RESIZE);
    }, e.prototype.refreshData = function() {
      var t;
      this.fieldsData = [];
      for (var i = 0; i < this.domain.length; i++)
        for (var n = this.domain[i], r = 0, o = this.fields; r < o.length; r++) {
          var s = o[r], a = n[s.fieldName], h = a === this.nullSentinel;
          this.fieldsData.push({
            id: n.id,
            displayId: (t = n.displayId) !== null && t !== void 0 ? t : this.rotated ? n.symbol : n.id,
            domainIndex: i,
            value: a,
            displayValue: h ? "Not Verified" : a,
            notNullSentinel: !h,
            displayName: s.name,
            fieldName: s.fieldName,
            type: s.type
          });
        }
    }, e.prototype.getTotalHeight = function() {
      var t = this.getFieldDimensions(), i = this.getFieldsGroupDimensions().height;
      return i + (this.collapsedFields.length ? t.height : 0);
    }, e.prototype.init = function(t) {
      this.container = t, this.label = this.container.append("text").attr("x", -6).attr("y", -11).attr("dy", ".32em").attr("text-anchor", "end").attr("class", "".concat(l.prefix, "track-group-label")).text(this.name), this.legendObject = this.container.append("svg:foreignObject").attr("width", 20).attr("height", 20), this.legend = this.legendObject.attr("x", 0).attr("y", -22).append("xhtml:div").html(this.params.label);
      var i = this.getFieldsGroupDimensions(), n = i.height, r = i.width;
      this.background = this.container.append("rect").attr("class", "".concat(l.prefix, "background")).attr("width", r).attr("height", n), this.refreshData();
    }, e.prototype.render = function() {
      var t = this;
      this.rendered = !0, this.computeCoordinates(), this.renderData(), this.legend.on("mouseover", function(i) {
        m.emit(_.DESCRIPTION_LEGEND_HOVER, {
          target: i.target,
          group: t.name
        });
      }).on("mouseout", function() {
        m.emit(_.DESCRIPTION_LEGEND_OUT);
      });
    }, e.prototype.getFieldsGroupDimensions = function() {
      return {
        width: this.width,
        height: this.params.cellHeight * this.fields.length,
        length: this.fields.length
      };
    }, e.prototype.getFieldDimensions = function() {
      return {
        width: this.domain.length > 0 ? this.width / this.domain.length : 0,
        height: this.params.cellHeight
      };
    }, e.prototype.update = function(t) {
      var i = this;
      this.domain = t;
      for (var n = {}, r = 0; r < t.length; r += 1)
        n[t[r].id] = r;
      for (var o = [], s = 0, a = this.fieldsData; s < a.length; s++) {
        var h = a[s], c = n[h.id];
        (c || c === 0) && (h.domainIndex = c, o.push(h));
      }
      this.fieldsData = o, this.computeCoordinates();
      var u = this.getFieldDimensions().width;
      this.container.selectAll(".".concat(l.prefix, "track-data")).data(this.fieldsData).attr("x", function(f) {
        var d, v = f.domainIndex, p = i.domain[v];
        return (d = i.rotated ? p.y : p.x) !== null && d !== void 0 ? d : 0;
      }).attr("data-track-data-index", function(f, d) {
        return d;
      }).attr("width", u);
    }, e.prototype.resize = function(t) {
      var i = this.getFieldsGroupDimensions().height;
      this.width = t, this.background.attr("class", "background").attr("width", t).attr("height", i), this.computeCoordinates(), this.renderData();
    }, e.prototype.computeCoordinates = function() {
      var t = this, i = this.getFieldsGroupDimensions(), n = i.height, r = i.length, o = this.getFieldDimensions().height;
      this.y = L().domain(b(this.fields.length).map(String)).range([0, n]), this.column && this.column.remove(), this.drawGridLines && (this.column = this.container.selectAll(".".concat(l.prefix, "column")).data(this.domain).enter().append("line").attr("class", "".concat(l.prefix, "column")).attr("column", function(h) {
        return h.id;
      }).attr("transform", function(h) {
        return "translate(".concat(t.rotated ? h.y : h.x, "),rotate(-90)");
      }).style("pointer-events", "none").attr("x1", -n)), this.row !== void 0 && this.row.remove(), this.row = this.container.selectAll(".".concat(l.prefix, "row")).data(this.fields).enter().append("g").attr("class", "".concat(l.prefix, "row")).attr("transform", function(h, c) {
        return "translate(0,".concat(t.y(String(c)), ")");
      }), this.drawGridLines && this.row.append("line").style("pointer-events", "none").attr("x2", this.width);
      var s = this.row.append("text");
      s.attr("class", "".concat(l.prefix, "track-label ").concat(l.prefix, "label-text-font")).attr("data-field", function(h) {
        return h.fieldName;
      }).on("click", function(h) {
        t.rotated ? l.sortRows(h.target.dataset.field) : l.sortColumns(h.target.dataset.field), m.emit(D.INNER_UPDATE, !1);
      }).attr("x", -6).attr("y", o / 2).attr("dy", ".32em").attr("text-anchor", "end").text(function(h) {
        return h.name;
      }), this.expandable && setTimeout(function() {
        var h = "".concat(l.prefix, "remove-track");
        t.container.selectAll(".".concat(h)).remove();
        var c = {};
        s.each(function(u) {
          c[u.name] = u.getComputedTextLength();
        }), t.row.append("text").attr("class", h).text("-").attr("y", o / 2).attr("dy", ".32em").on("click", function(u, f) {
          t.removeField(f);
        }).attr("x", function(u) {
          return -(c[u.name] + 12 + u.getComputedTextLength());
        });
      });
      var a = this.container.selectAll(".".concat(l.prefix, "add-track"));
      this.collapsedFields.length && this.expandable ? (a.empty() && (a = this.container.append("text").text("+").attr("class", "".concat(l.prefix, "add-track")).attr("x", -6).attr("dy", ".32em").attr("text-anchor", "end").on("click", function() {
        m.emit(_.DESCRIPTION_BUTTONS_ADD_CLICK, {
          hiddenTracks: t.collapsedFields.slice(),
          addTrack: t.addDescriptionFields.bind(t)
        });
      })), a.attr("y", o / 2 + (r * o + this.y((r - 1).toString())))) : a.remove();
    }, e.prototype.setGridLines = function(t) {
      this.drawGridLines !== t && (this.drawGridLines = t, this.computeCoordinates());
    }, e.prototype.renderData = function() {
      for (var t = this, i = {}, n = 0; n < this.fields.length; n++)
        i[this.fields[n].fieldName] = n.toString();
      this.container.on("click", function(c) {
        var u = c.target, f = t.fieldsData[u.dataset.trackDataIndex];
        f && m.emit(_.DESCRIPTION_FIELD_CLICK, {
          target: u,
          domainId: f.id,
          type: t.rotated ? w.Rows : w.Columns,
          field: f.fieldName
        });
      }).on("mouseover", function(c) {
        var u = c.target, f = t.fieldsData[u.dataset.trackDataIndex];
        f && m.emit(_.DESCRIPTION_CELL_HOVER, {
          target: u,
          domainId: f.id,
          type: t.rotated ? w.Rows : w.Columns,
          field: f.fieldName
        });
      }).on("mouseout", function() {
        m.emit(_.DESCRIPTION_CELL_OUT);
      });
      var r = this.getFieldDimensions(), o = r.height, s = r.width, a = this.container.selectAll(".".concat(l.prefix, "track-data")).data(this.fieldsData), h = this.blockType;
      a.enter().append("rect").attr("x", function(c) {
        var u, f = c.domainIndex, d = t.domain[f];
        return (u = t.rotated ? d.y : d.x) !== null && u !== void 0 ? u : 0;
      }).attr("y", function(c) {
        var u, f = c.fieldName;
        return (u = t.y(i[f])) !== null && u !== void 0 ? u : 0;
      }).each(function(c, u) {
        var f = A(this), d = l.customFunctions[h](c), v = d.color, p = d.opacity;
        f.attr("fill", v), f.attr("opacity", p), f.attr("width", s), f.attr("height", o), f.attr("data-track-data-index", u), f.attr("class", [
          "".concat(l.prefix, "track-data"),
          "".concat(l.prefix, "track-").concat(c.fieldName),
          "".concat(l.prefix, "track-").concat(c.value),
          "".concat(l.prefix).concat(c.id, "-cell")
        ].join(" "));
      }), a.exit().remove();
    }, e;
  }()
), W = (
  /** @class */
  function() {
    function e(t, i, n, r, o, s) {
      this.width = 0, this.height = 0, this.groupMap = {}, this.groups = [], this.parentHeight = 0, this.blockType = i, this.offset = s, this.params = t, this.svg = n, this.rotated = r || !1, this.domain = (this.rotated ? t.rows : t.columns) || [], this.width = (this.rotated ? t.parentHeight : t.width) || 500, this.cellHeight = t.height || 10, this.cellWidth = this.domain.length > 0 ? this.width / this.domain.length : 0, this.fields = o || [], this.drawGridLines = t.grid || !1, this.nullSentinel = t.nullSentinel || -777, this.parseGroups();
    }
    return e.prototype.getDimensions = function() {
      var t;
      return {
        padding: (t = this.params.padding) !== null && t !== void 0 ? t : 20,
        margin: this.params.margin || { top: 30, right: 15, bottom: 15, left: 80 }
      };
    }, e.prototype.isGroupExpandable = function(t) {
      var i, n;
      return (n = (i = this.params.expandableGroups) === null || i === void 0 ? void 0 : i.includes(t)) !== null && n !== void 0 ? n : !1;
    }, e.prototype.getDescriptionFieldsGroupParams = function(t) {
      return {
        cellHeight: this.cellHeight,
        width: this.width,
        grid: this.drawGridLines,
        nullSentinel: this.nullSentinel,
        domain: this.domain,
        label: this.params.label,
        expandable: t,
        wrapper: this.params.wrapper
      };
    }, e.prototype.parseGroups = function() {
      var t = this;
      this.fields.forEach(function(i) {
        var n = i.group;
        if (t.groupMap[n] === void 0) {
          var r = new Qe(t.getDescriptionFieldsGroupParams(t.isGroupExpandable(n)), t.blockType, n, t.rotated);
          t.groupMap[n] = r, t.groups.push(r);
        }
        t.groupMap[n].addDescriptionFields([i]);
      });
    }, e.prototype.init = function() {
      var t = this;
      this.container = this.svg.append("g");
      var i = this.rotated ? 16.5 : 0;
      this.height = 0;
      for (var n = this.getDimensions().padding, r = 0, o = this.groups; r < o.length; r++) {
        var s = o[r], a = this.container.append("g").attr("transform", "translate(0," + this.parentHeight + ")");
        s.init(a), this.height += s.getTotalHeight() + n;
      }
      var h = this.rotated ? -(this.offset + this.parentHeight) : n + this.offset;
      this.container.attr("width", this.width).attr("height", this.height).attr("class", "".concat(l.prefix, "track")).attr("transform", function() {
        return "".concat(t.rotated ? "rotate(90) " : "", "translate(0,").concat(h, ")");
      }), this.height += i;
    }, e.prototype.render = function() {
      for (var t = 0, i = this.groups; t < i.length; t++) {
        var n = i[t];
        n.render();
      }
    }, e.prototype.resize = function(t, i, n) {
      var r = this;
      this.offset = n || this.offset, this.width = this.rotated ? i : t, this.parentHeight = 0;
      for (var o = this.rotated ? 16.5 : 0, s = this.getDimensions().padding, a = 0, h = this.groups; a < h.length; a++) {
        var c = h[a];
        c.setTransform(0, this.parentHeight), c.resize(this.width), this.parentHeight += c.getTotalHeight() + s;
      }
      var u = this.rotated ? -(this.offset + this.parentHeight) : s + this.offset;
      this.container.attr("width", this.width).attr("height", this.parentHeight).attr("transform", function() {
        return "".concat(r.rotated ? "rotate(90) " : "", "translate(0,").concat(u, ")");
      }), this.parentHeight += o;
    }, e.prototype.update = function(t) {
      this.domain = t;
      for (var i = 0, n = this.groups; i < n.length; i++) {
        var r = n[i];
        r.update(t);
      }
    }, e.prototype.setGridLines = function(t) {
      for (var i = 0, n = this.groups; i < n.length; i++) {
        var r = n[i];
        r.setGridLines(t);
      }
    }, e;
  }()
), U = (
  /** @class */
  function() {
    function e(t, i, n) {
      var r, o;
      this.padding = 10, this.centerText = -10, this.histogramHeight = 80, this.topCount = 1, this.container = null, this.lineWidthOffset = ((r = t.histogramBorderPadding) === null || r === void 0 ? void 0 : r.left) || 10, this.lineHeightOffset = ((o = t.histogramBorderPadding) === null || o === void 0 ? void 0 : o.bottom) || 5, this.svg = i, this.rotated = n || !1, this.domain = this.rotated ? l.rows : l.columns, this.margin = t.margin || { top: 15, right: 15, bottom: 15, left: 80 }, this.width = t.width || 500, this.height = t.height || 500, this.histogramWidth = this.rotated ? this.height : this.width, this.numDomain = this.domain.length, this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length, this.totalHeight = this.histogramHeight + this.lineHeightOffset + this.padding, this.wrapper = A(t.wrapper || "body");
    }
    return e.prototype.getHistogramHeight = function() {
      return this.totalHeight;
    }, e.prototype.render = function() {
      var t = this, i = this.getLargestCount(this.domain);
      this.topCount = i, this.container = this.svg.append("g").attr("class", "".concat(l.prefix, "histogram")).attr("width", function() {
        return t.rotated ? t.height : t.width + t.margin.left + t.margin.right;
      }).attr("height", this.histogramHeight).style("margin-left", this.margin.left + "px").attr("transform", function() {
        return t.rotated ? "rotate(90)translate(0,-" + t.width + ")" : "";
      }), this.histogram = this.container.append("g").attr("transform", "translate(0,-" + (this.totalHeight + this.centerText) + ")"), this.renderAxis(i), this.histogram.on("mouseover", function(n) {
        var r = n.target, o = t.domain[r.dataset.domainIndex];
        o && m.emit(_.HISTOGRAM_HOVER, {
          target: r,
          domainId: o.id,
          type: t.rotated ? w.Rows : w.Columns
        });
      }).on("mouseout", function() {
        m.emit(_.HISTOGRAM_OUT);
      }).on("click", function(n) {
        var r = n.target, o = t.domain[r.dataset.domainIndex];
        o && (t.rotated ? l.sortColumns("countByRow", o.id) : l.sortRows("countByColumn", o.id), m.emit(D.INNER_UPDATE, !1), m.emit(_.HISTOGRAM_CLICK, {
          target: r,
          domainId: o.id,
          type: t.rotated ? w.Rows : w.Columns
        }));
      }), this.histogram.selectAll("rect").data(this.domain).enter().append("rect").attr("class", function(n) {
        return "".concat(l.prefix, "sortable-bar ").concat(l.prefix).concat(n.id, "-bar");
      }).attr("data-domain-index", function(n, r) {
        return r;
      }).attr("width", this.barWidth - (this.barWidth < 3 ? 0 : 1)).attr("height", function(n) {
        return t.histogramHeight * n.count / i;
      }).attr("x", function(n) {
        return t.rotated ? n.y : n.x;
      }).attr("y", function(n) {
        return t.histogramHeight - t.histogramHeight * n.count / i;
      }).attr("fill", "#1693C0");
    }, e.prototype.update = function(t) {
      var i = this;
      this.domain = t, this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length;
      var n = this.topCount || this.getLargestCount(this.domain);
      this.updateAxis(n), this.histogram.selectAll("rect").data(this.domain).attr("data-domain-index", function(r, o) {
        return o;
      }).attr("width", this.barWidth - (this.barWidth < 3 ? 0 : 1)).attr("height", function(r) {
        return i.histogramHeight * r.count / n;
      }).attr("y", function(r) {
        return i.histogramHeight - i.histogramHeight * r.count / n;
      }).attr("x", function(r) {
        return i.rotated ? r.y : r.x;
      });
    }, e.prototype.resize = function(t, i) {
      var n = this;
      this.container !== null && (this.width = t, this.height = i, this.histogramWidth = this.rotated ? this.height : this.width, this.container.attr("width", function() {
        return n.rotated ? n.height : n.width + n.margin.left + n.margin.right;
      }).attr("transform", function() {
        return n.rotated ? "rotate(90)translate(0,-" + n.width + ")" : "";
      }), this.histogram.attr("transform", "translate(0,-" + (this.totalHeight + this.centerText) + ")"), this.bottomAxis.attr("x2", this.histogramWidth + 10));
    }, e.prototype.renderAxis = function(t) {
      this.bottomAxis = this.histogram.append("line").attr("class", "".concat(l.prefix, "histogram-axis")), this.leftAxis = this.histogram.append("line").attr("class", "".concat(l.prefix, "histogram-axis")), this.topText = this.histogram.append("text").attr("class", "".concat(l.prefix, "label-text-font")).attr("dy", ".32em").attr("text-anchor", "end"), this.middleText = this.histogram.append("text").attr("class", "".concat(l.prefix, "label-text-font")).attr("dy", ".32em").attr("text-anchor", "end"), this.leftLabel = this.histogram.append("text").text("Mutation freq.").attr("class", "".concat(l.prefix, "label-text-font")).attr("text-anchor", "middle").attr("transform", "rotate(-90)").attr("x", "-40").attr("y", "-25"), this.updateAxis(t);
    }, e.prototype.clear = function() {
      var t;
      (t = this.histogram) === null || t === void 0 || t.remove();
    }, e.prototype.updateAxis = function(t) {
      this.bottomAxis.attr("y1", this.histogramHeight + this.lineHeightOffset).attr("y2", this.histogramHeight + this.lineHeightOffset).attr("x2", this.histogramWidth + this.lineWidthOffset).attr("transform", "translate(-" + this.lineHeightOffset + ",0)"), this.leftAxis.attr("y1", 0).attr("y2", this.histogramHeight + this.lineHeightOffset).attr("transform", "translate(-" + this.lineHeightOffset + ",0)"), this.topText.attr("x", this.centerText).text(t);
      var i = parseInt(String(t / 2)), n = this.histogramHeight - this.histogramHeight / (t / i);
      this.middleText.attr("x", this.centerText).attr("y", n).text(i), this.leftLabel.attr("x", -this.histogramHeight / 2).attr("y", -this.lineHeightOffset - this.padding);
    }, e.prototype.getLargestCount = function(t) {
      for (var i = 1, n = 0, r = t; n < r.length; n++) {
        var o = r[n];
        i = Math.max(i, o.count);
      }
      return i;
    }, e.prototype.destroy = function() {
      var t;
      this.histogram.remove(), (t = this.container) === null || t === void 0 || t.remove();
    }, e;
  }()
), $e = (
  /** @class */
  function() {
    function e(t, i, n) {
      var r, o;
      this.leftTextWidth = 80, this.width = 500, this.height = 500, this.inputWidth = 500, this.inputHeight = 500, this.margin = { top: 30, right: 100, bottom: 15, left: 80 }, this.heatMap = !1, this.drawGridLines = !1, this.crosshair = !1, this.heatMapColor = "#D33682", this.fullscreen = !1, this.params = t, this.x = i, this.y = n, this.loadParams(t), this.createRowMap(), this.init();
      var s = this.getDescriptionBlockParams(), a = this.getHistogramParams();
      this.horizontalHistogram = new U(a, this.container, !1), this.horizontalDescriptionBlock = new W(s, w.Columns, this.container, !1, (r = t.columnFields) !== null && r !== void 0 ? r : [], this.height + 10), this.horizontalDescriptionBlock.init(), this.verticalHistogram = new U(a, this.container, !0), this.verticalDescriptionBlock = new W(s, w.Rows, this.container, !0, (o = t.rowFields) !== null && o !== void 0 ? o : [], this.width + 10 + this.verticalHistogram.getHistogramHeight() + 10 + l.minCellHeight), this.verticalDescriptionBlock.init();
    }
    return e.prototype.getDescriptionBlockParams = function() {
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
    }, e.prototype.getHistogramParams = function() {
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
    }, e.prototype.loadParams = function(t) {
      var i = t.leftTextWidth, n = t.wrapper, r = t.width, o = t.height, s = t.margin, a = t.heatMap, h = t.heatMapColor, c = t.grid;
      i !== void 0 && (this.leftTextWidth = i), this.wrapper = A(n || "body"), r !== void 0 && (this.inputWidth = r), o !== void 0 && (this.inputHeight = o), this.initDimensions(r, o), s !== void 0 && (this.margin = s), a !== void 0 && (this.heatMap = a), c !== void 0 && (this.drawGridLines = c), h !== void 0 && (this.heatMapColor = h);
    }, e.prototype.init = function() {
      this.svg = this.wrapper.append("svg").attr("class", "".concat(l.prefix, "maingrid-svg")).attr("id", "".concat(l.prefix, "maingrid-svg")).attr("width", "100%"), this.container = this.svg.append("g"), this.background = this.container.append("rect").attr("class", "".concat(l.prefix, "background")).attr("width", this.width).attr("height", this.height), this.gridContainer = this.container.append("g");
    }, e.prototype.clear = function() {
      var t, i, n, r;
      (i = (t = this.container) === null || t === void 0 ? void 0 : t.selectAll(".".concat(l.prefix, "sortable-rect"))) === null || i === void 0 || i.remove(), (n = this.horizontalHistogram) === null || n === void 0 || n.clear(), (r = this.verticalHistogram) === null || r === void 0 || r.clear();
    }, e.prototype.render = function() {
      var t = this;
      m.emit(R.RENDER_GRID_START), this.clear(), this.computeCoordinates(), this.svg.on("mouseover", function(r) {
        var o = r.target, s = k(r, o), a = t.getIndexFromScaleBand(t.x, s[0]), h = t.getIndexFromScaleBand(t.y, s[1]);
        if (!(!o.dataset.obsIndex || t.crosshair)) {
          var c = o.dataset.obsIndex.split(" "), u = l.entries.filter(function(d) {
            return d.columnId === c[0] && d.rowId === c[1];
          }), f = u.find(function(d) {
            return d.id == c[2];
          });
          m.emit(_.GRID_CELL_HOVER, {
            target: o,
            entryIds: u.map(function(d) {
              return d.id;
            }),
            entryId: f.id,
            columnId: l.columns[a].id,
            rowId: l.rows[h].id
          });
        }
      }), this.svg.on("mouseout", function() {
        m.emit(_.GRID_OUT);
      }), this.svg.on("click", function(r) {
        var o, s = (o = r.target.dataset.obsIndex) === null || o === void 0 ? void 0 : o.split(" ");
        s && m.emit(_.GRID_CELL_CLICK, {
          target: r.target,
          columnId: s[0],
          rowId: s[1],
          entryId: s[2]
        });
      });
      var i = this.heatMap, n = this.heatMapColor;
      this.container.selectAll(".".concat(l.prefix, "maingrid-svg")).data(l.entries).enter().append("path").attr("data-obs-index", function(r) {
        return "".concat(r.columnId, " ").concat(r.rowId, " ").concat(r.id);
      }).attr("class", function(r) {
        return "".concat(l.prefix, "sortable-rect ").concat(l.prefix).concat(r.columnId, "-cell ").concat(l.prefix).concat(r.rowId, "-cell");
      }).attr("cons", function(r) {
        return t.getValueByType(r);
      }).attr("d", function(r) {
        return t.getRectangularPath(r);
      }).each(function(r) {
        var o = n, s = i ? 0.25 : 1;
        if (!i) {
          var a = l.customFunctions[w.Entries](r);
          o = a.color, s = a.opacity;
        }
        var h = A(this);
        h.attr("fill", o), h.attr("opacity", s);
      }), m.emit(R.RENDER_GRID_END), l.entries.length && (m.emit(R.RENDER_X_HISTOGRAM_START), this.horizontalHistogram.render(), m.emit(R.RENDER_X_HISTOGRAM_END), m.emit(R.RENDER_Y_HISTOGRAM_START), this.verticalHistogram.render(), m.emit(R.RENDER_Y_HISTOGRAM_END)), m.emit(R.RENDER_X_DESCRIPTION_BLOCK_START), this.horizontalDescriptionBlock.render(), m.emit(R.RENDER_X_DESCRIPTION_BLOCK_END), m.emit(R.RENDER_Y_DESCRIPTION_BLOCK_START), this.verticalDescriptionBlock.render(), m.emit(R.RENDER_Y_DESCRIPTION_BLOCK_END), this.defineCrosshairBehaviour(), this.resizeSvg();
    }, e.prototype.update = function(t, i) {
      var n = this;
      this.computeCoordinates(), this.createRowMap(), this.x = t, this.y = i, this.row.selectAll("text").attr("style", function() {
        return n.cellHeight < l.minCellHeight ? "display: none;" : "";
      }), this.row.attr("transform", function(r) {
        return "translate( 0, " + r.y + ")";
      }), this.container.selectAll(".".concat(l.prefix, "sortable-rect")).attr("d", function(r) {
        return n.getRectangularPath(r);
      }), this.horizontalDescriptionBlock.update(l.columns), this.verticalDescriptionBlock.update(l.rows), this.horizontalHistogram.update(l.columns), this.verticalHistogram.update(l.rows);
    }, e.prototype.computeCoordinates = function() {
      var t = this, i, n;
      this.cellWidth = this.width / l.columns.length, (i = this.column) === null || i === void 0 || i.remove(), this.drawGridLines && (this.column = this.gridContainer.selectAll(".".concat(l.prefix, "column-column")).data(l.columns).enter().append("line").attr("x1", function(r) {
        return r.x;
      }).attr("x2", function(r) {
        return r.x;
      }).attr("y1", 0).attr("y2", this.height).attr("class", "".concat(l.prefix, "column-column")).style("pointer-events", "none")), this.cellHeight = this.height / l.rows.length, (n = this.row) === null || n === void 0 || n.remove(), this.row = this.gridContainer.selectAll(".".concat(l.prefix, "row-row")).data(l.rows).enter().append("g").attr("class", "".concat(l.prefix, "row-row")).attr("transform", function(r) {
        return "translate(0," + r.y + ")";
      }), this.drawGridLines && this.row.append("line").attr("x2", this.width).style("pointer-events", "none"), this.row.append("text").attr("class", function(r) {
        return "".concat(l.prefix).concat(r.id, "-label ").concat(l.prefix, "row-label ").concat(l.prefix, "label-text-font");
      }).attr("data-row", function(r) {
        return r.id;
      }).attr("x", -8).attr("y", this.cellHeight / 2).attr("dy", ".32em").attr("text-anchor", "end").attr("style", function() {
        return t.cellHeight < l.minCellHeight ? "display: none;" : "";
      }).text(function(r) {
        return r.symbol;
      }).on("mouseover", function(r) {
        var o = r.target, s = o.dataset.row;
        s && m.emit(_.GRID_LABEL_HOVER, {
          target: o,
          rowId: s
        });
      }).on("click", function(r) {
        var o = r.target, s = o.dataset.row;
        s && (l.sortColumns("countByRow", parseInt(s)), m.emit(D.INNER_UPDATE, !1), m.emit(_.GRID_LABEL_CLICK, {
          target: o,
          rowId: s
        }));
      });
    }, e.prototype.initDimensions = function(t, i) {
      t !== void 0 && (this.width = t), i !== void 0 && (this.height = i), this.cellWidth = this.width / l.columns.length, this.cellHeight = this.height / l.rows.length, this.cellHeight < l.minCellHeight && (this.cellHeight = l.minCellHeight, this.height = l.rows.length * l.minCellHeight);
    }, e.prototype.resize = function(t, i, n, r) {
      this.createRowMap(), this.x = n, this.y = r, this.initDimensions(t, i), this.background.attr("width", this.width).attr("height", this.height), this.computeCoordinates(), l.entries.length && (this.horizontalHistogram.resize(t, this.height), this.verticalHistogram.resize(t, this.height));
      var o = this.horizontalHistogram.getHistogramHeight();
      this.horizontalDescriptionBlock.resize(t, this.height, this.height), this.verticalDescriptionBlock.resize(t, this.height, this.width + o + 120), this.resizeSvg(), this.update(this.x, this.y), this.verticalCross.attr("y2", this.height + this.horizontalDescriptionBlock.height), this.horizontalCross.attr("x2", this.width + o + this.verticalDescriptionBlock.height);
    }, e.prototype.resizeSvg = function() {
      var t = this.horizontalHistogram.getHistogramHeight(), i = this.margin.left + this.leftTextWidth + this.width + t + this.verticalDescriptionBlock.height + this.margin.right, n = this.margin.top + 10 + t + 10 + this.height + this.horizontalDescriptionBlock.height + this.margin.bottom;
      this.svg.attr("width", i).attr("height", n).attr("viewBox", "0 0 ".concat(i, " ").concat(n)), this.container.attr("transform", "translate(" + (this.margin.left + this.leftTextWidth) + "," + (this.margin.top + t + 10) + ")");
    }, e.prototype.defineCrosshairBehaviour = function() {
      var t = this, i = function(r, o) {
        if (t.crosshair) {
          var s = k(o, o.target);
          t.verticalCross.attr("x1", s[0]).attr("opacity", 1), t.verticalCross.attr("x2", s[0]).attr("opacity", 1), t.horizontalCross.attr("y1", s[1]).attr("opacity", 1), t.horizontalCross.attr("y2", s[1]).attr("opacity", 1), r === "mousemove" && t.selectionRegion !== void 0 && t.changeSelection(s);
          var a = t.width < s[0] ? -1 : t.getIndexFromScaleBand(t.x, s[0]), h = t.height < s[1] ? -1 : t.getIndexFromScaleBand(t.y, s[1]), c = l.columns[a], u = l.rows[h];
          if (!c || !u)
            return;
          r === "mouseover" && m.emit(_.GRID_CROSSHAIR_HOVER, {
            target: o.target,
            columnId: c.id,
            rowId: u.id
          });
        }
      }, n = this.horizontalHistogram.getHistogramHeight();
      this.verticalCross = this.container.append("line").attr("class", "".concat(l.prefix, "vertical-cross")).attr("y1", -n).attr("y2", this.height + this.horizontalDescriptionBlock.height).attr("opacity", 0).attr("style", "pointer-events: none"), this.horizontalCross = this.container.append("line").attr("class", "".concat(l.prefix, "horizontal-cross")).attr("x1", 0).attr("x2", this.width + n + this.verticalDescriptionBlock.height).attr("opacity", 0).attr("style", "pointer-events: none"), this.container.on("mousedown", function(r) {
        t.startSelection(r);
      }).on("mouseover", function(r) {
        i("mouseover", r);
      }).on("mousemove", function(r) {
        i("mousemove", r);
      }).on("mouseout", function() {
        t.crosshair && (t.verticalCross.attr("opacity", 0), t.horizontalCross.attr("opacity", 0), m.emit(_.GRID_CROSSHAIR_OUT));
      }).on("mouseup", function(r) {
        t.verticalCross.attr("opacity", 0), t.horizontalCross.attr("opacity", 0), t.finishSelection(r);
      });
    }, e.prototype.startSelection = function(t) {
      if (this.crosshair && this.selectionRegion === void 0) {
        t.stopPropagation();
        var i = k(t, t.target);
        m.emit(_.GRID_SELECTION_STARTED, {
          target: t.target,
          x: i[0],
          y: i[1]
        }), this.selectionRegion = this.container.append("rect").attr("x", i[0]).attr("y", i[1]).attr("width", 1).attr("height", 1).attr("class", "".concat(l.prefix, "selection-region")).attr("stroke", "black").attr("stroke-width", "2").attr("opacity", 0.2);
      }
    }, e.prototype.changeSelection = function(t) {
      var i = {
        x: parseInt(this.selectionRegion.attr("x"), 10),
        y: parseInt(this.selectionRegion.attr("y"), 10),
        width: parseInt(this.selectionRegion.attr("width"), 10),
        height: parseInt(this.selectionRegion.attr("height"), 10)
      }, n = {
        x: t[0] - Number(this.selectionRegion.attr("x")),
        y: t[1] - Number(this.selectionRegion.attr("y"))
      };
      n.x < 1 || n.x * 2 < i.width ? (i.x = t[0], i.width -= n.x) : i.width = n.x, n.y < 1 || n.y * 2 < i.height ? (i.y = t[1], i.height -= n.y) : i.height = n.y, this.selectionRegion.attr("x", i.x), this.selectionRegion.attr("y", i.y), this.selectionRegion.attr("width", i.width), this.selectionRegion.attr("height", i.height);
    }, e.prototype.getIndexFromScaleBand = function(t, i) {
      var n = t.step(), r = Math.floor(i / n);
      return t.domain()[r];
    }, e.prototype.finishSelection = function(t) {
      if (this.crosshair && this.selectionRegion !== void 0) {
        t.stopPropagation();
        var i = Number(this.selectionRegion.attr("x")), n = i + Number(this.selectionRegion.attr("width")), r = Number(this.selectionRegion.attr("y")), o = r + Number(this.selectionRegion.attr("height")), s = this.getIndexFromScaleBand(this.x, i), a = this.getIndexFromScaleBand(this.x, n), h = this.getIndexFromScaleBand(this.y, r), c = this.getIndexFromScaleBand(this.y, o);
        this.sliceColumns(parseInt(s), parseInt(a)), this.sliceRows(parseInt(h), parseInt(c)), this.selectionRegion.remove(), delete this.selectionRegion, m.emit(_.GRID_SELECTION_FINISHED, {
          target: t.target,
          x: n,
          y: o
        }), m.emit(D.INNER_UPDATE, !0);
      }
    }, e.prototype.sliceRows = function(t, i) {
      for (var n = 0; n < l.rows.length; n++) {
        var r = l.rows[n];
        (n < t || n > i) && (O(".".concat(l.prefix).concat(r.id, "-cell")).remove(), O(".".concat(l.prefix).concat(r.id, "-bar")).remove(), l.rows.splice(n, 1), n--, t--, i--);
      }
    }, e.prototype.sliceColumns = function(t, i) {
      for (var n = 0; n < l.columns.length; n++) {
        var r = l.columns[n];
        (n < t || n > i) && (O(".".concat(l.prefix).concat(r.id, "-cell")).remove(), O(".".concat(l.prefix).concat(r.id, "-bar")).remove(), l.columns.splice(n, 1), n--, t--, i--);
      }
    }, e.prototype.createRowMap = function() {
      for (var t = {}, i = 0, n = l.rows; i < n.length; i++) {
        var r = n[i];
        t[r.id] = r;
      }
      this.rowMap = t;
    }, e.prototype.getY = function(t) {
      var i, n = t.id, r = t.rowId, o = t.columnId, s = (i = this.rowMap[r].y) !== null && i !== void 0 ? i : 0;
      if (this.heatMap)
        return s;
      var a = l.lookupTable[o][r];
      return a.length === 0 ? s : s + this.cellHeight / a.length * a.indexOf(n);
    }, e.prototype.getCellX = function(t) {
      var i;
      return (i = l.lookupTable[t.columnId].x) !== null && i !== void 0 ? i : 0;
    }, e.prototype.getColor = function(t) {
      var i, n = (i = t.value) !== null && i !== void 0 ? i : t.consequence;
      return this.heatMap ? this.heatMapColor : this.colorMap[n];
    }, e.prototype.getOpacity = function(t) {
      return t && this.heatMap ? 0.25 : 1;
    }, e.prototype.getHeight = function(t) {
      var i, n = t.columnId, r = t.rowId, o = (i = this.cellHeight) !== null && i !== void 0 ? i : 0;
      if (this.heatMap)
        return o;
      var s = l.lookupTable[n][r].length;
      return s === 0 ? o : o / s;
    }, e.prototype.getValueByType = function(t) {
      var i;
      return (i = t.value) !== null && i !== void 0 ? i : "";
    }, e.prototype.getRectangularPath = function(t) {
      var i = this.getCellX(t), n = this.getY(t);
      return "M " + i + " " + n + " H " + (i + this.cellWidth) + " V " + (n + this.getHeight(t)) + " H " + i + "Z";
    }, e.prototype.setHeatmap = function(t) {
      var i = this;
      if (t === this.heatMap)
        return this.heatMap;
      this.heatMap = t;
      var n = this.heatMapColor;
      return O(".".concat(l.prefix, "sortable-rect")).attr("d", function(r) {
        return i.getRectangularPath(r);
      }).each(function(r) {
        var o = n, s = t ? 0.25 : 1;
        if (!t) {
          var a = l.customFunctions[w.Entries](r);
          o = a.color, s = a.opacity;
        }
        var h = A(this);
        h.attr("fill", o), h.attr("opacity", s);
      }), this.heatMap;
    }, e.prototype.setGridLines = function(t) {
      return this.drawGridLines === t ? this.drawGridLines : (this.drawGridLines = t, this.verticalDescriptionBlock.setGridLines(this.drawGridLines), this.horizontalDescriptionBlock.setGridLines(this.drawGridLines), this.computeCoordinates(), this.drawGridLines);
    }, e.prototype.setCrosshair = function(t) {
      return this.crosshair = t, this.crosshair;
    }, e.prototype.destroy = function() {
      this.wrapper.select(".".concat(l.prefix, "maingrid-svg")).remove();
    }, e;
  }()
), je = (
  /** @class */
  function(e) {
    K(t, e);
    function t(i) {
      var n, r, o = e.call(this) || this;
      return o.heatMapMode = !1, o.drawGridLines = !1, o.crosshairMode = !1, o.charts = [], o.fullscreen = !1, l.setOptions({
        minCellHeight: i.minCellHeight,
        prefix: i.prefix,
        rows: i.rows,
        columns: i.columns,
        entries: i.entries,
        columnsAppearanceFunc: i.columnsAppearanceFunc,
        rowsAppearanceFunc: i.rowsAppearanceFunc,
        cellAppearanceFunc: i.cellAppearanceFunc
      }), o.params = i, o.width = (n = i.width) !== null && n !== void 0 ? n : 500, o.height = (r = i.height) !== null && r !== void 0 ? r : 500, o.height / l.rows.length < l.minCellHeight && (o.height = l.rows.length * l.minCellHeight), i.wrapper = ".".concat(l.prefix, "container"), o.container = A(i.element || "body").append("div").attr("class", "".concat(l.prefix, "container")).style("position", "relative"), o.initCharts(), m.exposeEvents().forEach(function(s) {
        m.on(s, function(a) {
          return o.emit(s, a);
        });
      }), o;
    }
    return t.create = function(i) {
      return new t(i);
    }, t.prototype.setLayer = function(i) {
      l.layer !== i && (l.setLayer(i), this.createLookupTable(), this.computeColumnCounts(), this.computeRowCounts(), this.calculatePositions(), this.charts.forEach(function(n) {
        n.render();
      }));
    }, t.prototype.initCharts = function(i) {
      var n = this;
      this.createLookupTable(), this.computeColumnCounts(), this.computeRowCounts(), this.sortColumnsByScores(), this.sortRowsByScores(), this.calculatePositions(), i && (this.params.width = this.width, this.params.height = this.height), this.mainGrid = new $e(this.params, this.x, this.y), m.off(D.INNER_RESIZE), m.off(D.INNER_UPDATE), m.on(D.INNER_RESIZE, function() {
        n.resize(n.width, n.height, n.fullscreen);
      }), m.on(D.INNER_UPDATE, function(r) {
        n.update();
      }), this.heatMapMode = this.mainGrid.heatMap, this.drawGridLines = this.mainGrid.drawGridLines, this.crosshairMode = this.mainGrid.crosshair, this.charts = [], this.charts.push(this.mainGrid);
    }, t.prototype.calculatePositions = function() {
      for (var i, n = L().domain(b(l.columns.length).map(String)).range([0, this.width]), r = L().domain(b(l.rows.length).map(String)).range([0, this.height]), o = 0; o < l.columns.length; o++) {
        var s = l.columns[o], a = s.id, h = n(String(o));
        s.x = h, l.lookupTable[a] = l.lookupTable[a] || {}, l.lookupTable[a].x = h;
      }
      for (var o = 0; o < l.rows.length; o++)
        l.rows[o].y = (i = r(String(o))) !== null && i !== void 0 ? i : 0;
      this.x = n, this.y = r;
    }, t.prototype.createLookupTable = function() {
      var i = {};
      l.entries.forEach(function(n) {
        var r = n.columnId, o = n.rowId;
        i[r] === void 0 && (i[r] = {}), i[r][o] === void 0 && (i[r][o] = []), i[r][o].push(n.id);
      }), l.setLookupTable(i);
    }, t.prototype.render = function() {
      var i = this;
      m.emit(R.RENDER_ALL_START), setTimeout(function() {
        i.charts.forEach(function(n) {
          n.render();
        }), m.emit(R.RENDER_ALL_END);
      });
    }, t.prototype.update = function() {
      var i = this;
      this.calculatePositions(), this.charts.forEach(function(n) {
        n.update(i.x, i.y);
      });
    }, t.prototype.resize = function(i, n, r) {
      var o = this;
      this.fullscreen = r, this.mainGrid.fullscreen = r, this.width = Number(i), this.height = Number(n), this.height / l.rows.length < l.minCellHeight && (this.height = l.rows.length * l.minCellHeight), this.calculatePositions(), this.charts.forEach(function(s) {
        s.fullscreen = r, s.resize(o.width, o.height, o.x, o.y);
      });
    }, t.prototype.sortColumnsByScores = function() {
      l.columns.sort(function(i, n) {
        var r = Object.values(i.countByRow).reduce(function(s, a) {
          return s + (a ?? 0);
        }, 0), o = Object.values(n.countByRow).reduce(function(s, a) {
          return s + (a ?? 0);
        }, 0);
        return r < o ? 1 : r > o ? -1 : i.id >= n.id ? 1 : -1;
      });
    }, t.prototype.sortRowsByScores = function() {
      l.rows.sort(function(i, n) {
        var r = Object.values(i.countByColumn).reduce(function(s, a) {
          return s + (a ?? 0);
        }, 0), o = Object.values(n.countByColumn).reduce(function(s, a) {
          return s + (a ?? 0);
        }, 0);
        return r < o ? 1 : r > o ? -1 : i.id >= n.id ? 1 : -1;
      });
    }, t.prototype.cluster = function() {
      this.sortColumnsByScores(), this.sortRowsByScores(), this.update();
    }, t.prototype.setHeatmap = function(i) {
      this.heatMapMode = i, this.mainGrid.setHeatmap(i);
    }, t.prototype.toggleHeatmap = function() {
      this.setHeatmap(!this.heatMapMode);
    }, t.prototype.setGridLines = function(i) {
      this.drawGridLines = i, this.mainGrid.setGridLines(i);
    }, t.prototype.toggleGridLines = function() {
      this.setGridLines(!this.drawGridLines);
    }, t.prototype.setCrosshair = function(i) {
      this.crosshairMode = i, this.mainGrid.setCrosshair(i);
    }, t.prototype.toggleCrosshair = function() {
      this.setCrosshair(!this.crosshairMode);
    }, t.prototype.computeColumnCounts = function() {
      for (var i, n = 0, r = l.columns; n < r.length; n++) {
        var o = r[n], s = Object.values((i = l.lookupTable[o.id]) !== null && i !== void 0 ? i : {});
        o.count = 0;
        for (var a = 0, h = s; a < h.length; a++) {
          var c = h[a];
          o.count += c.length;
        }
        o.countByRow = {};
        for (var u = 0, f = l.entries; u < f.length; u++) {
          var d = f[u];
          o.id === d.columnId && (o.countByRow[d.rowId] === void 0 && (o.countByRow[d.rowId] = 0), o.countByRow[d.rowId]++);
        }
      }
    }, t.prototype.computeRowCounts = function() {
      for (var i = 0, n = l.rows; i < n.length; i++) {
        var r = n[i];
        r.count = 0, r.countByColumn = {};
        for (var o = 0, s = l.entries; o < s.length; o++) {
          var a = s[o];
          r.id === a.rowId && (r.count++, r.countByColumn[a.columnId] === void 0 && (r.countByColumn[a.columnId] = 0), r.countByColumn[a.columnId]++);
        }
      }
    }, t.prototype.destroy = function() {
      this.charts.forEach(function(i) {
        i.destroy();
      }), this.container.remove();
    }, t.prototype.reload = function() {
      this.charts.forEach(function(i) {
        i.destroy();
      }), l.reset(), this.container = A(this.params.element || "body").append("div").attr("class", "".concat(l.prefix, "container")).style("position", "relative"), this.initCharts(!0), this.render();
    }, t;
  }(ht)
);
export {
  je as default
};
//# sourceMappingURL=event-matrix.es.js.map
