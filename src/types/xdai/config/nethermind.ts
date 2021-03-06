export const nethermindConfig = {
  'Init': {
    'WebSocketsEnabled': false,
    'StoreReceipts': true,
    'IsMining': false,
    'ChainSpecPath': 'chainspec/xdai.json',
    'GenesisHash': '0x4f1dd23188aab3a76b463e4af801b52b1248ef073c648cbdc4c9333d3da79756',
    'BaseDbPath': 'nethermind_db/xdai',
    'LogFileName': 'xdai.logs.txt',
    'MemoryHint': 768000000,
  },
  'Network': {
    'DiscoveryPort': 30303,
    'P2PPort': 30303,
    'ActivePeersMaxCount': 32
  },
  'TxPool': {
    'Size': 2048,
  },
  'JsonRpc': {
    'Enabled': true,
    'Timeout': 20000,
    'Host': '0.0.0.0',
    'Port': 8545,
    'WebSocketsPort': 8546,
  },
  'Db': {
    'CacheIndexAndFilterBlocks': false,
  },
  'Sync': {
    'FastSync': true,
    'PivotNumber': 19570000,
    'PivotHash': '0x3afa6aa144f6c7bb3d9cbd077711af4208440d2562e75a02f603714c37e22b3e',
    'PivotTotalDifficulty': '6659325920642765729978241067439703897846588856',
    'FastBlocks': true,
    'UseGethLimitsInFastBlocks': false,
    'FastSyncCatchUpHeightDelta': 10000000000,
  },
  'EthStats': {
    'Enabled': false,
    'Server': 'ws://localhost:3000/api',
    'Name': 'Nethermind xDai',
    'Secret': 'secret',
    'Contact': 'hello@nethermind.io',
  },
  'Metrics': {
    'NodeName': 'xDai',
    'Enabled': false,
    'PushGatewayUrl': 'http://localhost:9091/metrics',
    'IntervalSeconds': 5,
  },
  'HealthChecks': {
    'Enabled': true
  },
  'Aura': {
    'ForceSealing': true,
  },
  'Bloom': {
    'IndexLevelBucketSizes': [
      16,
      16,
      16,
    ],
  },
};
