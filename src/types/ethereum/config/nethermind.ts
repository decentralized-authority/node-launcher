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
    "MaxActivePeers": 100,
    "P2PPort": {{PEER_PORT}}
  },
  "Sync": {
    "FastSync": true,
    "SnapSync": true,
    "PivotNumber": 15830000,
    "PivotHash": "0xb917d75ec90eaa8d1f41dd416e014f56d7ba5e056a947f9e66744fa49f63f3b7",
    "PivotTotalDifficulty": "58750003716598352816469",
    "FastBlocks": true,
    "AncientBodiesBarrier": 11052984,
    "AncientReceiptsBarrier": 11052984,
    "FastSyncCatchUpHeightDelta": "10000000000"
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
      "ws",
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
    "EnginePort": {{AUTH_PORT}},
    "EngineHost": "0.0.0.0",
    "JwtSecretFile": "/nethermind/config/jwt.hex",
    "AdditionalRpcUrls": [
    ]
  },
  "Merge": {
    "Enabled": true
  }
}
`;

export const goerli = `
{
  "Init": {
    "ChainSpecPath": "chainspec/goerli.json",
    "GenesisHash": "0xbf7e331f7f7c1dd2e05159666b3bf8bc7a8a3a9eb1d518969eab529dd9b88c1a",
    "BaseDbPath": "nethermind_db/goerli",
    "LogFileName": "goerli.logs.txt",
    "MemoryHint": 768000000
  },
  "Network": {
    "MaxActivePeers": 100,
    "P2PPort": {{PEER_PORT}}
  },
  "TxPool": {
    "Size": 1024
  },
  "Db": {
    "EnableMetricsUpdater": true
  },
  "Sync": {
    "FastSync": true,
    "SnapSync": true,
    "PivotNumber": 7800000,
    "PivotHash": "0xe58afae321f270bdde6dac2e2ba2beab5fc5a1dcaaa82569f6a0bf97f707a341",
    "PivotTotalDifficulty": "10790000",
    "FastBlocks": true,
    "UseGethLimitsInFastBlocks": true,
    "FastSyncCatchUpHeightDelta": "10000000000"
  },
  "EthStats": {
    "Server": "wss://stats.goerli.net/api",
    "Name": "Nethermind"
  },
  "Metrics": {
    "NodeName": "Goerli"
  },
  "Bloom": {
    "IndexLevelBucketSizes": [
      16,
      16,
      16,
      16
    ]
  },
  "JsonRpc": {
    "Enabled": true,
    "Timeout": 20000,
    "Host": "0.0.0.0",
    "Port": {{RPC_PORT}},
    "EnabledModules": [
      "Eth",
      "WS",
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
    "EnginePort": {{AUTH_PORT}},
    "EngineHost": "0.0.0.0",
    "JwtSecretFile": "/nethermind/config/jwt.hex"
  },
  "Merge": {
    "Enabled": true
  }
}
`

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

export const xdai = `{
  "Init": {
    "ChainSpecPath": "chainspec/xdai.json",
    "GenesisHash": "0x4f1dd23188aab3a76b463e4af801b52b1248ef073c648cbdc4c9333d3da79756",
    "BaseDbPath": "nethermind_db/xdai",
    "LogFileName": "xdai.logs.txt",
    "MemoryHint": 768000000
  },
  "JsonRpc": {
    "Enabled": true,
    "Port": {{RPC_PORT}},
    "EnginePort": {{AUTH_PORT}},
    "EngineHost": "0.0.0.0",
    "JwtSecretFile": "/nethermind/config/jwt.hex",
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
  },
  "Sync": {
    "FastSync": true,
    "PivotNumber": 25050000,
    "PivotHash": "0x7cbc6a801a57ae7b112c30d189914b9dacd05ccb66b4377fc12c7aeecb4bdb2d",
    "PivotTotalDifficulty": "8524073291369508509757533916165793696614115624",
    "FastBlocks": true,
    "UseGethLimitsInFastBlocks": false,
    "FastSyncCatchUpHeightDelta": 10000000000
  },
  "Merge": {
    "SecondsPerSlot": 5
  },
  "Mining": {
    "MinGasPrice": "1000000000"
  },
  "Network": {
    "DiscoveryPort": {{PEER_PORT}},
    "P2PPort": {{PEER_PORT}}
  },
  "EthStats": {
    "Name": "Nethermind xDai"
  },
  "Metrics": {
    "NodeName": "xDai"
  },
  "Bloom": {
    "IndexLevelBucketSizes": [
      16,
      16,
      16
    ]
  }
}
`