
# evbus

Hierarchical event library written in javascript, no dependencies

### Installation

```bash
npm i -S evbus
```

### Usage

##### Hierarchical event
``` javascript
const evbus = require('evbus');

let bus = evbus(); // or new evbus();

bus.on('world', d => console.log(d + '-world'))
	.on('world.asia', d => console.log(d + '-asia'))
	.on('world.asia.china', d => console.log(d + '-china'))
	.on('world.asia.china.beijing', d => console.log(d + '-beijing'))


bus.trigger('world.asia.china.beijing', 1);

'1-beijing'
'1-china'
'1-asia'
'1-world'

bus.off('world.asia.china');	// delete world.asia.china and world.asia.china.beijing
bus.trigger('world.asia.china.beijing', 2);

// so there is no operation



bus.trigger('world.asia', 2);
'2-asia'
'2-world'
```

##### Multiple event
``` javascript
const evbus = require('evbus');

let bus = evbus(); // or new evbus();

bus.on('a.b.c x.y', d => console.log(d))

bus.trigger('a.b.c x.y', 123);

123
123
```