/**
 * evbox
 * created by flfwzgl
 */

var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;

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

function rmfn (e, fn) {
  var i, v;

  for (var name in e) {
    if (!e.hasOwnProperty(name)) continue;

    v = e[name];
    if (name === '$list') {
      i = v.indexOf(fn);
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
      e.$list && e.$list.forEach(function (fn) {
        fn.apply(null, args);
      });
    }
  }
}


function Event () {
  if (!(this instanceof Event)) return new Event();
  this._evbus = {};
}

Event.prototype.on = function (type, fn) {
  if (typeof type !== 'string') throw new TypeError('The type must be a string!');
  if (!/^[\w+.]+$/i.test(type)) throw new Error('The event type must only contain characters such as "a-z, 0-9, _, ."');
  if (typeof fn !== 'function') throw new TypeError('The second argument of Event.on must be a function!');

  var e = add(this._evbus, type);
  var list = e.$list;

  list
    ? list.push(fn)
    : e.$list = [fn];

  return this;
}

Event.prototype.off = function (type, fn) {
  if (typeof type !== 'string') throw new TypeError('The type must be a string!');
  if (!/^[\w+.]+$/i.test(type)) throw new Error('The event type must only contain characters such as "a-z, 0-9, _, ."');

  var arr = type.split('.')
    , k = arr.pop()
    , pk = arr.join('.')

  var e = get(this._evbus, pk);
  if (!e) return;

  if (fn == null) {
    delete e[k];
  } else if (typeof fn === 'function') {
    rmfn(e[k], fn);
  } else {
    return;
  }

  return this;
}

Event.prototype.trigger = Event.prototype.emit = function (type) {
  if (typeof type !== 'string') throw new TypeError('The type must be a string!');
  if (!/^[\w+.]+$/i.test(type)) throw new Error('The event type must only contain characters such as "a-z, 0-9, _, ."');

  var args = slice.call(arguments, 1);
  trigger(this._evbus, type.split('.'), args);
  return this;
}

Event.prototype.clear = function () {
  this._evbus = {};
}


module.exports = Event;


