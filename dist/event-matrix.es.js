var M = function(e, t) {
  return M = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(i, n) {
    i.__proto__ = n;
  } || function(i, n) {
    for (var r in n)
      Object.prototype.hasOwnProperty.call(n, r) && (i[r] = n[r]);
  }, M(e, t);
};
function Y(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  M(e, t);
  function i() {
    this.constructor = e;
  }
  e.prototype = t === null ? Object.create(t) : (i.prototype = t.prototype, new i());
}
var b = function() {
  return b = Object.assign || function(t) {
    for (var i, n = 1, r = arguments.length; n < r; n++) {
      i = arguments[n];
      for (var o in i)
        Object.prototype.hasOwnProperty.call(i, o) && (t[o] = i[o]);
    }
    return t;
  }, b.apply(this, arguments);
};
function A(e, t, i) {
  if (i || arguments.length === 2)
    for (var n = 0, r = t.length, o; n < r; n++)
      (o || !(n in t)) && (o || (o = Array.prototype.slice.call(t, 0, n)), o[n] = t[n]);
  return e.concat(o || Array.prototype.slice.call(t));
}
class z extends Map {
  constructor(t, i = dt) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: i } }), t != null)
      for (const [n, r] of t)
        this.set(n, r);
  }
  get(t) {
    return super.get(V(this, t));
  }
  has(t) {
    return super.has(V(this, t));
  }
  set(t, i) {
    return super.set(ut(this, t), i);
  }
  delete(t) {
    return super.delete(ft(this, t));
  }
}
function V({ _intern: e, _key: t }, i) {
  const n = t(i);
  return e.has(n) ? e.get(n) : i;
}
function ut({ _intern: e, _key: t }, i) {
  const n = t(i);
  return e.has(n) ? e.get(n) : (e.set(n, i), i);
}
function ft({ _intern: e, _key: t }, i) {
  const n = t(i);
  return e.has(n) && (i = e.get(n), e.delete(n)), i;
}
function dt(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
function L(e, t, i) {
  e = +e, t = +t, i = (r = arguments.length) < 2 ? (t = e, e = 0, 1) : r < 3 ? 1 : +i;
  for (var n = -1, r = Math.max(0, Math.ceil((t - e) / i)) | 0, o = new Array(r); ++n < r; )
    o[n] = e + n * i;
  return o;
}
function q(e, t) {
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
const W = Symbol("implicit");
function Z() {
  var e = new z(), t = [], i = [], n = W;
  function r(o) {
    let s = e.get(o);
    if (s === void 0) {
      if (n !== W)
        return n;
      e.set(o, s = t.push(o) - 1);
    }
    return i[s % i.length];
  }
  return r.domain = function(o) {
    if (!arguments.length)
      return t.slice();
    t = [], e = new z();
    for (const s of o)
      e.has(s) || e.set(s, t.push(s) - 1);
    return r;
  }, r.range = function(o) {
    return arguments.length ? (i = Array.from(o), r) : i.slice();
  }, r.unknown = function(o) {
    return arguments.length ? (n = o, r) : n;
  }, r.copy = function() {
    return Z(t, i).unknown(n);
  }, q.apply(r, arguments), r;
}
function N() {
  var e = Z().unknown(void 0), t = e.domain, i = e.range, n = 0, r = 1, o, s, h = !1, a = 0, c = 0, u = 0.5;
  delete e.unknown;
  function f() {
    var d = t().length, v = r < n, p = v ? r : n, x = v ? n : r;
    o = (x - p) / Math.max(1, d - a + c * 2), h && (o = Math.floor(o)), p += (x - p - o * (d - a)) * u, s = o * (1 - a), h && (p = Math.round(p), s = Math.round(s));
    var g = L(d).map(function(E) {
      return p + o * E;
    });
    return i(v ? g.reverse() : g);
  }
  return e.domain = function(d) {
    return arguments.length ? (t(d), f()) : t();
  }, e.range = function(d) {
    return arguments.length ? ([n, r] = d, n = +n, r = +r, f()) : [n, r];
  }, e.rangeRound = function(d) {
    return [n, r] = d, n = +n, r = +r, h = !0, f();
  }, e.bandwidth = function() {
    return s;
  }, e.step = function() {
    return o;
  }, e.round = function(d) {
    return arguments.length ? (h = !!d, f()) : h;
  }, e.padding = function(d) {
    return arguments.length ? (a = Math.min(1, c = +d), f()) : a;
  }, e.paddingInner = function(d) {
    return arguments.length ? (a = Math.min(1, d), f()) : a;
  }, e.paddingOuter = function(d) {
    return arguments.length ? (c = +d, f()) : c;
  }, e.align = function(d) {
    return arguments.length ? (u = Math.max(0, Math.min(1, d)), f()) : u;
  }, e.copy = function() {
    return N(t(), [n, r]).round(h).paddingInner(a).paddingOuter(c).align(u);
  }, q.apply(f(), arguments);
}
var B = "http://www.w3.org/1999/xhtml";
const U = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: B,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function J(e) {
  var t = e += "", i = t.indexOf(":");
  return i >= 0 && (t = e.slice(0, i)) !== "xmlns" && (e = e.slice(i + 1)), U.hasOwnProperty(t) ? { space: U[t], local: e } : e;
}
function pt(e) {
  return function() {
    var t = this.ownerDocument, i = this.namespaceURI;
    return i === B && t.documentElement.namespaceURI === B ? t.createElement(e) : t.createElementNS(i, e);
  };
}
function gt(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Q(e) {
  var t = J(e);
  return (t.local ? gt : pt)(t);
}
function mt() {
}
function $(e) {
  return e == null ? mt : function() {
    return this.querySelector(e);
  };
}
function vt(e) {
  typeof e != "function" && (e = $(e));
  for (var t = this._groups, i = t.length, n = new Array(i), r = 0; r < i; ++r)
    for (var o = t[r], s = o.length, h = n[r] = new Array(s), a, c, u = 0; u < s; ++u)
      (a = o[u]) && (c = e.call(a, a.__data__, u, o)) && ("__data__" in a && (c.__data__ = a.__data__), h[u] = c);
  return new I(n, this._parents);
}
function j(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function yt() {
  return [];
}
function wt(e) {
  return e == null ? yt : function() {
    return this.querySelectorAll(e);
  };
}
function _t(e) {
  return function() {
    return j(e.apply(this, arguments));
  };
}
function xt(e) {
  typeof e == "function" ? e = _t(e) : e = wt(e);
  for (var t = this._groups, i = t.length, n = [], r = [], o = 0; o < i; ++o)
    for (var s = t[o], h = s.length, a, c = 0; c < h; ++c)
      (a = s[c]) && (n.push(e.call(a, a.__data__, c, s)), r.push(a));
  return new I(n, r);
}
function Rt(e) {
  return function() {
    return this.matches(e);
  };
}
function tt(e) {
  return function(t) {
    return t.matches(e);
  };
}
var It = Array.prototype.find;
function Ct(e) {
  return function() {
    return It.call(this.children, e);
  };
}
function Et() {
  return this.firstElementChild;
}
function Dt(e) {
  return this.select(e == null ? Et : Ct(typeof e == "function" ? e : tt(e)));
}
var St = Array.prototype.filter;
function Ht() {
  return Array.from(this.children);
}
function Tt(e) {
  return function() {
    return St.call(this.children, e);
  };
}
function Ot(e) {
  return this.selectAll(e == null ? Ht : Tt(typeof e == "function" ? e : tt(e)));
}
function At(e) {
  typeof e != "function" && (e = Rt(e));
  for (var t = this._groups, i = t.length, n = new Array(i), r = 0; r < i; ++r)
    for (var o = t[r], s = o.length, h = n[r] = [], a, c = 0; c < s; ++c)
      (a = o[c]) && e.call(a, a.__data__, c, o) && h.push(a);
  return new I(n, this._parents);
}
function et(e) {
  return new Array(e.length);
}
function bt() {
  return new I(this._enter || this._groups.map(et), this._parents);
}
function k(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
k.prototype = {
  constructor: k,
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
function Lt(e) {
  return function() {
    return e;
  };
}
function Nt(e, t, i, n, r, o) {
  for (var s = 0, h, a = t.length, c = o.length; s < c; ++s)
    (h = t[s]) ? (h.__data__ = o[s], n[s] = h) : i[s] = new k(e, o[s]);
  for (; s < a; ++s)
    (h = t[s]) && (r[s] = h);
}
function kt(e, t, i, n, r, o, s) {
  var h, a, c = /* @__PURE__ */ new Map(), u = t.length, f = o.length, d = new Array(u), v;
  for (h = 0; h < u; ++h)
    (a = t[h]) && (d[h] = v = s.call(a, a.__data__, h, t) + "", c.has(v) ? r[h] = a : c.set(v, a));
  for (h = 0; h < f; ++h)
    v = s.call(e, o[h], h, o) + "", (a = c.get(v)) ? (n[h] = a, a.__data__ = o[h], c.delete(v)) : i[h] = new k(e, o[h]);
  for (h = 0; h < u; ++h)
    (a = t[h]) && c.get(d[h]) === a && (r[h] = a);
}
function Gt(e) {
  return e.__data__;
}
function Mt(e, t) {
  if (!arguments.length)
    return Array.from(this, Gt);
  var i = t ? kt : Nt, n = this._parents, r = this._groups;
  typeof e != "function" && (e = Lt(e));
  for (var o = r.length, s = new Array(o), h = new Array(o), a = new Array(o), c = 0; c < o; ++c) {
    var u = n[c], f = r[c], d = f.length, v = Bt(e.call(u, u && u.__data__, c, n)), p = v.length, x = h[c] = new Array(p), g = s[c] = new Array(p), E = a[c] = new Array(d);
    i(u, f, x, g, E, v, t);
    for (var C = 0, y = 0, O, S; C < p; ++C)
      if (O = x[C]) {
        for (C >= y && (y = C + 1); !(S = g[y]) && ++y < p; )
          ;
        O._next = S || null;
      }
  }
  return s = new I(s, n), s._enter = h, s._exit = a, s;
}
function Bt(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Pt() {
  return new I(this._exit || this._groups.map(et), this._parents);
}
function Ft(e, t, i) {
  var n = this.enter(), r = this, o = this.exit();
  return typeof e == "function" ? (n = e(n), n && (n = n.selection())) : n = n.append(e + ""), t != null && (r = t(r), r && (r = r.selection())), i == null ? o.remove() : i(o), n && r ? n.merge(r).order() : r;
}
function zt(e) {
  for (var t = e.selection ? e.selection() : e, i = this._groups, n = t._groups, r = i.length, o = n.length, s = Math.min(r, o), h = new Array(r), a = 0; a < s; ++a)
    for (var c = i[a], u = n[a], f = c.length, d = h[a] = new Array(f), v, p = 0; p < f; ++p)
      (v = c[p] || u[p]) && (d[p] = v);
  for (; a < r; ++a)
    h[a] = i[a];
  return new I(h, this._parents);
}
function Vt() {
  for (var e = this._groups, t = -1, i = e.length; ++t < i; )
    for (var n = e[t], r = n.length - 1, o = n[r], s; --r >= 0; )
      (s = n[r]) && (o && s.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(s, o), o = s);
  return this;
}
function Wt(e) {
  e || (e = Ut);
  function t(f, d) {
    return f && d ? e(f.__data__, d.__data__) : !f - !d;
  }
  for (var i = this._groups, n = i.length, r = new Array(n), o = 0; o < n; ++o) {
    for (var s = i[o], h = s.length, a = r[o] = new Array(h), c, u = 0; u < h; ++u)
      (c = s[u]) && (a[u] = c);
    a.sort(t);
  }
  return new I(r, this._parents).order();
}
function Ut(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Kt() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Xt() {
  return Array.from(this);
}
function Yt() {
  for (var e = this._groups, t = 0, i = e.length; t < i; ++t)
    for (var n = e[t], r = 0, o = n.length; r < o; ++r) {
      var s = n[r];
      if (s)
        return s;
    }
  return null;
}
function qt() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function Zt() {
  return !this.node();
}
function Jt(e) {
  for (var t = this._groups, i = 0, n = t.length; i < n; ++i)
    for (var r = t[i], o = 0, s = r.length, h; o < s; ++o)
      (h = r[o]) && e.call(h, h.__data__, o, r);
  return this;
}
function Qt(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function $t(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function jt(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function te(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function ee(e, t) {
  return function() {
    var i = t.apply(this, arguments);
    i == null ? this.removeAttribute(e) : this.setAttribute(e, i);
  };
}
function ie(e, t) {
  return function() {
    var i = t.apply(this, arguments);
    i == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, i);
  };
}
function ne(e, t) {
  var i = J(e);
  if (arguments.length < 2) {
    var n = this.node();
    return i.local ? n.getAttributeNS(i.space, i.local) : n.getAttribute(i);
  }
  return this.each((t == null ? i.local ? $t : Qt : typeof t == "function" ? i.local ? ie : ee : i.local ? te : jt)(i, t));
}
function it(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function re(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function oe(e, t, i) {
  return function() {
    this.style.setProperty(e, t, i);
  };
}
function se(e, t, i) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.style.removeProperty(e) : this.style.setProperty(e, n, i);
  };
}
function ae(e, t, i) {
  return arguments.length > 1 ? this.each((t == null ? re : typeof t == "function" ? se : oe)(e, t, i ?? "")) : he(this.node(), e);
}
function he(e, t) {
  return e.style.getPropertyValue(t) || it(e).getComputedStyle(e, null).getPropertyValue(t);
}
function le(e) {
  return function() {
    delete this[e];
  };
}
function ce(e, t) {
  return function() {
    this[e] = t;
  };
}
function ue(e, t) {
  return function() {
    var i = t.apply(this, arguments);
    i == null ? delete this[e] : this[e] = i;
  };
}
function fe(e, t) {
  return arguments.length > 1 ? this.each((t == null ? le : typeof t == "function" ? ue : ce)(e, t)) : this.node()[e];
}
function nt(e) {
  return e.trim().split(/^|\s+/);
}
function F(e) {
  return e.classList || new rt(e);
}
function rt(e) {
  this._node = e, this._names = nt(e.getAttribute("class") || "");
}
rt.prototype = {
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
function ot(e, t) {
  for (var i = F(e), n = -1, r = t.length; ++n < r; )
    i.add(t[n]);
}
function st(e, t) {
  for (var i = F(e), n = -1, r = t.length; ++n < r; )
    i.remove(t[n]);
}
function de(e) {
  return function() {
    ot(this, e);
  };
}
function pe(e) {
  return function() {
    st(this, e);
  };
}
function ge(e, t) {
  return function() {
    (t.apply(this, arguments) ? ot : st)(this, e);
  };
}
function me(e, t) {
  var i = nt(e + "");
  if (arguments.length < 2) {
    for (var n = F(this.node()), r = -1, o = i.length; ++r < o; )
      if (!n.contains(i[r]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? ge : t ? de : pe)(i, t));
}
function ve() {
  this.textContent = "";
}
function ye(e) {
  return function() {
    this.textContent = e;
  };
}
function we(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function _e(e) {
  return arguments.length ? this.each(e == null ? ve : (typeof e == "function" ? we : ye)(e)) : this.node().textContent;
}
function xe() {
  this.innerHTML = "";
}
function Re(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Ie(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Ce(e) {
  return arguments.length ? this.each(e == null ? xe : (typeof e == "function" ? Ie : Re)(e)) : this.node().innerHTML;
}
function Ee() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function De() {
  return this.each(Ee);
}
function Se() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function He() {
  return this.each(Se);
}
function Te(e) {
  var t = typeof e == "function" ? e : Q(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Oe() {
  return null;
}
function Ae(e, t) {
  var i = typeof e == "function" ? e : Q(e), n = t == null ? Oe : typeof t == "function" ? t : $(t);
  return this.select(function() {
    return this.insertBefore(i.apply(this, arguments), n.apply(this, arguments) || null);
  });
}
function be() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Le() {
  return this.each(be);
}
function Ne() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function ke() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Ge(e) {
  return this.select(e ? ke : Ne);
}
function Me(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Be(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Pe(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var i = "", n = t.indexOf(".");
    return n >= 0 && (i = t.slice(n + 1), t = t.slice(0, n)), { type: t, name: i };
  });
}
function Fe(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var i = 0, n = -1, r = t.length, o; i < r; ++i)
        o = t[i], (!e.type || o.type === e.type) && o.name === e.name ? this.removeEventListener(o.type, o.listener, o.options) : t[++n] = o;
      ++n ? t.length = n : delete this.__on;
    }
  };
}
function ze(e, t, i) {
  return function() {
    var n = this.__on, r, o = Be(t);
    if (n) {
      for (var s = 0, h = n.length; s < h; ++s)
        if ((r = n[s]).type === e.type && r.name === e.name) {
          this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, r.listener = o, r.options = i), r.value = t;
          return;
        }
    }
    this.addEventListener(e.type, o, i), r = { type: e.type, name: e.name, value: t, listener: o, options: i }, n ? n.push(r) : this.__on = [r];
  };
}
function Ve(e, t, i) {
  var n = Pe(e + ""), r, o = n.length, s;
  if (arguments.length < 2) {
    var h = this.node().__on;
    if (h) {
      for (var a = 0, c = h.length, u; a < c; ++a)
        for (r = 0, u = h[a]; r < o; ++r)
          if ((s = n[r]).type === u.type && s.name === u.name)
            return u.value;
    }
    return;
  }
  for (h = t ? ze : Fe, r = 0; r < o; ++r)
    this.each(h(n[r], t, i));
  return this;
}
function at(e, t, i) {
  var n = it(e), r = n.CustomEvent;
  typeof r == "function" ? r = new r(t, i) : (r = n.document.createEvent("Event"), i ? (r.initEvent(t, i.bubbles, i.cancelable), r.detail = i.detail) : r.initEvent(t, !1, !1)), e.dispatchEvent(r);
}
function We(e, t) {
  return function() {
    return at(this, e, t);
  };
}
function Ue(e, t) {
  return function() {
    return at(this, e, t.apply(this, arguments));
  };
}
function Ke(e, t) {
  return this.each((typeof t == "function" ? Ue : We)(e, t));
}
function* Xe() {
  for (var e = this._groups, t = 0, i = e.length; t < i; ++t)
    for (var n = e[t], r = 0, o = n.length, s; r < o; ++r)
      (s = n[r]) && (yield s);
}
var ht = [null];
function I(e, t) {
  this._groups = e, this._parents = t;
}
function Ye() {
  return this;
}
I.prototype = {
  constructor: I,
  select: vt,
  selectAll: xt,
  selectChild: Dt,
  selectChildren: Ot,
  filter: At,
  data: Mt,
  enter: bt,
  exit: Pt,
  join: Ft,
  merge: zt,
  selection: Ye,
  order: Vt,
  sort: Wt,
  call: Kt,
  nodes: Xt,
  node: Yt,
  size: qt,
  empty: Zt,
  each: Jt,
  attr: ne,
  style: ae,
  property: fe,
  classed: me,
  text: _e,
  html: Ce,
  raise: De,
  lower: He,
  append: Te,
  insert: Ae,
  remove: Le,
  clone: Ge,
  datum: Me,
  on: Ve,
  dispatch: Ke,
  [Symbol.iterator]: Xe
};
function T(e) {
  return typeof e == "string" ? new I([[document.querySelector(e)]], [document.documentElement]) : new I([[e]], ht);
}
function qe(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function G(e, t) {
  if (e = qe(e), t === void 0 && (t = e.currentTarget), t) {
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
function H(e) {
  return typeof e == "string" ? new I([document.querySelectorAll(e)], [document.documentElement]) : new I([j(e)], ht);
}
function Ze(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var lt = { exports: {} };
(function(e) {
  var t = Object.prototype.hasOwnProperty, i = "~";
  function n() {
  }
  Object.create && (n.prototype = /* @__PURE__ */ Object.create(null), new n().__proto__ || (i = !1));
  function r(a, c, u) {
    this.fn = a, this.context = c, this.once = u || !1;
  }
  function o(a, c, u, f, d) {
    if (typeof u != "function")
      throw new TypeError("The listener must be a function");
    var v = new r(u, f || a, d), p = i ? i + c : c;
    return a._events[p] ? a._events[p].fn ? a._events[p] = [a._events[p], v] : a._events[p].push(v) : (a._events[p] = v, a._eventsCount++), a;
  }
  function s(a, c) {
    --a._eventsCount === 0 ? a._events = new n() : delete a._events[c];
  }
  function h() {
    this._events = new n(), this._eventsCount = 0;
  }
  h.prototype.eventNames = function() {
    var c = [], u, f;
    if (this._eventsCount === 0)
      return c;
    for (f in u = this._events)
      t.call(u, f) && c.push(i ? f.slice(1) : f);
    return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(u)) : c;
  }, h.prototype.listeners = function(c) {
    var u = i ? i + c : c, f = this._events[u];
    if (!f)
      return [];
    if (f.fn)
      return [f.fn];
    for (var d = 0, v = f.length, p = new Array(v); d < v; d++)
      p[d] = f[d].fn;
    return p;
  }, h.prototype.listenerCount = function(c) {
    var u = i ? i + c : c, f = this._events[u];
    return f ? f.fn ? 1 : f.length : 0;
  }, h.prototype.emit = function(c, u, f, d, v, p) {
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
      var O = g.length, S;
      for (y = 0; y < O; y++)
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
              for (S = 1, C = new Array(E - 1); S < E; S++)
                C[S - 1] = arguments[S];
            g[y].fn.apply(g[y].context, C);
        }
    }
    return !0;
  }, h.prototype.on = function(c, u, f) {
    return o(this, c, u, f, !1);
  }, h.prototype.once = function(c, u, f) {
    return o(this, c, u, f, !0);
  }, h.prototype.removeListener = function(c, u, f, d) {
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
  }, h.prototype.removeAllListeners = function(c) {
    var u;
    return c ? (u = i ? i + c : c, this._events[u] && s(this, u)) : (this._events = new n(), this._eventsCount = 0), this;
  }, h.prototype.off = h.prototype.removeListener, h.prototype.addListener = h.prototype.on, h.prefixed = i, h.EventEmitter = h, e.exports = h;
})(lt);
var Je = lt.exports;
const ct = /* @__PURE__ */ Ze(Je);
var w;
(function(e) {
  e.GRID_CELL_HOVER = "grid:cell:hover", e.GRID_CELL_CLICK = "grid:cell:click", e.GRID_OUT = "grid:out", e.GRID_LABEL_HOVER = "grid:label:hover", e.GRID_LABEL_CLICK = "grid:label:click", e.GRID_CROSSHAIR_HOVER = "grid:crosshair:hover", e.GRID_CROSSHAIR_OUT = "grid:crosshair:out", e.GRID_SELECTION_STARTED = "grid:selection:started", e.GRID_SELECTION_FINISHED = "grid:selection:finished", e.HISTOGRAM_HOVER = "histogram:hover", e.HISTOGRAM_CLICK = "histogram:click", e.HISTOGRAM_OUT = "histogram:out", e.DESCRIPTION_LEGEND_HOVER = "description:legend:hover", e.DESCRIPTION_LEGEND_OUT = "description:legend:out", e.DESCRIPTION_BUTTONS_ADD_CLICK = "description:buttons:add:click", e.DESCRIPTION_FIELD_CLICK = "description:cell:click", e.DESCRIPTION_CELL_HOVER = "description:cell:hover", e.DESCRIPTION_CELL_OUT = "description:cell:out";
})(w || (w = {}));
var D;
(function(e) {
  e.INNER_RESIZE = "inner:resize", e.INNER_UPDATE = "inner:update";
})(D || (D = {}));
var R;
(function(e) {
  e.RENDER_ALL_START = "render:all:start", e.RENDER_ALL_END = "render:all:end", e.RENDER_GRID_START = "render:grid:start", e.RENDER_GRID_END = "render:grid:end", e.RENDER_X_HISTOGRAM_START = "render:x-histogram:start", e.RENDER_X_HISTOGRAM_END = "render:x-histogram:end", e.RENDER_Y_HISTOGRAM_START = "render:y-histogram:start", e.RENDER_Y_HISTOGRAM_END = "render:y-histogram:end", e.RENDER_X_DESCRIPTION_BLOCK_START = "render:x-description-block:start", e.RENDER_X_DESCRIPTION_BLOCK_END = "render:x-description-block:end", e.RENDER_Y_DESCRIPTION_BLOCK_START = "render:y-description-block:start", e.RENDER_Y_DESCRIPTION_BLOCK_END = "render:y-description-block:end";
})(R || (R = {}));
var Qe = (
  /** @class */
  function(e) {
    Y(t, e);
    function t() {
      return e.call(this) || this;
    }
    return t.getInstance = function() {
      return this.instance === null && (this.instance = new this()), this.instance;
    }, t.prototype.exposeEvents = function() {
      return Object.values(w);
    }, t.instance = null, t;
  }(ct)
), m = Qe.getInstance(), _;
(function(e) {
  e.Rows = "rows", e.Columns = "columns";
})(_ || (_ = {}));
var P;
(function(e) {
  e.Mutation = "mutation";
})(P || (P = {}));
var $e = (
  /** @class */
  function() {
    function e() {
      var t;
      this.minCellHeight = 10, this.prefix = "og-", this.lookupTable = {}, this.rowsOriginal = [], this.rows = [], this.columnsOriginal = [], this.columns = [], this.entries = [], this.customFunctions = (t = {}, t[_.Rows] = {
        opacity: function(i) {
          return 1;
        },
        fill: function(i) {
          return "black";
        }
      }, t[_.Columns] = {
        opacity: function(i) {
          return 1;
        },
        fill: function(i) {
          return "black";
        }
      }, t), this.rowsOrder = null, this.columnsOrder = null;
    }
    return e.prototype.setLookupTable = function(t) {
      this.lookupTable = t;
    }, e.prototype.setOptions = function(t) {
      var i = t.minCellHeight, n = t.prefix, r = t.rows, o = t.columns, s = t.entries, h = t.columnsFillFunc, a = t.rowsOpacityFunc, c = t.rowsFillFunc, u = t.columnsOpacityFunc;
      i !== void 0 && (this.minCellHeight = i), n !== void 0 && (this.prefix = n), r !== void 0 && (this.rowsOriginal = A([], r, !0), this.rows = r), o !== void 0 && (this.columnsOriginal = A([], o, !0), this.columns = o), s !== void 0 && (this.entries = s.map(function(f) {
        var d;
        return b(b({}, f), { type: (d = f.type) !== null && d !== void 0 ? d : "mutation" });
      })), c !== void 0 && (this.customFunctions[_.Rows].fill = c), a !== void 0 && (this.customFunctions[_.Rows].opacity = a), h !== void 0 && (this.customFunctions[_.Columns].fill = h), u !== void 0 && (this.customFunctions[_.Columns].opacity = u);
    }, e.prototype.reset = function() {
      this.rows = A([], this.rowsOriginal, !0), this.columns = A([], this.columnsOriginal, !0), this.rowsOrder = null, this.rowsPrevIndex = null, this.columnsOrder = null, this.columnsPrevIndex = null;
    }, e.getInstance = function() {
      return this.instance === null && (this.instance = new this()), this.instance;
    }, e.prototype.sortRows = function(t, i) {
      var n = this;
      t === void 0 && (t = "id"), i === void 0 && (i = null), (i === null || i === this.rowsPrevIndex) && (this.rowsOrder === null ? this.rowsOrder = "ASC" : this.rowsOrder = this.rowsOrder === "ASC" ? "DESC" : "ASC"), this.rowsPrevIndex = i, this.rows.sort(function(r, o) {
        var s, h, a = (s = i === null ? r[t] : r[t][i]) !== null && s !== void 0 ? s : "0", c = (h = i === null ? o[t] : o[t][i]) !== null && h !== void 0 ? h : "0";
        return a === c ? 0 : n.rowsOrder === "ASC" ? a < c ? 1 : -1 : a > c ? 1 : -1;
      });
    }, e.prototype.sortColumns = function(t, i) {
      var n = this;
      t === void 0 && (t = "id"), i === void 0 && (i = null), (i === null || i === this.columnsPrevIndex) && (this.columnsOrder === null ? this.columnsOrder = "ASC" : this.columnsOrder = this.columnsOrder === "ASC" ? "DESC" : "ASC"), this.columnsPrevIndex = i, this.columns.sort(function(r, o) {
        var s, h, a = (s = i === null ? r[t] : r[t][i]) !== null && s !== void 0 ? s : "0", c = (h = i === null ? o[t] : o[t][i]) !== null && h !== void 0 ? h : "0";
        return a === c ? 0 : n.columnsOrder === "ASC" ? a < c ? 1 : -1 : a > c ? 1 : -1;
      });
    }, e.instance = null, e;
  }()
), l = $e.getInstance(), je = (
  /** @class */
  function() {
    function e(t, i, n, r) {
      var o;
      this.rendered = !1, this.fields = [], this.collapsedFields = [], this.fieldsData = [], this.params = t, this.expandable = t.expandable, this.name = n, this.width = t.width, this.nullSentinel = t.nullSentinel || -777, this.rotated = r, this.drawGridLines = (o = t.grid) !== null && o !== void 0 ? o : !1, this.domain = t.domain, this.blockType = i, this.wrapper = T(t.wrapper || "body");
    }
    return e.prototype.setTransform = function(t, i) {
      this.container.attr("transform", "translate(".concat(t, ",").concat(i, ")"));
    }, e.prototype.addDescriptionFields = function(t) {
      for (var i = this, n = 0, r = t; n < r.length; n++) {
        var o = r[n];
        !this.rendered && o.collapsed && this.expandable ? this.collapsedFields.push(o) : this.fields.push(o);
      }
      this.collapsedFields = this.collapsedFields.filter(function(s) {
        return !i.fields.some(function(h) {
          return s.fieldName === h.fieldName;
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
          var s = o[r], h = n[s.fieldName], a = h === this.nullSentinel;
          this.fieldsData.push({
            id: n.id,
            displayId: (t = n.displayId) !== null && t !== void 0 ? t : this.rotated ? n.symbol : n.id,
            domainIndex: i,
            value: h,
            displayValue: a ? "Not Verified" : h,
            notNullSentinel: !a,
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
        m.emit(w.DESCRIPTION_LEGEND_HOVER, {
          target: i.target,
          group: t.name
        });
      }).on("mouseout", function() {
        m.emit(w.DESCRIPTION_LEGEND_OUT);
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
      for (var o = [], s = 0, h = this.fieldsData; s < h.length; s++) {
        var a = h[s], c = n[a.id];
        (c || c === 0) && (a.domainIndex = c, o.push(a));
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
      this.y = N().domain(L(this.fields.length).map(String)).range([0, n]), this.column && this.column.remove(), this.drawGridLines && (this.column = this.container.selectAll(".".concat(l.prefix, "column")).data(this.domain).enter().append("line").attr("class", "".concat(l.prefix, "column")).attr("column", function(a) {
        return a.id;
      }).attr("transform", function(a) {
        return "translate(".concat(t.rotated ? a.y : a.x, "),rotate(-90)");
      }).style("pointer-events", "none").attr("x1", -n)), this.row !== void 0 && this.row.remove(), this.row = this.container.selectAll(".".concat(l.prefix, "row")).data(this.fields).enter().append("g").attr("class", "".concat(l.prefix, "row")).attr("transform", function(a, c) {
        return "translate(0,".concat(t.y(String(c)), ")");
      }), this.drawGridLines && this.row.append("line").style("pointer-events", "none").attr("x2", this.width);
      var s = this.row.append("text");
      s.attr("class", "".concat(l.prefix, "track-label ").concat(l.prefix, "label-text-font")).attr("data-field", function(a) {
        return a.fieldName;
      }).on("click", function(a) {
        t.rotated ? l.sortRows(a.target.dataset.field) : l.sortColumns(a.target.dataset.field), m.emit(D.INNER_UPDATE, !1);
      }).transition().attr("x", -6).attr("y", o / 2).attr("dy", ".32em").attr("text-anchor", "end").text(function(a) {
        return a.name;
      }), this.expandable && setTimeout(function() {
        var a = "".concat(l.prefix, "remove-track");
        t.container.selectAll(".".concat(a)).remove();
        var c = {};
        s.each(function(u) {
          c[u.name] = u.getComputedTextLength();
        }), t.row.append("text").attr("class", a).text("-").attr("y", o / 2).attr("dy", ".32em").on("click", function(u, f) {
          t.removeField(f);
        }).attr("x", function(u) {
          return -(c[u.name] + 12 + u.getComputedTextLength());
        });
      });
      var h = this.container.selectAll(".".concat(l.prefix, "add-track"));
      this.collapsedFields.length && this.expandable ? (h.empty() && (h = this.container.append("text").text("+").attr("class", "".concat(l.prefix, "add-track")).attr("x", -6).attr("dy", ".32em").attr("text-anchor", "end").on("click", function() {
        m.emit(w.DESCRIPTION_BUTTONS_ADD_CLICK, {
          hiddenTracks: t.collapsedFields.slice(),
          addTrack: t.addDescriptionFields.bind(t)
        });
      })), h.attr("y", o / 2 + (r * o + this.y((r - 1).toString())))) : h.remove();
    }, e.prototype.setGridLines = function(t) {
      this.drawGridLines !== t && (this.drawGridLines = t, this.computeCoordinates());
    }, e.prototype.renderData = function() {
      for (var t = this, i = {}, n = 0; n < this.fields.length; n++)
        i[this.fields[n].fieldName] = n.toString();
      this.container.on("click", function(a) {
        var c = a.target, u = t.fieldsData[c.dataset.trackDataIndex];
        u && m.emit(w.DESCRIPTION_FIELD_CLICK, {
          target: c,
          domainId: u.id,
          type: t.rotated ? _.Rows : _.Columns,
          field: u.fieldName
        });
      }).on("mouseover", function(a) {
        var c = a.target, u = t.fieldsData[c.dataset.trackDataIndex];
        u && m.emit(w.DESCRIPTION_CELL_HOVER, {
          target: c,
          domainId: u.id,
          type: t.rotated ? _.Rows : _.Columns,
          field: u.fieldName
        });
      }).on("mouseout", function() {
        m.emit(w.DESCRIPTION_CELL_OUT);
      });
      var r = this.getFieldDimensions(), o = r.height, s = r.width, h = this.container.selectAll(".".concat(l.prefix, "track-data")).data(this.fieldsData);
      h.enter().append("rect").attr("data-track-data-index", function(a, c) {
        return c;
      }).attr("x", function(a) {
        var c, u = a.domainIndex, f = t.domain[u];
        return (c = t.rotated ? f.y : f.x) !== null && c !== void 0 ? c : 0;
      }).attr("y", function(a) {
        var c, u = a.fieldName;
        return (c = t.y(i[u])) !== null && c !== void 0 ? c : 0;
      }).attr("width", s).attr("height", o).attr("fill", l.customFunctions[this.blockType].fill).attr("opacity", l.customFunctions[this.blockType].opacity).attr("class", function(a) {
        var c = a.id, u = a.value, f = a.fieldName;
        return [
          "".concat(l.prefix, "track-data"),
          "".concat(l.prefix, "track-").concat(f),
          "".concat(l.prefix, "track-").concat(u),
          "".concat(l.prefix).concat(c, "-cell")
        ].join(" ");
      }), h.exit().remove();
    }, e;
  }()
), K = (
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
          var r = new je(t.getDescriptionFieldsGroupParams(t.isGroupExpandable(n)), t.blockType, n, t.rotated);
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
        var s = o[r], h = this.container.append("g").attr("transform", "translate(0," + this.parentHeight + ")");
        s.init(h), this.height += s.getTotalHeight() + n;
      }
      var a = this.rotated ? -(this.offset + this.parentHeight) : n + this.offset;
      this.container.attr("width", this.width).attr("height", this.height).attr("class", "".concat(l.prefix, "track")).attr("transform", function() {
        return "".concat(t.rotated ? "rotate(90) " : "", "translate(0,").concat(a, ")");
      }), this.height += i;
    }, e.prototype.render = function() {
      for (var t = 0, i = this.groups; t < i.length; t++) {
        var n = i[t];
        n.render();
      }
    }, e.prototype.resize = function(t, i, n) {
      var r = this;
      this.offset = n || this.offset, this.width = this.rotated ? i : t, this.parentHeight = 0;
      for (var o = this.rotated ? 16.5 : 0, s = this.getDimensions().padding, h = 0, a = this.groups; h < a.length; h++) {
        var c = a[h];
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
), X = (
  /** @class */
  function() {
    function e(t, i, n) {
      var r, o;
      this.padding = 10, this.centerText = -10, this.histogramHeight = 80, this.topCount = 1, this.container = null, this.lineWidthOffset = ((r = t.histogramBorderPadding) === null || r === void 0 ? void 0 : r.left) || 10, this.lineHeightOffset = ((o = t.histogramBorderPadding) === null || o === void 0 ? void 0 : o.bottom) || 5, this.svg = i, this.rotated = n || !1, this.domain = this.rotated ? l.rows : l.columns, this.margin = t.margin || { top: 15, right: 15, bottom: 15, left: 80 }, this.width = t.width || 500, this.height = t.height || 500, this.histogramWidth = this.rotated ? this.height : this.width, this.numDomain = this.domain.length, this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length, this.totalHeight = this.histogramHeight + this.lineHeightOffset + this.padding, this.wrapper = T(t.wrapper || "body");
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
        o && m.emit(w.HISTOGRAM_HOVER, {
          target: r,
          domainId: o.id,
          type: t.rotated ? _.Rows : _.Columns
        });
      }).on("mouseout", function() {
        m.emit(w.HISTOGRAM_OUT);
      }).on("click", function(n) {
        var r = n.target, o = t.domain[r.dataset.domainIndex];
        o && (t.rotated ? l.sortColumns("countByRow", o.id) : l.sortRows("countByColumn", o.id), m.emit(D.INNER_UPDATE, !1), m.emit(w.HISTOGRAM_CLICK, {
          target: r,
          domainId: o.id,
          type: t.rotated ? _.Rows : _.Columns
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
      }).transition().attr("width", this.barWidth - (this.barWidth < 3 ? 0 : 1)).attr("height", function(r) {
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
), ti = (
  /** @class */
  function() {
    function e(t, i, n) {
      var r, o;
      this.leftTextWidth = 80, this.types = [P.Mutation], this.colorMap = {
        missense_variant: "#ff9b6c",
        frameshift_variant: "#57dba4",
        stop_gained: "#af57db",
        start_lost: "#ff2323",
        stop_lost: "#d3ec00",
        initiator_codon_variant: "#5abaff"
      }, this.width = 500, this.height = 500, this.inputWidth = 500, this.inputHeight = 500, this.margin = { top: 30, right: 100, bottom: 15, left: 80 }, this.heatMap = !1, this.drawGridLines = !1, this.crosshair = !1, this.heatMapColor = "#D33682", this.fullscreen = !1, this.params = t, this.x = i, this.y = n, this.loadParams(t), this.createRowMap(), this.init();
      var s = this.getDescriptionBlockParams(), h = this.getHistogramParams();
      this.horizontalHistogram = new X(h, this.container, !1), this.horizontalDescriptionBlock = new K(s, _.Columns, this.container, !1, (r = t.columnFields) !== null && r !== void 0 ? r : [], this.height + 10), this.horizontalDescriptionBlock.init(), this.verticalHistogram = new X(h, this.container, !0), this.verticalDescriptionBlock = new K(s, _.Rows, this.container, !0, (o = t.rowFields) !== null && o !== void 0 ? o : [], this.width + 10 + this.verticalHistogram.getHistogramHeight() + 10 + l.minCellHeight * this.types.length), this.verticalDescriptionBlock.init();
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
      var i = t.leftTextWidth, n = t.wrapper, r = t.colorMap, o = t.width, s = t.height, h = t.margin, a = t.heatMap, c = t.heatMapColor, u = t.grid;
      i !== void 0 && (this.leftTextWidth = i), this.wrapper = T(n || "body"), r !== void 0 && (this.colorMap = r), o !== void 0 && (this.inputWidth = o), s !== void 0 && (this.inputHeight = s), this.initDimensions(o, s), h !== void 0 && (this.margin = h), a !== void 0 && (this.heatMap = a), u !== void 0 && (this.drawGridLines = u), c !== void 0 && (this.heatMapColor = c);
    }, e.prototype.init = function() {
      this.svg = this.wrapper.append("svg").attr("class", "".concat(l.prefix, "maingrid-svg")).attr("id", "".concat(l.prefix, "maingrid-svg")).attr("width", "100%"), this.container = this.svg.append("g"), this.background = this.container.append("rect").attr("class", "".concat(l.prefix, "background")).attr("width", this.width).attr("height", this.height), this.gridContainer = this.container.append("g");
    }, e.prototype.render = function() {
      var t = this;
      m.emit(R.RENDER_GRID_START), this.computeCoordinates(), this.svg.on("mouseover", function(i) {
        var n = i.target, r = G(i, n), o = t.getIndexFromScaleBand(t.x, r[0]), s = t.getIndexFromScaleBand(t.y, r[1]);
        if (!(!n.dataset.obsIndex || t.crosshair)) {
          var h = n.dataset.obsIndex.split(" "), a = l.entries.filter(function(u) {
            return u.columnId === h[0] && u.rowId === h[1];
          }), c = a.find(function(u) {
            return u.id == h[2];
          });
          m.emit(w.GRID_CELL_HOVER, {
            target: n,
            entryIds: a.map(function(u) {
              return u.id;
            }),
            entryId: c.id,
            columnId: l.columns[o].id,
            rowId: l.rows[s].id
          });
        }
      }), this.svg.on("mouseout", function() {
        m.emit(w.GRID_OUT);
      }), this.svg.on("click", function(i) {
        var n, r = (n = i.target.dataset.obsIndex) === null || n === void 0 ? void 0 : n.split(" ");
        r && m.emit(w.GRID_CELL_CLICK, {
          target: i.target,
          columnId: r[0],
          rowId: r[1],
          entryId: r[2]
        });
      }), this.container.selectAll(".".concat(l.prefix, "maingrid-svg")).data(l.entries).enter().append("path").attr("data-obs-index", function(i) {
        return "".concat(i.columnId, " ").concat(i.rowId, " ").concat(i.id);
      }).attr("class", function(i) {
        return "".concat(l.prefix, "sortable-rect ").concat(l.prefix).concat(i.columnId, "-cell ").concat(l.prefix).concat(i.rowId, "-cell");
      }).attr("cons", function(i) {
        return t.getValueByType(i);
      }).attr("d", function(i) {
        return t.getRectangularPath(i);
      }).attr("fill", function(i) {
        return t.getColor(i);
      }).attr("opacity", function(i) {
        return t.getOpacity(i);
      }), m.emit(R.RENDER_GRID_END), l.entries.length && (m.emit(R.RENDER_X_HISTOGRAM_START), this.horizontalHistogram.render(), m.emit(R.RENDER_X_HISTOGRAM_END), m.emit(R.RENDER_Y_HISTOGRAM_START), this.verticalHistogram.render(), m.emit(R.RENDER_Y_HISTOGRAM_END)), m.emit(R.RENDER_X_DESCRIPTION_BLOCK_START), this.horizontalDescriptionBlock.render(), m.emit(R.RENDER_X_DESCRIPTION_BLOCK_END), m.emit(R.RENDER_Y_DESCRIPTION_BLOCK_START), this.verticalDescriptionBlock.render(), m.emit(R.RENDER_Y_DESCRIPTION_BLOCK_END), this.defineCrosshairBehaviour(), this.resizeSvg();
    }, e.prototype.update = function(t, i) {
      var n = this;
      this.computeCoordinates(), this.createRowMap(), this.x = t, this.y = i, this.row.selectAll("text").attr("style", function() {
        return n.cellHeight < l.minCellHeight ? "display: none;" : "";
      }), this.row.transition().attr("transform", function(r) {
        return "translate( 0, " + r.y + ")";
      }), this.container.selectAll(".".concat(l.prefix, "sortable-rect")).transition().attr("d", function(r) {
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
        s && m.emit(w.GRID_LABEL_HOVER, {
          target: o,
          rowId: s
        });
      }).on("click", function(r) {
        var o = r.target, s = o.dataset.row;
        s && (l.sortColumns("countByRow", s), m.emit(D.INNER_UPDATE, !1), m.emit(w.GRID_LABEL_CLICK, {
          target: o,
          rowId: s
        }));
      });
    }, e.prototype.initDimensions = function(t, i) {
      t !== void 0 && (this.width = t), i !== void 0 && (this.height = i), this.cellWidth = this.width / l.columns.length, this.cellHeight = this.height / l.rows.length, this.cellHeight < l.minCellHeight && (this.cellHeight = l.minCellHeight, this.height = l.rows.length * l.minCellHeight);
    }, e.prototype.resize = function(t, i, n, r) {
      this.createRowMap(), this.x = n, this.y = r, this.initDimensions(t, i), this.background.attr("width", this.width).attr("height", this.height), this.computeCoordinates(), l.entries.length && (this.horizontalHistogram.resize(t, this.height), this.verticalHistogram.resize(t, this.height));
      var o = this.horizontalHistogram.getHistogramHeight();
      this.horizontalDescriptionBlock.resize(t, this.height, this.height), this.verticalDescriptionBlock.resize(t, this.height, this.width + o + 120), this.resizeSvg(), this.update(this.x, this.y), this.verticalCross.attr("y2", this.height + this.horizontalDescriptionBlock.height), this.horizontalCross.attr("x2", this.width + o * this.types.length + this.verticalDescriptionBlock.height);
    }, e.prototype.resizeSvg = function() {
      var t = this.horizontalHistogram.getHistogramHeight(), i = this.margin.left + this.leftTextWidth + this.width + t * this.types.length + this.verticalDescriptionBlock.height + this.margin.right, n = this.margin.top + 10 + t + 10 + this.height + this.horizontalDescriptionBlock.height + this.margin.bottom;
      this.svg.attr("width", i).attr("height", n).attr("viewBox", "0 0 ".concat(i, " ").concat(n)), this.container.attr("transform", "translate(" + (this.margin.left + this.leftTextWidth) + "," + (this.margin.top + t * this.types.length + 10) + ")");
    }, e.prototype.defineCrosshairBehaviour = function() {
      var t = this, i = function(r, o) {
        if (t.crosshair) {
          var s = G(o, o.target);
          t.verticalCross.attr("x1", s[0]).attr("opacity", 1), t.verticalCross.attr("x2", s[0]).attr("opacity", 1), t.horizontalCross.attr("y1", s[1]).attr("opacity", 1), t.horizontalCross.attr("y2", s[1]).attr("opacity", 1), r === "mousemove" && t.selectionRegion !== void 0 && t.changeSelection(s);
          var h = t.width < s[0] ? -1 : t.getIndexFromScaleBand(t.x, s[0]), a = t.height < s[1] ? -1 : t.getIndexFromScaleBand(t.y, s[1]), c = l.columns[h], u = l.rows[a];
          if (!c || !u)
            return;
          r === "mouseover" && m.emit(w.GRID_CROSSHAIR_HOVER, {
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
        t.crosshair && (t.verticalCross.attr("opacity", 0), t.horizontalCross.attr("opacity", 0), m.emit(w.GRID_CROSSHAIR_OUT));
      }).on("mouseup", function(r) {
        t.verticalCross.attr("opacity", 0), t.horizontalCross.attr("opacity", 0), t.finishSelection(r);
      });
    }, e.prototype.startSelection = function(t) {
      if (this.crosshair && this.selectionRegion === void 0) {
        t.stopPropagation();
        var i = G(t, t.target);
        m.emit(w.GRID_SELECTION_STARTED, {
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
        var i = Number(this.selectionRegion.attr("x")), n = i + Number(this.selectionRegion.attr("width")), r = Number(this.selectionRegion.attr("y")), o = r + Number(this.selectionRegion.attr("height")), s = this.getIndexFromScaleBand(this.x, i), h = this.getIndexFromScaleBand(this.x, n), a = this.getIndexFromScaleBand(this.y, r), c = this.getIndexFromScaleBand(this.y, o);
        this.sliceColumns(parseInt(s), parseInt(h)), this.sliceRows(parseInt(a), parseInt(c)), this.selectionRegion.remove(), delete this.selectionRegion, m.emit(w.GRID_SELECTION_FINISHED, {
          target: t.target,
          x: n,
          y: o
        }), m.emit(D.INNER_UPDATE, !0);
      }
    }, e.prototype.sliceRows = function(t, i) {
      for (var n = 0; n < l.rows.length; n++) {
        var r = l.rows[n];
        (n < t || n > i) && (H(".".concat(l.prefix).concat(r.id, "-cell")).remove(), H(".".concat(l.prefix).concat(r.id, "-bar")).remove(), l.rows.splice(n, 1), n--, t--, i--);
      }
    }, e.prototype.sliceColumns = function(t, i) {
      for (var n = 0; n < l.columns.length; n++) {
        var r = l.columns[n];
        (n < t || n > i) && (H(".".concat(l.prefix).concat(r.id, "-cell")).remove(), H(".".concat(l.prefix).concat(r.id, "-bar")).remove(), l.columns.splice(n, 1), n--, t--, i--);
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
      var h = l.lookupTable[o][r];
      return h.length === 0 ? s : s + this.cellHeight / h.length * h.indexOf(n);
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
      return t === this.heatMap ? this.heatMap : (this.heatMap = t, H(".".concat(l.prefix, "sortable-rect")).transition().attr("d", function(n) {
        return i.getRectangularPath(n);
      }).attr("fill", function(n) {
        return i.getColor(n);
      }).attr("opacity", function(n) {
        return i.getOpacity(n);
      }), this.heatMap);
    }, e.prototype.setGridLines = function(t) {
      return this.drawGridLines === t ? this.drawGridLines : (this.drawGridLines = t, this.verticalDescriptionBlock.setGridLines(this.drawGridLines), this.horizontalDescriptionBlock.setGridLines(this.drawGridLines), this.computeCoordinates(), this.drawGridLines);
    }, e.prototype.setCrosshair = function(t) {
      return this.crosshair = t, this.crosshair;
    }, e.prototype.destroy = function() {
      this.wrapper.select(".".concat(l.prefix, "maingrid-svg")).remove();
    }, e;
  }()
), ei = (
  /** @class */
  function(e) {
    Y(t, e);
    function t(i) {
      var n, r, o = e.call(this) || this;
      return o.heatMapMode = !1, o.drawGridLines = !1, o.crosshairMode = !1, o.charts = [], o.fullscreen = !1, l.setOptions(i), o.params = i, o.width = (n = i.width) !== null && n !== void 0 ? n : 500, o.height = (r = i.height) !== null && r !== void 0 ? r : 500, o.height / l.rows.length < l.minCellHeight && (o.height = l.rows.length * l.minCellHeight), i.wrapper = ".".concat(l.prefix, "container"), o.container = T(i.element || "body").append("div").attr("class", "".concat(l.prefix, "container")).style("position", "relative"), o.initCharts(), m.exposeEvents().forEach(function(s) {
        m.on(s, function(h) {
          return o.emit(s, h);
        });
      }), o;
    }
    return t.create = function(i) {
      return new t(i);
    }, t.prototype.initCharts = function(i) {
      var n = this;
      this.createLookupTable(), this.computeColumnCounts(), this.computeRowCounts(), this.computeRowScoresAndCount(), this.rowsSortByScores(), this.computeScores(), this.sortByScores(), this.calculatePositions(), i && (this.params.width = this.width, this.params.height = this.height), this.mainGrid = new ti(this.params, this.x, this.y), m.off(D.INNER_RESIZE), m.off(D.INNER_UPDATE), m.on(D.INNER_RESIZE, function() {
        n.resize(n.width, n.height, n.fullscreen);
      }), m.on(D.INNER_UPDATE, function(r) {
        n.update(r);
      }), this.heatMapMode = this.mainGrid.heatMap, this.drawGridLines = this.mainGrid.drawGridLines, this.crosshairMode = this.mainGrid.crosshair, this.charts = [], this.charts.push(this.mainGrid);
    }, t.prototype.calculatePositions = function() {
      for (var i, n = N().domain(L(l.columns.length).map(String)).range([0, this.width]), r = N().domain(L(l.rows.length).map(String)).range([0, this.height]), o = 0; o < l.columns.length; o++) {
        var s = l.columns[o], h = s.id, a = n(String(o));
        s.x = a, l.lookupTable[h] = l.lookupTable[h] || {}, l.lookupTable[h].x = a;
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
    }, t.prototype.update = function(i) {
      var n = this;
      i === void 0 && (i = !1), i && (this.computeScores(), this.sortByScores()), this.calculatePositions(), this.charts.forEach(function(r) {
        r.update(n.x, n.y);
      });
    }, t.prototype.resize = function(i, n, r) {
      var o = this;
      this.fullscreen = r, this.mainGrid.fullscreen = r, this.width = Number(i), this.height = Number(n), this.height / l.rows.length < l.minCellHeight && (this.height = l.rows.length * l.minCellHeight), this.calculatePositions(), this.charts.forEach(function(s) {
        s.fullscreen = r, s.resize(o.width, o.height, o.x, o.y);
      });
    }, t.prototype.sortByScores = function() {
      l.columns.sort(this.sortScore);
    }, t.prototype.rowsSortByScores = function() {
      l.rows.sort(this.sortScore);
    }, t.prototype.cluster = function() {
      this.rowsSortByScores(), this.computeScores(), this.sortByScores(), this.update(!1);
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
    }, t.prototype.mutationScore = function(i, n) {
      var r, o;
      return ((o = (r = l.lookupTable) === null || r === void 0 ? void 0 : r[i]) === null || o === void 0 ? void 0 : o[n]) !== void 0 ? 1 : 0;
    }, t.prototype.mutationRowScore = function(i, n) {
      var r, o;
      if (((o = (r = l.lookupTable) === null || r === void 0 ? void 0 : r[i]) === null || o === void 0 ? void 0 : o[n]) !== void 0) {
        var s = l.lookupTable[i][n];
        return s.length;
      } else
        return 0;
    }, t.prototype.computeScores = function() {
      for (var i = 0, n = l.columns; i < n.length; i++) {
        var r = n[i];
        r.score = 0;
        for (var o = 0; o < l.rows.length; o++) {
          var s = l.rows[o];
          r.score += this.mutationScore(r.id, s.id) * Math.pow(2, l.rows.length + 1 - o);
        }
      }
    }, t.prototype.computeRowScoresAndCount = function() {
      for (var i = 0, n = l.rows; i < n.length; i++) {
        var r = n[i];
        r.score = 0;
        for (var o = 0, s = l.columns; o < s.length; o++) {
          var h = s[o];
          r.score += this.mutationRowScore(h.id, r.id);
        }
        r.count = r.score;
      }
    }, t.prototype.computeColumnCounts = function() {
      for (var i, n = 0, r = l.columns; n < r.length; n++) {
        var o = r[n], s = Object.values((i = l.lookupTable[o.id]) !== null && i !== void 0 ? i : {});
        o.count = 0;
        for (var h = 0, a = s; h < a.length; h++) {
          var c = a[h];
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
          var h = s[o];
          r.id === h.rowId && (r.count++, r.countByColumn[h.columnId] === void 0 && (r.countByColumn[h.columnId] = 0), r.countByColumn[h.columnId]++);
        }
      }
    }, t.prototype.sortScore = function(i, n) {
      return i.score < n.score ? 1 : i.score > n.score ? -1 : i.id >= n.id ? 1 : -1;
    }, t.prototype.destroy = function() {
      this.charts.forEach(function(i) {
        i.destroy();
      }), this.container.remove();
    }, t.prototype.reload = function() {
      this.charts.forEach(function(i) {
        i.destroy();
      }), l.reset(), this.container = T(this.params.element || "body").append("div").attr("class", "".concat(l.prefix, "container")).style("position", "relative"), this.initCharts(!0), this.render();
    }, t;
  }(ct)
);
export {
  ei as default
};
//# sourceMappingURL=event-matrix.es.js.map
