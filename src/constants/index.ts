export const NetworkType = {
  MAINNET: 'MAINNET',
  TESTNET: 'TESTNET',
  RINKEBY: 'RINKEBY',
};

export const NodeType = {
  FULL: 'FULL',
  ARCHIVAL: 'ARCHIVAL',
};

export const NodeClient = {
  CORE: 'CORE',
  GETH: 'GETH',
  OPEN_ETHEREUM: 'OPEN_ETHEREUM',
  PARITY: 'PARITY',
  NETHERMIND: 'NETHERMIND',
};

export const Role = {
  NODE: 'NODE',
  VALIDATOR: 'VALIDATOR',
};

export const Status = {
  STOPPED: 'STOPPED',
  SYNCING: 'SYNCING',
  RUNNING: 'RUNNING',
};

export const defaultDockerNetwork = 'da-node-runner-network';

export const NodeEvent = {
  CLOSE: 'CLOSE',
  ERROR: 'ERROR',
  OUTPUT: 'OUTPUT',
};

export const DockerEvent = {
  ERROR: 'ERROR',
  INFO: 'INFO',
};
