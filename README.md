# Node Launcher
Programmatically create, start, and stop crypto nodes in Node JS using Docker. Check out our [video demo](https://www.youtube.com/watch?v=T9Lm0iShA0I).

## Getting Started

### Install Docker
https://docs.docker.com/engine/install/

#### Clone the library
```bash
$ git clone https://github.com/decentralized-authority/node-launcher.git
$ cd node-launcher
```

#### Build the library
```bash
$ npm install
$ npm run build
```

#### Try it out!
```js
// Start a mainnet node
const nr = require('[path to node-launcher]/lib');

const bitcoin = new nr.BTC({});

// Listen for events
bitcoin
  .on(nr.constants.NodeEvent.OUTPUT, console.log)
  .on(nr.constants.NodeEvent.ERROR, console.error)
  .on(nr.constants.NodeEvent.CLOSE, code => console.log(`Exited with code ${code}.`));

// Start node
bitcoin.start();
```

```js
// Start a mainnet node and stop it after thirty seconds
const nr = require('[path to node-launcher]/lib');

const bitcoin = new nr.BTC({});

// Listen for events
bitcoin
  .on(nr.constants.NodeEvent.OUTPUT, console.log)
  .on(nr.constants.NodeEvent.ERROR, console.error)
  .on(nr.constants.NodeEvent.CLOSE, code => console.log(`Exited with code ${code}.`));

// Start node
bitcoin.start();

setTimeout(() => {
  bitcoin.stop()
    .then(() => console.log('Stopped!'))
    .catch(console.error);
}, 30000);
```

```js
// Start a testnet node
const nr = require('[path to node-launcher]/lib');
const { NetworkType } = nr.constants;

const bitcoin = new nr.BTC({
  network: NetworkType.TESTNET
});

// Listen for events
bitcoin
  .on(nr.constants.NodeEvent.OUTPUT, console.log)
  .on(nr.constants.NodeEvent.ERROR, console.error)
  .on(nr.constants.NodeEvent.CLOSE, code => console.log(`Exited with code ${code}.`));

// Start node
bitcoin.start();
```

```js
// Start a testnet node and persist data
const fs = require('fs-extra');
const path = require('path');
const nr = require('[path to node-launcher]/lib');
const { NetworkType } = nr.constants;

const rootPath = path.join(process.env.HOME, 'my-bitcoin-node');
const nodeJsonPath = path.join(rootPath, 'node.json');

let bitcoin;
if(fs.pathExistsSync(nodeJsonPath)) { // start using previous configuration and data

  bitcoin = new nr.BTC(fs.readJsonSync(nodeJsonPath));
  
} else { // start and persist configuration and data

  // Create local data paths
  const dataDir = path.join(rootPath, 'data');
  const walletDir = path.join(rootPath, 'wallets');
  [rootPath, dataDir, walletDir].forEach(dir => fs.ensureDirSync(dir));
  const configPath = path.join(rootPath, 'bitcoin.config');

  // Create node
  bitcoin = new nr.BTC({
    id: 'my-bitcoin-node',
    network: NetworkType.TESTNET,
    dataDir,
    walletDir,
    configPath
  });
  // Persist node data
  fs.writeJsonSync(nodeJsonPath, bitcoin.toObject(), {spaces: 2});
}

// Listen for events
bitcoin
  .on(nr.constants.NodeEvent.OUTPUT, console.log)
  .on(nr.constants.NodeEvent.ERROR, console.error)
  .on(nr.constants.NodeEvent.CLOSE, code => console.log(`Exited with code ${code}.`));

// Start node
bitcoin.start();
```

```js
// use the rpcGetVersion() method to get the node client version and test that the RPC server is live
const nr = require('[path to node-launcher]/lib');

const bitcoin = new nr.BTC({});

// Listen for events
bitcoin
  .on(nr.constants.NodeEvent.OUTPUT, console.log)
  .on(nr.constants.NodeEvent.ERROR, console.error)
  .on(nr.constants.NodeEvent.CLOSE, code => console.log(`Exited with code ${code}.`));

// Start node
bitcoin.start();

// get the client version from the live RPC server
setTimeout(() => {
  bitcoin.rpcGetVersion()
    .then(console.log)
    .catch(console.error);
}, 10000);
```

## Roadmap
* Add support for Ethereum, Pocket, and many other chains
* Use event listeners rather than callbacks to subscribe to node output and errors
* Create standard methods for getting memory usage and other metadata including block height and sync status
* Publish comprehensive API docs
* Reach 100% test coverage

## Contributions
Contributions are welcome! If you have any issues and/or contributions you would like to make, feel free to file an issue and/or issue a pull request.

## License
Apache License Version 2.0

Copyright (c) 2021 by Ryan Burgett.
