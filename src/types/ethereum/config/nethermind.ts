export const mainnet = `
{
  "Init": {
    "ChainSpecPath": "chainspec/foundation.json",
    "GenesisHash": "0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3",
    "BaseDbPath": "nethermind_db/mainnet",
    "LogFileName": "mainnet.logs.txt",
    "MemoryHint": 2048000000
  },
  "Network": {
    "ActivePeersMaxCount": 100,
    "P2PPort": {{PEER_PORT}}
  },
  "Sync": {
    "FastSync": true,
    "SnapSync": true,
    "PivotNumber": 15216000,
    "PivotHash": "0xfd5898c8d2a5d782a80ba7cf6ab598d17b9e9df26cd82a728e4b5f848c824e9e",
    "PivotTotalDifficulty": "54869472268454264278077",
    "FastBlocks": true,
    "AncientBodiesBarrier": 11052984,
    "AncientReceiptsBarrier": 11052984,
    "WitnessProtocolEnabled": true
  },
  "EthStats": {
    "Server": "wss://ethstats.net/api"
  },
  "Metrics": {
    "NodeName": "Mainnet"
  },
  "JsonRpc": {
    "Enabled": true,
    "Timeout": 20000,
    "Host": "0.0.0.0",
    "Port": {{RPC_PORT}},
    "EnabledModules": [
      "Eth",
      "Subscribe",
      "Trace",
      "TxPool",
      "Web3",
      "Personal",
      "Proof",
      "Net",
      "Parity",
      "Health"
    ],
    "AdditionalRpcUrls": [
    ]
  },
}
`;

export const rinkeby = `
{
  "Init": {
    "ChainSpecPath": "chainspec/rinkeby.json",
    "GenesisHash": "0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177",
    "BaseDbPath": "nethermind_db/rinkeby",
    "LogFileName": "rinkeby.logs.txt",
    "MemoryHint": 1024000000
  },
  "Network": {
    "P2PPort": {{PEER_PORT}}
  },
  "TxPool": {
    "Size": 1024
  },
  "Sync": {
    "FastSync": true,
    "PivotNumber": 11070000,
    "PivotHash": "0xb7d4ec3e10867e9b6732e193be81c3ae076b24f2c69143be02428a7ff510acc2",
    "PivotTotalDifficulty": "18120392",
    "FastBlocks": true
  },
  "Metrics": {
    "NodeName": "Rinkeby"
  },
  "JsonRpc": {
    "Enabled": true,
    "Timeout": 20000,
    "Host": "0.0.0.0",
    "Port": {{RPC_PORT}},
    "EnabledModules": [
      "Eth",
      "Subscribe",
      "Trace",
      "TxPool",
      "Web3",
      "Personal",
      "Proof",
      "Net",
      "Parity",
      "Health"
    ],
    "AdditionalRpcUrls": [
    ]
  },
}
`;