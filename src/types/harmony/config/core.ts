export const _255 = `
Version = "2.5.5"

[BLSKeys]
  KMSConfigFile = ""
  KMSConfigSrcType = "shared"
  KMSEnabled = false
  KeyDir = "/root/keystore/blskeys"
  KeyFiles = []
  MaxKeys = 10
  PassEnabled = true
  PassFile = "/root/config/pass.pwd"
  PassSrcType = "auto"
  SavePassphrase = {{SAVE_PASSPHRASE}}

[DNSSync]
  Client = true
  LegacySyncing = false
  Port = 6000
  Server = true
  ServerPort = 6000
  Zone = "{{NETWORK_TYPE}}.hmny.io"

[General]
  DataDir = "/root/data"
  EnablePruneBeaconChain = false
  IsArchival = false
  IsBackup = false
  IsBeaconArchival = false
  IsOffline = false
  NoStaking = {{NO_STAKING}}
  NodeType = "{{NODE_TYPE}}"
  ShardID = {{SHARD}}
  TraceEnable = false

[HTTP]
  AuthPort = 0
  Enabled = true
  IP = "0.0.0.0"
  Port = {{RPC_PORT}}
  RosettaEnabled = false
  RosettaPort = 9700

[Log]
  FileName = "harmony.log"
  Folder = "/root/data"
  RotateCount = 0
  RotateMaxAge = 0
  RotateSize = 100
  Verbosity = 3

  [Log.VerbosePrints]
    Config = false

[Network]
  BootNodes = ["/dnsaddr/bootstrap.{{NETWORK_TYPE}}.hmny.io"]
  NetworkType = "{{NETWORK}}"

[P2P]
  DisablePrivateIPScan = false
  DiscConcurrency = 0
  IP = "0.0.0.0"
  KeyFile = "/root/keystore/hmykey"
  MaxConnsPerIP = 10
  Port = {{PEER_PORT}}

[Pprof]
  Enabled = false
  Folder = ""
  ListenAddr = "127.0.0.1:6060"
  ProfileDebugValues = []
  ProfileIntervals = []
  ProfileNames = []

[RPCOpt]
  DebugEnabled = false
  EthRPCsEnabled = true
  LegacyRPCsEnabled = true
  RateLimterEnabled = true
  RequestsPerSecond = 1000
  RpcFilterFile = "/root/config/rpc_filter.txt"
  StakingRPCsEnabled = true

[ShardData]
  CacheSize = 512
  CacheTime = 10
  DiskCount = 8
  EnableShardData = false
  ShardCount = 4

[Sync]
  Concurrency = 6
  DiscBatch = 8
  DiscHardLowCap = 6
  DiscHighCap = 128
  DiscSoftLowCap = 8
  Downloader = false
  Enabled = false
  InitStreams = 8
  MinPeers = 6

[TxPool]
  AccountSlots = 16
  AllowedTxsFile = "/root/config/allowedtxs.txt"
  BlacklistFile = "/root/config/blacklist.txt"
  GlobalSlots = 5120
  LocalAccountsFile = ""
  RosettaFixFile = ""

[WS]
  AuthPort = 0
  Enabled = true
  IP = "127.0.0.1"
  Port = 9800
`;

