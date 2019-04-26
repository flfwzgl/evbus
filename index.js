/**
 * evbox
 * created by flfwzgl
 */


;(function (factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    window.evbus = factory();
  }
})(function () {
  var slice = [].slice;
  var toStr = ({}).toString;

  function add (e, str) {
    str = str || '';
    return str.split('.').reduce(function (p, k) {
      return p[k] || (p[k] = {});
    }, e);
  }

  function get (e, str) {
    if (str === '') return e;
    var arr = str.split('.'), k;
    for (var i = 0, l = arr.length; i < l; i++) {
      k = arr[i];
      e = e[k];
      if (!e) return e;
    }
    return e;
  }

  function isObj (e) {
    return toStr.call(e) === '[object Object]';
  }

  function each (list, fn) {
    if (!list || typeof fn !== 'function') return;
    for (var i = 0, l = list.length; i < l; i++) {
      fn.call(list, list[i], i, list);
    }
  }

  function indexOf (list, e) {
    if (!list || e === undefined) return;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i] === e) return i;
    }
    return -1;
  }

  function rmfn (e, fn) {
    var i, v;

    for (var name in e) {
      if (!e.hasOwnProperty(name)) continue;

      v = e[name];
      if (name === '$list') {
        i = indexOf(v, fn);
        ~i && v.splice(i, 1);
      } else if (isObj(v)) {
        rmfn(v, fn);
      }
    }
  }

  function trigger (e, types, args) {
    if (!types) return;

    var list, k, l;

    k = types[0];
    e = e[k];
    l = types.length;

    if (e) {
      types.shift();
      l && trigger(e, types, args);

      if (!types.length) {
        e.$list && each(e.$list, function (fn) {
          fn.apply(null, args);
        });
      }
    }
  }

  function bind (e, type, fn) {
    e = add(e, type);
    var list = e.$list;

    list
      ? list.push(fn)
      : e.$list = [fn];
  }

  function unbind (e, type, fn) {
    var arr = type.split('.')
      , k = arr.pop()
      , pk = arr.join('.')

    e = get(e, pk);
    if (!e) return;

    if (fn === undefined) {
      delete e[k];
    } else if (typeof fn === 'function') {
      rmfn(e[k], fn);
    }
  }

  var char = '[\\w\\-]'
    , typeStr = '^\\s*' + char + '+(\\.' + char + '+)*(\\s+' + char + '+(\\.' + char + '+)*)*\\s*$'

  var rtype = new RegExp(typeStr);
  var TYPE_ERR_MSG = 'The type should be such as "world", "world.asia", "world.asia.china africa", "." stands for hierarchy, and whitespaces stand for event delimiter';

  function Event () {
    if (!(this instanceof Event)) return new Event();
    this._evbus = {};
  }

  Event.prototype.on = function (type, fn) {
    if (typeof type !== 'string') throw new TypeError('The type must be a string!');
    if (!rtype.test(type)) throw new Error(TYPE_ERR_MSG);
    if (typeof fn !== 'function') throw new TypeError('The second argument of Event.on must be a function!');

    var types = type.trim().split(/\s+/);
    var bus = this._evbus;
    each(types, function (type) {
      bind(bus, type, fn);
    });
    return this;
  }

  Event.prototype.off = function (type, fn) {
    if (typeof type !== 'string') throw new TypeError('The type must be a string!');
    if (!rtype.test(type)) throw new Error(TYPE_ERR_MSG);

    var types = type.trim().split(/\s+/);
    var bus = this._evbus;

    each(types, function (type) {
      unbind(bus, type, fn);
    });
    return this;
  }

  Event.prototype.trigger = Event.prototype.emit = function (type) {
    if (typeof type !== 'string') throw new TypeError('The type must be a string!');
    if (!rtype.test(type)) throw new Error(TYPE_ERR_MSG);

    var args = slice.call(arguments, 1);
    var types = type.trim().split(/\s+/);
    var bus = this._evbus;

    each(types, function (type) {
      trigger(bus, type.split('.'), args);
    });
    return this;
  }

  Event.prototype.clear = function () {
    this._evbus = {};
  }

  return Event;
});




