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
    "SnapSync": true,
    "PivotNumber": 18900000,
    "PivotHash": "0x84bd4976f299d9343a18a1088f1cec0dbcac72b6d51a6fc9b901921a55449fc6",
    "PivotTotalDifficulty": "58750003716598352816469",
    "FastBlocks": true,
    "FastSyncCatchUpHeightDelta": "10000000000"
  },
  "EthStats": {
    "Server": "wss://ethstats.net/api"
  },
  "Metrics": {
    "NodeName": "Mainnet"
  },
  "Blocks": {
    "TargetBlockGasLimit": 30000000
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
    "AdditionalRpcUrls": []
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
    "ActivePeersMaxCount": 100,
    "P2PPort": {{PEER_PORT}}
  },
  "TxPool": {
    "Size": 1024,
    "BlobsSupport": "StorageWithReorgs"
  },
  "Db": {
    "EnableMetricsUpdater": true
  },
  "Sync": {
    "SnapSync": true,
    "PivotNumber": 10260000,
    "PivotHash": "0xfd7265da4de69c506d16eb67eb41018c4dd11e3a0a8198cee0c5308e655b61db",
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
  "Blocks": {
    "TargetBlockGasLimit": 30000000
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
    "Host": "0.0.0.0",
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
    "Enabled": true,
    "SecondsPerSlot": 5
  },
  "Mining": {
    "MinGasPrice": "1000000000"
  },
  "Network": {
    "DiscoveryPort": {{PEER_PORT}},
    "P2PPort": {{PEER_PORT}},
    "Bootnodes": [
      "enode://6765fff89db92aa8d923e28c438af626c8ae95a43093cdccbd6f550a7b6ce6ab5d1a3dc60dd79af3e6d2c2e6731bae629f0e54446a0d9da408c4eca7ebcd8485@3.75.159.31:30303",
      "enode://9a7c98e8ee8cdd3199db68092b48868847d4743a471b26afc2ff878bafaa829ed43ee405f9aff58ae13fce53b898f7c2e3c30cb80af8eb111682c3c13f686dbb@18.198.130.54:30303",
      "enode://2c4307831914c237801993eac4f9596d8b2f78e1e76830419b64cb23f0933e52cb1e2bb3009cb4af76454bb5bc296135b36869fd6c13e2c2e536a0780e60fe82@3.64.242.196:30303",
      "enode://074f68e1a7df5b0859314ff721d55b59d9690e93249c941660609a29b302f02864df4f93ee48884f7ede57dc7f7646379d017a43c9745e34baff049749896b50@3.126.169.151:30303",
      "enode://d239697375d7586c7ea1de790401c310b0b1d389326849fa3b7c7005833c7a6b9020e49dfb3b61abfa39135237ffc4ff219cb84ca7653069e8548497527aa432@107.22.4.120:30303",
      "enode://d5852bf415d89b756faa809f4ff3f8beb661dc7d60cfb4a5542f9a5fcdf41e1ed0708a210db64b8c7ca32426e04ef0a50da58974124fdf562a8510314d11e28c@3.26.206.142:30303",
      "enode://01d372392bb22dd8a91f8b10b6bbb8d80d2dbe98d695801e0df9e4bd4825781df84bba88361f24d1b6580a61313f64e6cec82e8d842ad5f1b3d7cf8d6d132da7@15.152.45.82:30303",
      "enode://aee88e803b8e54925081957965b2527961cd90f4d6d14664884580b429da44729678a1258a8b49a42d1582c9c7c5ded05733622f7ab442ad9c6f655545a5ecdd@54.207.220.169:30303",
      "enode://a8558c4449bdb4ed47b8fd0ceaee8cf56272cd308e98e693a838d58b9abd2411b71b9b7e2d63a50b140fd9b0a2e05e83f338c3906dd925e9f178f0feda0c4ca7@165.232.138.187:30303",
      "enode://e52280c512cd1f023135d7f70f31904bda7bb699d4300346182a2e3fc5a07637c25cc4349b48101ffe2fe6229b3b165ed7929ad9db971d847d02e21192989ce5@143.198.156.24:30303",
      "enode://8ed1893f617f1ed2c6a978fa92fa38ac19db6de5596c93bf21921c40ed34f63b63a93234ddedf9b385192dd7aa652e1d4b55efed299961b0ae5d4318ecb985ec@159.223.213.61:30303",
      "enode://cc3f99a19360edd73f91f04c6fe728ff8da431f8445a35c02a0fd99fee2be5d9f5ea75a416b08f4a019e0a0d3afa8aece93a560bbe3ce0509eec54bbddc00bb8@178.62.194.136:30303",
      "enode://8f3a63b270cd32692f5b825874b9f3acef3cf90dec40fe54848267f568b7275349efb830812c1b24f1781774f745fb00e595d2feef642fd6867e173f05108cc4@178.62.192.195:30303",
      "enode://075d567bcc5b6bbcb5c9922bf7f17a706408bed141dcefb5d387cfe6e0c7c9407e450a5d17b9180b25fb07b3e82943639d011752ea44a2d868b3c37f48a318b9@167.99.209.14:30303",
      "enode://bb19f1fcf0d0667d9752bec2f4230e24331a7764e5a73a41006378861ef79f9a4386f646e239e1842e4bb721ade9369be8f2fd81b407d9febec2e150ccb7f257@137.184.228.83:30303",
      "enode://529cc11acd013d5e92aa38d4139636619285b2bb4221bcdf7c5dbf171e828d05b88934e6154b984f8164953d7d7530b49c6d0e030fade3a3737d28092a289704@164.92.96.111:30303",
      "enode://9d41c6f8c77a1ac3069cc9326068c04465b9fc56abaaf84fa753fc723511f278dd1d65c22753eb60dfd95f60fe942d0f670c490660e3d6cd518ddafb986682d2@178.62.196.104:30303",
      "enode://874ac7df642fc2abffcca71991c3646a5634a415a4a6513112a89429f7ae43914ad6f1d2ea73a96a19f302c17a7c5e07a0dd01fed70c9294a6fd5615b86710b7@159.223.213.166:30303",
      "enode://5d1a11b5f19afb7d2d04406a4877ed7de92a4ca898ee0d36ff54729b99664e4ac787877e553043a38a38f878aab43fc0d757673e0c11ee8eb606f1ea4681ce3c@147.182.204.197:30303",
      "enode://144d125c790100f6405d957dea8c3a1647199109d915889e90d7f6c2940c8737b16e68e2a3af57327971ec28ed77408f9bc96035b2589da6496f3112ec72e037@137.184.183.65:30303",
      "enode://ac8e8a62f5b54c35f4d7eb565079e9c81e241a150c0d6b2bb5bb32b068e8e4930b14a5b504f77d34014c8e9f14ec0307cc6b239e8c56be85fdcc68d4956cce7c@159.223.213.157:30303",
      "enode://20b0de013d851ae5b667f41a923f2856420161fe0a46030cdea6d81db8da3c5b04070834219a2a6ca41d8f2c6c813870414ce473ab25736742163b0be6191861@159.223.209.185:30303",
      "enode://3c8de197987eb896488ed60037b44c5201878d7cb47d22a322d6d73b999b1d5482820e0456dc08676665ba1ce96906900a2b5f830b2eea73730ca7532c227c7b@159.223.217.249:30303",
      "enode://644ad8205801f9dba1d6eff107590d49479d5276c8d078f8631f351a2077d70b7bed2822219cb1c7590ba68149b89751968a45236e7d02c1025e493d647dd776@159.223.213.162:30303"
    ],
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
`;
