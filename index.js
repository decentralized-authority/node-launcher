const { range } = require('lodash');
const nr = require('./lib');
const { timeout } = require('./lib/util');
const dataDir = '/home/dev/near/data';
const configDir = '/home/dev/near';
const walletDir = '/home/dev/near/keystore';
const bitcoin = new nr.NEAR({'dataDir': dataDir,
                            'configDir': configDir,
                            'walletDir': walletDir});

// Listen for events
bitcoin
  .on(nr.constants.NodeEvent.OUTPUT, console.log)
  .on(nr.constants.NodeEvent.ERROR, console.error)
  .on(nr.constants.NodeEvent.CLOSE, code => console.log(`Exited with code ${code}.`));
console.log(bitcoin.generateConfig());
console.log(bitcoin.rpcGetVersion());

// Start node
bitcoin.start();

setTimeout(() => {

 console.log('Stopped!')
 console.log(bitcoin.rpcGetVersion());

}, 10000);
// await timeout(60000 * 0.1);
console.log('HERE');
console.log(bitcoin.rpcGetVersion());
// // a=1000000000;
// // b=1000000000;
// // while (a > 1){
// //   a = a - 1;
// //   while(b > 1){
// //     b = b - 1;
// //   }
// //   console.log(bitcoin.rpcGetVersion());
// // }
//console.log('hereeee');
//console.log(bitcoin.rpcGetVersion());
//console.log('heereeeee');


setTimeout(() => {
  bitcoin.stop()
    .then(() => console.log('Stopped!'))
    .catch(console.error);
}, 30000000);
