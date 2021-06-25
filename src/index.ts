import { Bitcoin } from './types/bitcoin/bitcoin';
import { Ethereum } from './types/ethereum';
import { Pocket } from './types/pocket';
import { CryptoNodeData } from './interfaces/crypto-node';
import { NetworkType } from './constants';

// console.log('da-node-runner');

(async function() {
  try {
    const bitcoin = new Bitcoin({
      id: 'my-bitcoin-node',
      network: NetworkType.TESTNET,
    });

    const config = bitcoin.generateConfig();
    console.log(config);

    const dataObject = bitcoin.toObject();
    console.log(JSON.stringify(dataObject, null, '  '));

    // await bitcoin.start();
    // setTimeout(() => {
    //   bitcoin.stop()
    //     .then(() => console.log('Stopped!'))
    //     .catch(console.error);
    // }, 30000);
  } catch(err) {
    console.error(err);
  }
})();

// console.log(bitcoin);
