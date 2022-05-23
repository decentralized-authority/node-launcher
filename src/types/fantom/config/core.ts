export const mainnet = `
[Node]
DataDir = "/root/.opera/"
IPCPath = "opera.ipc"
HTTPHost = "0.0.0.0"
HTTPPort = {{RPC_PORT}}
HTTPCors = ["*"]
HTTPVirtualHosts = ["*"]
HTTPModules = ["ftm", "eth", "debug", "admin", "web3", "personal", "net", "txpool", "sfc"]
WSHost = "0.0.0.0"
WSPort = 18546
WSOrigins = ["*"]
WSModules = ["ftm", "eth", "debug", "admin", "web3", "personal", "net", "txpool", "sfc"]
GraphQLVirtualHosts = ["localhost"]

[Node.P2P]
MaxPeers = 200
NoDiscovery = false
DiscoveryV5 = true
BootstrapNodes = ["enode://03c70d4597d731ef182678b7664f2a4a3add07056f23d4e01aba86f066080d18fa13abbd2e13e9d4ea762a2715a983b5ac6151162d05ee0434f1847da1a626e9@34.242.220.16:5050", "enode://01c64d1a9dd8a65c56f2d4e373795eb6efd27b714b2b5999363a42a0edc39d7417a431416ceb5c67b1a170983af109e8a15d0c2d44a2ac41ecfb5c23c1a1a48a@3.35.200.210:5050", "enode://7044c88daa5df059e2f7a2667471a8149a5cf66e68643dcb86f399d48c4ff6475b73ee91486ea830d225f7f78a2fdf955208673da51c6852230c3a90a3701c06@3.1.103.70:5050", "enode://594d26c2338566daca9391d73f1b1821bb0b454e6f3d48715116bf42f320924d569534c143b640feec8a8eaa137a0b822426fb62b52a90162270ea5868bdc37c@18.138.254.181:5050", "enode://339e331912e5239a9e13eb82b47be58ea4d3946e91caa2992103a8d4f0226c1e86f9134822d5b238f25c9cbdd473f806caa8e4f8ef1748a6c66395f4bf0dd569@54.66.206.151:5050", "enode://563b30428f48357f31c9d4906ca2f3d3815d663b151302c1ba9d58f3428265b554398c6fabf4b806a49525670cd9e031257c805375b9fdbcc015f60a7943e427@3.213.142.230:7946", "enode://8b53fe4410cde82d98d28697d56ccb793f9a67b1f8807c523eadafe96339d6e56bc82c0e702757ac5010972e966761b1abecb4935d9a86a9feed47e3e9ba27a6@3.227.34.226:7946", "enode://1703640d1239434dcaf010541cafeeb3c4c707be9098954c50aa705f6e97e2d0273671df13f6e447563e7d3a7c7ffc88de48318d8a3cc2cc59d196516054f17e@52.72.222.228:7946"]
BootstrapNodesV5 = ["enode://03c70d4597d731ef182678b7664f2a4a3add07056f23d4e01aba86f066080d18fa13abbd2e13e9d4ea762a2715a983b5ac6151162d05ee0434f1847da1a626e9@34.242.220.16:5050", "enode://01c64d1a9dd8a65c56f2d4e373795eb6efd27b714b2b5999363a42a0edc39d7417a431416ceb5c67b1a170983af109e8a15d0c2d44a2ac41ecfb5c23c1a1a48a@3.35.200.210:5050", "enode://7044c88daa5df059e2f7a2667471a8149a5cf66e68643dcb86f399d48c4ff6475b73ee91486ea830d225f7f78a2fdf955208673da51c6852230c3a90a3701c06@3.1.103.70:5050", "enode://594d26c2338566daca9391d73f1b1821bb0b454e6f3d48715116bf42f320924d569534c143b640feec8a8eaa137a0b822426fb62b52a90162270ea5868bdc37c@18.138.254.181:5050", "enode://339e331912e5239a9e13eb82b47be58ea4d3946e91caa2992103a8d4f0226c1e86f9134822d5b238f25c9cbdd473f806caa8e4f8ef1748a6c66395f4bf0dd569@54.66.206.151:5050", "enode://563b30428f48357f31c9d4906ca2f3d3815d663b151302c1ba9d58f3428265b554398c6fabf4b806a49525670cd9e031257c805375b9fdbcc015f60a7943e427@3.213.142.230:7946", "enode://8b53fe4410cde82d98d28697d56ccb793f9a67b1f8807c523eadafe96339d6e56bc82c0e702757ac5010972e966761b1abecb4935d9a86a9feed47e3e9ba27a6@3.227.34.226:7946", "enode://1703640d1239434dcaf010541cafeeb3c4c707be9098954c50aa705f6e97e2d0273671df13f6e447563e7d3a7c7ffc88de48318d8a3cc2cc59d196516054f17e@52.72.222.228:7946"]
StaticNodes = []
TrustedNodes = []
ListenAddr = ":{{PEER_PORT}}"
EnableMsgEvents = false

[Node.HTTPTimeouts]
ReadTimeout = 30000000000
WriteTimeout = 30000000000
IdleTimeout = 120000000000

[Opera]
OperaDiscoveryURLs = []
SnapDiscoveryURLs = []
AllowSnapsync = false
TxIndex = true
RPCGasCap = 50000000
RPCTxFeeCap = 1e+02
AllowUnprotectedTxs = false
ExtRPCEnabled = false
RPCBlockExt = true

[Opera.FilterAPI]
IndexedLogsBlockRangeLimit = 999999999999999999
UnindexedLogsBlockRangeLimit = 100

[Opera.Protocol]
LatencyImportance = 60
ThroughputImportance = 40
MsgsSemaphoreTimeout = 10000000000
ProgressBroadcastPeriod = 10000000000
MaxInitialTxHashesSend = 20000
MaxRandomTxHashesSend = 128
RandomTxHashesSendPeriod = 20000000000

[Opera.Protocol.EventsSemaphoreLimit]
Num = 10000
Size = 31457280

[Opera.Protocol.BVsSemaphoreLimit]
Num = 5000
Size = 15728640

[Opera.Protocol.MsgsSemaphoreLimit]
Num = 1000
Size = 31457280

[Opera.Protocol.DagProcessor]
EventsSemaphoreTimeout = 10000000000
MaxTasks = 128

[Opera.Protocol.DagProcessor.EventsBufferLimit]
Num = 3250
Size = 11534336

[Opera.Protocol.BvProcessor]
SemaphoreTimeout = 10000000000
MaxTasks = 512

[Opera.Protocol.BvProcessor.BufferLimit]
Num = 3000
Size = 15728640

[Opera.Protocol.BrProcessor]
SemaphoreTimeout = 10000000000
MaxTasks = 512

[Opera.Protocol.BrProcessor.BufferLimit]
Num = 10000
Size = 15728640

[Opera.Protocol.EpProcessor]
SemaphoreTimeout = 10000000000
MaxTasks = 512

[Opera.Protocol.EpProcessor.BufferLimit]
Num = 10000
Size = 15728640

[Opera.Protocol.DagFetcher]
ForgetTimeout = 60000000000
ArriveTimeout = 4000000000
GatherSlack = 100000000
HashLimit = 10000
MaxBatch = 512
MaxParallelRequests = 192
MaxQueuedBatches = 32

[Opera.Protocol.TxFetcher]
ForgetTimeout = 60000000000
ArriveTimeout = 1000000000
GatherSlack = 100000000
HashLimit = 10000
MaxBatch = 512
MaxParallelRequests = 64
MaxQueuedBatches = 32

[Opera.Protocol.DagStreamLeecher]
RecheckInterval = 1000000000
BaseProgressWatchdog = 5000000000
BaseSessionWatchdog = 150000000000
MinSessionRestart = 5000000000
MaxSessionRestart = 240000000000

[Opera.Protocol.DagStreamLeecher.Session]
RecheckInterval = 10000000
DefaultChunkItemsNum = 500
DefaultChunkItemsSize = 524288
ParallelChunksDownload = 6

[Opera.Protocol.DagStreamSeeder]
SenderThreads = 8
MaxSenderTasks = 128
MaxPendingResponsesSize = 67108864
MaxResponsePayloadNum = 16384
MaxResponsePayloadSize = 8388608
MaxResponseChunks = 12

[Opera.Protocol.BvStreamLeecher]
RecheckInterval = 1000000000
BaseProgressWatchdog = 5000000000
BaseSessionWatchdog = 150000000000
MinSessionRestart = 5000000000
MaxSessionRestart = 300000000000

[Opera.Protocol.BvStreamLeecher.Session]
RecheckInterval = 10000000
DefaultChunkItemsNum = 500
DefaultChunkItemsSize = 524288
ParallelChunksDownload = 6

[Opera.Protocol.BvStreamSeeder]
SenderThreads = 2
MaxSenderTasks = 64
MaxPendingResponsesSize = 33554432
MaxResponsePayloadNum = 4096
MaxResponsePayloadSize = 8388608
MaxResponseChunks = 12

[Opera.Protocol.BrStreamLeecher]
RecheckInterval = 1000000000
BaseProgressWatchdog = 5000000000
BaseSessionWatchdog = 150000000000
MinSessionRestart = 5000000000
MaxSessionRestart = 300000000000

[Opera.Protocol.BrStreamLeecher.Session]
RecheckInterval = 10000000
DefaultChunkItemsNum = 500
DefaultChunkItemsSize = 524288
ParallelChunksDownload = 6

[Opera.Protocol.BrStreamSeeder]
SenderThreads = 2
MaxSenderTasks = 64
MaxPendingResponsesSize = 33554432
MaxResponsePayloadNum = 4096
MaxResponsePayloadSize = 8388608
MaxResponseChunks = 12

[Opera.Protocol.EpStreamLeecher]
RecheckInterval = 1000000000
BaseProgressWatchdog = 5000000000
BaseSessionWatchdog = 150000000000
MinSessionRestart = 5000000000
MaxSessionRestart = 300000000000

[Opera.Protocol.EpStreamLeecher.Session]
RecheckInterval = 10000000
DefaultChunkItemsNum = 500
DefaultChunkItemsSize = 524288
ParallelChunksDownload = 6

[Opera.Protocol.EpStreamSeeder]
SenderThreads = 2
MaxSenderTasks = 64
MaxPendingResponsesSize = 33554432
MaxResponsePayloadNum = 4096
MaxResponsePayloadSize = 8388608
MaxResponseChunks = 12

[Opera.Protocol.PeerCache]
MaxKnownTxs = 24576
MaxKnownEvents = 24576
MaxQueuedItems = 4096
MaxQueuedSize = 10486784

[Opera.HeavyCheck]
MaxQueuedTasks = 1024
Threads = 0

[Opera.GPO]
MaxTipCap = 100000000000000
MinTipCap = 0
MaxTipCapMultiplierRatio = 25000000
MiddleTipCapMultiplierRatio = 3750000
GasPowerWallRatio = 50000

[Opera.VersionWatcher]
ShutDownIfNotUpgraded = false
WarningIfNotUpgradedEvery = 5000000000

[Emitter]
VersionToPublish = "1.1.0-rc.5"
MaxTxsPerAddress = 32
MaxParents = 0
LimitedTpsThreshold = 3360000
NoTxsThreshold = 840000
EmergencyThreshold = 140000
TxsCacheInvalidation = 200000000

[Emitter.Validator]
ID = 0

[Emitter.Validator.PubKey]
Type = 0
Raw = []

[Emitter.EmitIntervals]
Min = 110000000
Max = 600000000000
Confirming = 120000000
ParallelInstanceProtection = 60000000000
DoublesignProtection = 1620000000000

[Emitter.PrevEmittedEventFile]
Path = ""
SyncMode = false

[Emitter.PrevBlockVotesFile]
Path = ""
SyncMode = false

[Emitter.PrevEpochVoteFile]
Path = ""
SyncMode = false

[TxPool]
Locals = []
NoLocals = false
Journal = "transactions.rlp"
Rejournal = 3600000000000
PriceLimit = 1
PriceBump = 10
AccountSlots = 16
GlobalSlots = 1280
AccountQueue = 32
GlobalQueue = 256
Lifetime = 10800000000000

[OperaStore]
MaxNonFlushedSize = 23068672
MaxNonFlushedPeriod = 1800000000000

[OperaStore.Cache]
EventsNum = 5000
EventsSize = 6291456
BlocksNum = 5000
BlocksSize = 524288
BlockEpochStateNum = 8

[OperaStore.EVM]
EnablePreimageRecording = true

[OperaStore.EVM.Cache]
ReceiptsSize = 4194304
ReceiptsBlocks = 4000
TxPositions = 20000
EvmDatabase = 33554432
EvmSnap = 33554432
EvmBlocksNum = 5000
EvmBlocksSize = 6291456
TrieCleanJournal = ""
TrieDirtyDisabled = true
TrieDirtyLimit = 419430400

[LachesisStore.Cache]
RootsNum = 1000
RootsFrames = 100

[VectorClock.Fc.Caches]
ForklessCausePairs = 20000
HighestBeforeSeqSize = 163840
LowestAfterSeqSize = 163840

[VectorClock.Caches]
HighestBeforeTimeSize = 163840
`;