# pro-event-bus-ts

## npm install

```javascript
 npm i pro-event-bus-ts
```

## node

```javascript
const ProEventBus = require('pro-event-bus-ts')

const eventBus = new ProEventBus()

eventBus.on('test', () => {
    console.log('test pro-event-bus');
})

eventBus.once('once', () => {
    console.log('test pro-event-bus-once');
})

eventBus.emit('test')
eventBus.emit('test')
eventBus.emit('once')
eventBus.emit('once')

eventBus.offAll()
eventBus.emit('test')

/* 
    test pro-event-bus
    test pro-event-bus     
    test pro-event-bus-once
*/
```

## web

```javascript
<script src="./pro-event-bus/index.js"></script>
// https://cdn.jsdelivr.net/npm/pro-event-bus-ts@1.0.0/index.js
<script>
    const eventBus = new ProEventBus()

    eventBus.on('test', () => {
        console.log('test pro-event-bus');
    })

    eventBus.once('once', () => {
        console.log('test pro-event-bus-once');
    })

    eventBus.emit('test')
    eventBus.emit('test')
    eventBus.emit('once')
    eventBus.emit('once')

    eventBus.offAll()
    eventBus.emit('test')

    /*
        ② test pro-event-bus
        test pro-event-bus-once
    */
</script>
```

## API

#### on

#### once

#### off

#### offAll

#### emit