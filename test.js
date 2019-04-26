

const assert = require('assert');
const evbus = require('.');

let bus, res


bus = evbus();
res = [];

bus.on('tom', _ => res.push('tom'))
	.on('jack', _ => res.push('jack'))
	.on('lucy', _ => res.push('lucy'))


bus.trigger('tom');
assert.equal(res.join('|'), 'tom');

bus.trigger('jack');
assert.equal(res.join('|'), 'tom|jack');

bus.trigger('lucy');
assert.equal(res.join('|'), 'tom|jack|lucy');


bus.off('lucy');
bus.trigger('lucy');
assert.equal(res.join('|'), 'tom|jack|lucy');


bus.trigger('jack     tom   ');
assert.equal(res.join('|'), 'tom|jack|lucy|jack|tom');

bus.clear();
bus.trigger('tom');
assert.equal(res.join('|'), 'tom|jack|lucy|jack|tom');

console.log('single event test passed!');



bus = evbus();
res = [];

bus.on('tom', _ => res.push('tom'))
	.on('tom.and', _ => res.push('and'))
	.on('tom.and.lucy', _ => res.push('lucy'))
	.on('tom.and.lucy.is', _ => res.push('is'))
	.on('tom.and.lucy.is.best', _ => res.push('best'))
	.on('tom.and.lucy.is.best.friends', _ => res.push('friends'))
	.on('jack', _ => res.push('jack'))

bus.trigger('tom.and.lucy.is.best.friends');
assert.equal(res.join('|'), 'friends|best|is|lucy|and|tom');


res = [];
bus.off('tom.and.lucy.is');

bus.trigger('tom.and.lucy.is.best');
assert.equal(res.join('|'), '');

bus.trigger('tom.and.lucy');
assert.equal(res.join('|'), 'lucy|and|tom');


res = [];
assert.throws(_ => {
	bus.on('steve.and.tony');
	bus.trigger('steve.and.tony');
}, err => {
	if (err.message === 'The second argument of Event.on must be a function!') return true;
});


res = [];
bus.on('steve.and.tony', d => res.push(d));
bus.trigger('steve.and.tony', 1);
assert.equal(res.join('|'), '1');

bus.on('steve', d => res.push(d + '-steve'));
bus.trigger('steve.and.tony', 2);
assert.equal(res.join('|'), '1|2|2-steve');
console.log('hierachical events test passed!');



bus = evbus();

assert.throws(_ => {
	bus.trigger('', 123);
}, err => {
	if (err.message.indexOf('The type should be such as') > -1) return true;
});


res = [];
bus.on('a.b a.b.c x.y.z', d => res.push(d + '+'));
bus.on('a.b.c.d e.f x.y', d => res.push(d + '-'));
bus.trigger('a.b.c.d x.y', 3);
assert.equal(res.join('|'), '3-|3+|3+|3-');

res = [];
bus.off('a.b.c x.y.z');
bus.trigger('a.b.c.d x.y', 4);
assert.equal(res.join('|'), '4-');

res = [];
bus.trigger('a.b', 5);
assert.equal(res.join('|'), '5+');
console.log('whitespace delimiter test passed!');