export const _252 = `
Version = "2.5.2"

[BLSKeys]
  KMSConfigFile = ""
  KMSConfigSrcType = "shared"
  KMSEnabled = false
  KeyDir = "/root/keystore/blskeys"
  KeyFiles = []
  MaxKeys = 10
  PassEnabled = true
  PassFile = "/root/pass.pwd"
  PassSrcType = "auto"
  SavePassphrase = true

[DNSSync]
  Client = false
  LegacySyncing = false
  Port = 6000
  Server = true
  ServerPort = 6000
  Zone = "{{NETWORK_TYPE}}.hmny.io"

[General]
  DataDir = "/root/data"
  EnablePruneBeaconChain = false
  IsArchival = false
  IsBackup = false
  IsBeaconArchival = false
  IsOffline = false
  NoStaking = false
  NodeType = "explorer"
  ShardID = {{SHARD}}
  TraceEnable = false

[HTTP]
  AuthPort = 9501
  Enabled = true
  IP = "0.0.0.0"
  Port = {{RPC_PORT}}
  RosettaEnabled = false
  RosettaPort = 9700

[Log]
  FileName = "harmony.log"
  Folder = "/root/data"
  RotateCount = 0
  RotateMaxAge = 0
  RotateSize = 100
  Verbosity = 3

  [Log.VerbosePrints]
    Config = true

[Network]
  BootNodes = ["/dnsaddr/bootstrap.{{NETWORK_TYPE}}.hmny.io"]
  NetworkType = "{{NETWORK}}"

[P2P]
  DisablePrivateIPScan = false
  DiscConcurrency = 0
  IP = "0.0.0.0"
  KeyFile = "/root/keystore/hmykey"
  MaxConnsPerIP = 10
  Port = {{PEER_PORT}}

[Pprof]
  Enabled = false
  Folder = "./profiles"
  ListenAddr = "127.0.0.1:6060"
  ProfileDebugValues = [0]
  ProfileIntervals = [600]
  ProfileNames = []

[RPCOpt]
  DebugEnabled = false
  RateLimterEnabled = true
  RequestsPerSecond = 1000

[ShardData]
  CacheSize = 512
  CacheTime = 10
  DiskCount = 8
  EnableShardData = false
  ShardCount = 4

[Sync]
  Concurrency = 4
  DiscBatch = 8
  DiscHardLowCap = 4
  DiscHighCap = 1024
  DiscSoftLowCap = 4
  Downloader = true
  Enabled = true
  InitStreams = 4
  MinPeers = 4

[TxPool]
  AccountSlots = 16
  BlacklistFile = "/root/config/blacklist.txt"
  RosettaFixFile = ""

[WS]
  AuthPort = 9801
  Enabled = true
  IP = "127.0.0.1"
  Port = 9800
`;

export const _250 = `
Version = "2.5.0"

[BLSKeys]
  KMSConfigFile = ""
  KMSConfigSrcType = "shared"
  KMSEnabled = false
  KeyDir = "./.hmy/blskeys"
  KeyFiles = []
  MaxKeys = 10
  PassEnabled = true
  PassFile = ""
  PassSrcType = "auto"
  SavePassphrase = false

[DNSSync]
  Client = true
  LegacySyncing = false
  Port = 6000
  Server = true
  ServerPort = 6000
  Zone = "{{NETWORK_TYPE}}.hmny.io"

[General]
  DataDir = "/root/data"
  IsArchival = false
  IsBeaconArchival = false
  IsOffline = false
  NoStaking = true
  NodeType = "explorer"
  ShardID = {{SHARD}}

[HTTP]
  Enabled = true
  IP = "0.0.0.0"
  Port = {{RPC_PORT}}
  RosettaEnabled = false
  RosettaPort = 9700

[Log]
  FileName = "harmony.log"
  Folder = "/root/data"
  RotateCount = 0
  RotateMaxAge = 0
  RotateSize = 100
  Verbosity = 3

  [Log.VerbosePrints]
    Config = false

[Network]
  BootNodes = ["/dnsaddr/bootstrap.{{NETWORK_TYPE}}.hmny.io"]
  NetworkType = "{{NETWORK}}"

[P2P]
  IP = "0.0.0.0"
  KeyFile = "./.hmykey"
  Port = {{PEER_PORT}}

[Pprof]
  Enabled = false
  ListenAddr = "127.0.0.1:6060"

[RPCOpt]
  DebugEnabled = false
  RateLimterEnabled = true
  RequestsPerSecond = 1000

[Sync]
  Concurrency = 6
  DiscBatch = 8
  DiscHardLowCap = 6
  DiscHighCap = 128
  DiscSoftLowCap = 8
  Downloader = false
  Enabled = false
  InitStreams = 8
  MinPeers = 6

[TxPool]
  BlacklistFile = "./.hmy/blacklist.txt"

[WS]
  Enabled = true
  IP = "127.0.0.1"
  Port = 9800
`;
