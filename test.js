

const should = require('should');
const evbus = require('.');

let bus = evbus();

/**
 * single event type bind
 * 简单事件绑定
 */
console.log('single event type test...');

let res = [];
bus.on('tom', d => res.push({data: d, type: 'tom'}))
	.on('jack', d => res.push({data: d, type: 'jack'}))
	.on('lucy', d => res.push({data: d, type: 'lucy'}))


bus.trigger('tom', 0);
should(res[0]).be.a.Object();
should(res[0]).have.property('data', 0)
should(res[0]).have.property('type', 'tom');
should.not.exist(res[1]);

bus.trigger('jack', 1);
should(res[1]).be.a.Object();
should(res[1]).have.property('data', 1)
should(res[1]).have.property('type', 'jack');
should.not.exist(res[2]);

bus.trigger('lucy', 2);
should(res[2]).be.a.Object();
should(res[2]).have.property('data', 2)
should(res[2]).have.property('type', 'lucy');
should.not.exist(res[3]);


bus.off('lucy');
console.log(bus._evbus)
bus.trigger('lucy', 3);
should.not.exist(res[3]);

bus.trigger('jack', 3);
should(res[3]).be.a.Object().and.have.property('data', 3);

console.log('single event type test passed!\n');






/**
 * hierachical event type bind
 * 层级事件绑定
 */
// console.log('hierachical event type bind');
