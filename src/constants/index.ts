interface KeysMap {
  [key: string]: string;
}

export const NetworkType: KeysMap = {
  MAINNET: 'MAINNET',
  TESTNET: 'TESTNET',
  RINKEBY: 'RINKEBY',
  GOERLI: 'GOERLI',
  ROPSTEN: 'ROPSTEN',
  KOVAN: 'KOVAN',
  BSC: 'BSC',
};

export const NodeType: KeysMap = {
  FULL: 'FULL',
  ARCHIVAL: 'ARCHIVAL',
};

export const NodeClient: KeysMap = {
  CORE: 'CORE',
  GETH: 'GETH',
  OPEN_ETHEREUM: 'OPEN_ETHEREUM',
  PARITY: 'PARITY',
  NETHERMIND: 'NETHERMIND',
  ERIGON: 'ERIGON',
};

export const Role: KeysMap = {
  NODE: 'NODE',
  VALIDATOR: 'VALIDATOR',
};

export const Status: KeysMap = {
  STOPPED: 'STOPPED',
  SYNCING: 'SYNCING',
  RUNNING: 'RUNNING',
};

export const defaultDockerNetwork = 'da-node-runner-network';

export const NodeEvent: KeysMap = {
  CLOSE: 'CLOSE',
  ERROR: 'ERROR',
  OUTPUT: 'OUTPUT',
};

export const DockerEvent: KeysMap = {
  ERROR: 'ERROR',
  INFO: 'INFO',
};
