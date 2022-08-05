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
      "ActivePeersMaxCount": 100
    },
    "Sync": {
      "FastSync": true,
      "SnapSync": true,
      "PivotNumber": 15245000,
      "PivotHash": "0x19345f553968086f62c60ea2fe06886b9a9ba6c7cfebe056acdfa9a690e3e17f",
      "PivotTotalDifficulty": "55212896532081815617862",
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
    }
  }
`;

export const rinkeby = `
`;