export const heimdallConfig = `
# This is a TOML config file.
# For more information, see https://github.com/toml-lang/toml

##### main base config options #####

# TCP or UNIX socket address of the ABCI application,
# or the name of an ABCI application compiled in with the Tendermint binary
proxy_app = "tcp://127.0.0.1:26658"

# A custom human readable name for this node
moniker = "{{MONIKER}}"

# If this node is many blocks behind the tip of the chain, FastSync
# allows them to catchup quickly by downloading blocks in parallel
# and verifying their commits
fast_sync = true

# Database backend: goleveldb | cleveldb | boltdb
# * goleveldb (github.com/syndtr/goleveldb - most popular implementation)
#   - pure go
#   - stable
# * cleveldb (uses levigo wrapper)
#   - fast
#   - requires gcc
#   - use cleveldb build tag (go build -tags cleveldb)
# * boltdb (uses etcd's fork of bolt - github.com/etcd-io/bbolt)
#   - EXPERIMENTAL
#   - may be faster is some use-cases (random reads - indexer)
#   - use boltdb build tag (go build -tags boltdb)
db_backend = "goleveldb"

# Database directory
db_dir = "data"

# Output level for logging, including package level options
# log_level = "main:info,state:info,*:error"
log_level = "main:info,*:error"

# Output format: 'plain' (colored text) or 'json'
log_format = "plain"

##### additional base config options #####

# Path to the JSON file containing the initial validator set and other meta data
genesis_file = "config/genesis.json"

# Path to the JSON file containing the private key to use as a validator in the consensus protocol
priv_validator_key_file = "config/priv_validator_key.json"

# Path to the JSON file containing the last sign state of a validator
priv_validator_state_file = "data/priv_validator_state.json"

# TCP or UNIX socket address for Tendermint to listen on for
# connections from an external PrivValidator process
priv_validator_laddr = ""

# Path to the JSON file containing the private key to use for node authentication in the p2p protocol
node_key_file = "config/node_key.json"

# Mechanism to connect to the ABCI application: socket | grpc
abci = "socket"

# TCP or UNIX socket address for the profiling server to listen on
prof_laddr = "localhost:6060"

# If true, query the ABCI app on connecting to a new peer
# so the app can decide if we should keep the connection or not
filter_peers = false

##### advanced configuration options #####

##### rpc server configuration options #####
[rpc]

# TCP or UNIX socket address for the RPC server to listen on
laddr = "tcp://0.0.0.0:26657"

# A list of origins a cross-domain request can be executed from
# Default value '[]' disables cors support
# Use '["*"]' to allow any origin
cors_allowed_origins = []

# A list of methods the client is allowed to use with cross-domain requests
cors_allowed_methods = ["HEAD", "GET", "POST", ]

# A list of non simple headers the client is allowed to use with cross-domain requests
cors_allowed_headers = ["Origin", "Accept", "Content-Type", "X-Requested-With", "X-Server-Time", ]

# TCP or UNIX socket address for the gRPC server to listen on
# NOTE: This server only supports /broadcast_tx_commit
grpc_laddr = ""

# Maximum number of simultaneous connections.
# Does not include RPC (HTTP&WebSocket) connections. See max_open_connections
# If you want to accept a larger number than the default, make sure
# you increase your OS limits.
# 0 - unlimited.
# Should be < {ulimit -Sn} - {MaxNumInboundPeers} - {MaxNumOutboundPeers} - {N of wal, db and other open files}
# 1024 - 40 - 10 - 50 = 924 = ~900
grpc_max_open_connections = 900

# Activate unsafe RPC commands like /dial_seeds and /unsafe_flush_mempool
unsafe = false

# Maximum number of simultaneous connections (including WebSocket).
# Does not include gRPC connections. See grpc_max_open_connections
# If you want to accept a larger number than the default, make sure
# you increase your OS limits.
# 0 - unlimited.
# Should be < {ulimit -Sn} - {MaxNumInboundPeers} - {MaxNumOutboundPeers} - {N of wal, db and other open files}
# 1024 - 40 - 10 - 50 = 924 = ~900
max_open_connections = 900

# Maximum number of unique clientIDs that can /subscribe
# If you're using /broadcast_tx_commit, set to the estimated maximum number
# of broadcast_tx_commit calls per block.
max_subscription_clients = 100

# Maximum number of unique queries a given client can /subscribe to
# If you're using GRPC (or Local RPC client) and /broadcast_tx_commit, set to
# the estimated # maximum number of broadcast_tx_commit calls per block.
max_subscriptions_per_client = 5

# How long to wait for a tx to be committed during /broadcast_tx_commit.
# WARNING: Using a value larger than 10s will result in increasing the
# global HTTP write timeout, which applies to all connections and endpoints.
# See https://github.com/tendermint/tendermint/issues/3435
timeout_broadcast_tx_commit = "10s"

# Maximum size of request body, in bytes
max_body_bytes = 1000000

# Maximum size of request header, in bytes
max_header_bytes = 1048576

# The path to a file containing certificate that is used to create the HTTPS server.
# Migth be either absolute path or path related to tendermint's config directory.
# If the certificate is signed by a certificate authority,
# the certFile should be the concatenation of the server's certificate, any intermediates,
# and the CA's certificate.
# NOTE: both tls_cert_file and tls_key_file must be present for Tendermint to create HTTPS server. Otherwise, HTTP server is run.
tls_cert_file = ""

# The path to a file containing matching private key that is used to create the HTTPS server.
# Migth be either absolute path or path related to tendermint's config directory.
# NOTE: both tls_cert_file and tls_key_file must be present for Tendermint to create HTTPS server. Otherwise, HTTP server is run.
tls_key_file = ""

##### peer to peer configuration options #####
[p2p]

# Address to listen for incoming connections
laddr = "tcp://0.0.0.0:{{PEER_PORT}}"

# Address to advertise to peers for them to dial
# If empty, will use the same port as the laddr,
# and will introspect on the listener or use UPnP
# to figure out the address.
external_address = ""

# Comma separated list of seed nodes to connect to
seeds = "{{SEEDS}}"

# Comma separated list of nodes to keep persistent connections to
persistent_peers = ""

# UPNP port forwarding
upnp = false

# Path to address book
addr_book_file = "config/addrbook.json"

# Set true for strict address routability rules
# Set false for private or local networks
addr_book_strict = true

# Maximum number of inbound peers
max_num_inbound_peers = 40

# Maximum number of outbound peers to connect to, excluding persistent peers
max_num_outbound_peers = 10

# Time to wait before flushing messages out on the connection
flush_throttle_timeout = "100ms"

# Maximum size of a message packet payload, in bytes
max_packet_msg_payload_size = 1024

# Rate at which packets can be sent, in bytes/second
send_rate = 5120000

# Rate at which packets can be received, in bytes/second
recv_rate = 5120000

# Set true to enable the peer-exchange reactor
pex = true

# Seed mode, in which node constantly crawls the network and looks for
# peers. If another node asks it for addresses, it responds and disconnects.
#
# Does not work if the peer-exchange reactor is disabled.
seed_mode = false

# Comma separated list of peer IDs to keep private (will not be gossiped to other peers)
private_peer_ids = ""

# Toggle to disable guard against peers connecting from the same ip.
allow_duplicate_ip = false

# Peer connection configuration.
handshake_timeout = "20s"
dial_timeout = "3s"

##### mempool configuration options #####
[mempool]

recheck = true
broadcast = true
wal_dir = ""

# Maximum number of transactions in the mempool
size = 5000

# Limit the total size of all txs in the mempool.
# This only accounts for raw transactions (e.g. given 1MB transactions and
# max_txs_bytes=5MB, mempool will only accept 5 transactions).
max_txs_bytes = 1073741824

# Size of the cache (used to filter transactions we saw earlier) in transactions
cache_size = 10000

# Maximum size of a single transaction.
# NOTE: the max size of a tx transmitted over the network is {max_tx_bytes} + {amino overhead}.
max_tx_bytes = 1048576

##### fast sync configuration options #####
[fastsync]

# Fast Sync version to use:
#   1) "v0" (default) - the legacy fast sync implementation
#   2) "v1" - refactor of v0 version for better testability
version = "v0"

##### consensus configuration options #####
[consensus]

wal_file = "data/cs.wal/wal"

timeout_propose = "3s"
timeout_propose_delta = "500ms"
timeout_prevote = "1s"
timeout_prevote_delta = "500ms"
timeout_precommit = "1s"
timeout_precommit_delta = "500ms"
timeout_commit = "5s"

# Make progress as soon as we have all the precommits (as if TimeoutCommit = 0)
skip_timeout_commit = false

# EmptyBlocks mode and possible interval between empty blocks
create_empty_blocks = true
create_empty_blocks_interval = "0s"

# Reactor sleep duration parameters
peer_gossip_sleep_duration = "100ms"
peer_query_maj23_sleep_duration = "2s"

##### transactions indexer configuration options #####
[tx_index]

# What indexer to use for transactions
#
# Options:
#   1) "null"
#   2) "kv" (default) - the simplest possible indexer, backed by key-value storage (defaults to levelDB; see DBBackend).
indexer = "kv"

# Comma-separated list of tags to index (by default the only tag is "tx.hash")
#
# You can also index transactions by height by adding "tx.height" tag here.
#
# It's recommended to index only a subset of tags due to possible memory
# bloat. This is, of course, depends on the indexer's DB and the volume of
# transactions.
index_tags = ""

# When set to true, tells indexer to index all tags (predefined tags:
# "tx.hash", "tx.height" and all tags from DeliverTx responses).
#
# Note this may be not desirable (see the comment above). IndexTags has a
# precedence over IndexAllTags (i.e. when given both, IndexTags will be
# indexed).
index_all_tags = true

##### instrumentation configuration options #####
[instrumentation]

# When true, Prometheus metrics are served under /metrics on
# PrometheusListenAddr.
# Check out the documentation for the list of available metrics.
prometheus = false

# Address to listen for Prometheus collector(s) connections
prometheus_listen_addr = ":26660"

# Maximum number of simultaneous connections.
# If you want to accept a larger number than the default, make sure
# you increase your OS limits.
# 0 - unlimited.
max_open_connections = 3

# Instrumentation namespace
namespace = "tendermint"
`;

export const heimdallServerConfig = `
# This is a TOML config file.
# For more information, see https://github.com/toml-lang/toml

##### RPC and REST configs #####

# RPC endpoint for ethereum chain
eth_rpc_url = "http://localhost:9545"

# RPC endpoint for bor chain
bor_rpc_url = "http://{{BOR_NAME}}:{{BOR_RPC_PORT}}"

# RPC endpoint for tendermint
tendermint_rpc_url = "http://0.0.0.0:26657"

# Heimdall REST server endpoint
heimdall_rest_server = "http://0.0.0.0:1317"

#### Bridge configs ####

# AMQP endpoint
amqp_url = "amqp://guest:guest@localhost:5672/"

## Poll intervals
checkpoint_poll_interval = "5m0s"
syncer_poll_interval = "1m0s"
noack_poll_interval = "16m50s"
clerk_poll_interval = "10s"
span_poll_interval = "1m0s"
sh_state_synced_interval = "1m0s"
sh_stake_update_interval = "5m0s"
sh_max_depth_duration = "1h0m0s"

#### gas limits ####
main_chain_gas_limit = "5000000"

#### gas price ####
main_chain_max_gas_price = "400000000000"

##### Timeout Config #####
no_ack_wait_time = "30m0s"

##### chain - newSelectionAlgoHeight depends on this #####
chain = "{{CHAIN}}"
`;

export const borConfig = `
chain = "{{CHAIN}}"
identity = "{{IDENTITY}}"
log-level = "INFO"
datadir = "/var/lib/bor/data"
ancient = ""
keystore = "/var/lib/bor/keys"
syncmode = "full"
gcmode = "full"
snapshot = true
"bor.logs" = false
ethstats = ""

["eth.requiredblocks"]

[p2p]
  maxpeers = 50
  maxpendpeers = 50
  bind = "0.0.0.0"
  port = {{PEER_PORT}}
  nodiscover = false
  nat = "any"
  [p2p.discovery]
    v5disc = false
    bootnodes = [{{BOOTSTRAP_NODES}}]
    bootnodesv4 = []
    bootnodesv5 = []
    static-nodes = []
    trusted-nodes = []
    dns = []

[heimdall]
  url = "{{HEIMDALL_URL}}"
  "bor.without" = false
  grpc-address = ""

[txpool]
  locals = []
  nolocals = false
  journal = "transactions.rlp"
  rejournal = "1h0m0s"
  pricelimit = 1
  pricebump = 10
  accountslots = 16
  globalslots = 32768
  accountqueue = 16
  globalqueue = 32768
  lifetime = "3h0m0s"

[miner]
  mine = false
  etherbase = ""
  extradata = ""
  gaslimit = 30000000
  gasprice = "1000000000"

[jsonrpc]
  ipcdisable = false
  ipcpath = ""
  gascap = 50000000
  txfeecap = 5.0
  [jsonrpc.http]
    enabled = true
    port = {{RPC_PORT}}
    prefix = ""
    host = "0.0.0.0"
    api = ["eth", "net", "web3", "txpool", "bor"]
    vhosts = ["*"]
    corsdomain = ["*"]
  [jsonrpc.ws]
    enabled = false
    port = 8546
    prefix = ""
    host = "localhost"
    api = ["net", "web3"]
    origins = ["localhost"]
  [jsonrpc.graphql]
    enabled = false
    port = 0
    prefix = ""
    host = ""
    vhosts = ["localhost"]
    corsdomain = ["localhost"]
  [jsonrpc.timeouts]
    read = "30s"
    write = "30s"
    idle = "2m0s"

[gpo]
  blocks = 20
  percentile = 60
  maxprice = "5000000000000"
  ignoreprice = "2"

[telemetry]
  metrics = false
  expensive = false
  prometheus-addr = "127.0.0.1:7071"
  opencollector-endpoint = "127.0.0.1:4317"
  [telemetry.influx]
    influxdb = false
    endpoint = ""
    database = ""
    username = ""
    password = ""
    influxdbv2 = false
    token = ""
    bucket = ""
    organization = ""
    [telemetry.influx.tags]

[cache]
  cache = 1024
  gc = 25
  snapshot = 10
  database = 50
  trie = 15
  journal = "triecache"
  rejournal = "1h0m0s"
  noprefetch = false
  preimages = false
  txlookuplimit = 2350000
  triesinmemory = 128
  timeout = "1h0m0s"

[accounts]
  unlock = []
  password = ""
  allow-insecure-unlock = false
  lightkdf = false
  disable-bor-wallet = true

[grpc]
  addr = ":3131"

[developer]
  dev = false
  period = 0
`;

// Recommended bor config dump

// [Eth]
// NetworkId = 137
// SyncMode = "full"
// EthDiscoveryURLs = []
// SnapDiscoveryURLs = []
// NoPruning = false
// NoPrefetch = false
// TxLookupLimit = 2350000
// LightPeers = 100
// UltraLightFraction = 75
// DatabaseCache = 512
// DatabaseFreezer = ""
// TrieCleanCache = 154
// TrieCleanCacheJournal = "triecache"
// TrieCleanCacheRejournal = 3600000000000
// TrieDirtyCache = 256
// TrieTimeout = 3600000000000
// SnapshotCache = 102
// Preimages = false
// EnablePreimageRecording = false
// RPCGasCap = 50000000
// RPCEVMTimeout = 5000000000
// RPCTxFeeCap = 1e+00
//
// [Eth.Miner]
// GasFloor = 0
// GasCeil = 20000000
// GasPrice = 30000000000
// Recommit = 3000000000
// Noverify = false
//
// [Eth.Ethash]
// CacheDir = "ethash"
// CachesInMem = 2
// CachesOnDisk = 3
// CachesLockMmap = false
// DatasetDir = "/root/.ethash"
// DatasetsInMem = 1
// DatasetsOnDisk = 2
// DatasetsLockMmap = false
// PowMode = 0
// NotifyFull = false
//
// [Eth.TxPool]
// Locals = []
// NoLocals = true
// Journal = "transactions.rlp"
// Rejournal = 3600000000000
// PriceLimit = 1
// PriceBump = 10
// AccountSlots = 16
// GlobalSlots = 131072
// AccountQueue = 64
// GlobalQueue = 131072
// Lifetime = 5400000000000
//
// [Eth.GPO]
// Blocks = 20
// Percentile = 60
// MaxHeaderHistory = 1024
// MaxBlockHistory = 1024
// MaxPrice = 500000000000
// IgnorePrice = 2
//
// [Node]
// DataDir = "/root/data"
// IPCPath = "/root/data/bor.ipc"
// HTTPHost = "127.0.0.1"
// HTTPPort = 8545
// HTTPCors = ["*"]
// HTTPVirtualHosts = ["*"]
// HTTPModules = ["eth", "net", "web3", "txpool", "bor"]
// WSHost = ""
// WSPort = 8546
// WSModules = ["net", "web3", "eth"]
// GraphQLVirtualHosts = ["localhost"]
//
// [Node.P2P]
// MaxPeers = 200
// NoDiscovery = false
// BootstrapNodes = ["enode://d860a01f9722d78051619d1e2351aba3f43f943f6f00718d1b9baa4101932a1f5011f16bb2b1bb35db20d6fe28fa0bf09636d26a87d31de9ec6203eeedb1f666@18.138.108.67:30303", "enode://22a8232c3abc76a16ae9d6c3b164f98775fe226f0917b0ca871128a74a8e9630b458460865bab457221f1d448dd9791d24c4e5d88786180ac185df813a68d4de@3.209.45.79:30303", "enode://ca6de62fce278f96aea6ec5a2daadb877e51651247cb96ee310a318def462913b653963c155a0ef6c7d50048bba6e6cea881130857413d9f50a621546b590758@34.255.23.113:30303", "enode://279944d8dcd428dffaa7436f25ca0ca43ae19e7bcf94a8fb7d1641651f92d121e972ac2e8f381414b80cc8e5555811c2ec6e1a99bb009b3f53c4c69923e11bd8@35.158.244.151:30303", "enode://8499da03c47d637b20eee24eec3c356c9a2e6148d6fe25ca195c7949ab8ec2c03e3556126b0d7ed644675e78c4318b08691b7b57de10e5f0d40d05b09238fa0a@52.187.207.27:30303", "enode://103858bdb88756c71f15e9b5e09b56dc1be52f0a5021d46301dbbfb7e130029cc9d0d6f73f693bc29b665770fff7da4d34f3c6379fe12721b5d7a0bcb5ca1fc1@191.234.162.198:30303", "enode://715171f50508aba88aecd1250af392a45a330af91d7b90701c436b618c86aaa1589c9184561907bebbb56439b8f8787bc01f49a7c77276c58c1b09822d75e8e8@52.231.165.108:30303", "enode://5d6d7cd20d6da4bb83a1d28cadb5d409b64edf314c0335df658c1a54e32c7c4a7ab7823d57c39b6a757556e68ff1df17c748b698544a55cb488b52479a92b60f@104.42.217.25:30303"]
// BootstrapNodesV5 = ["enr:-KG4QOtcP9X1FbIMOe17QNMKqDxCpm14jcX5tiOE4_TyMrFqbmhPZHK_ZPG2Gxb1GE2xdtodOfx9-cgvNtxnRyHEmC0ghGV0aDKQ9aX9QgAAAAD__________4JpZIJ2NIJpcIQDE8KdiXNlY3AyNTZrMaEDhpehBDbZjM_L9ek699Y7vhUJ-eAdMyQW_Fil522Y0fODdGNwgiMog3VkcIIjKA", "enr:-KG4QDyytgmE4f7AnvW-ZaUOIi9i79qX4JwjRAiXBZCU65wOfBu-3Nb5I7b_Rmg3KCOcZM_C3y5pg7EBU5XGrcLTduQEhGV0aDKQ9aX9QgAAAAD__________4JpZIJ2NIJpcIQ2_DUbiXNlY3AyNTZrMaEDKnz_-ps3UUOfHWVYaskI5kWYO_vtYMGYCQRAR3gHDouDdGNwgiMog3VkcIIjKA", "enr:-Ku4QImhMc1z8yCiNJ1TyUxdcfNucje3BGwEHzodEZUan8PherEo4sF7pPHPSIB1NNuSg5fZy7qFsjmUKs2ea1Whi0EBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpD1pf1CAAAAAP__________gmlkgnY0gmlwhBLf22SJc2VjcDI1NmsxoQOVphkDqal4QzPMksc5wnpuC3gvSC8AfbFOnZY_On34wIN1ZHCCIyg", "enr:-Ku4QP2xDnEtUXIjzJ_DhlCRN9SN99RYQPJL92TMlSv7U5C1YnYLjwOQHgZIUXw6c-BvRg2Yc2QsZxxoS_pPRVe0yK8Bh2F0dG5ldHOIAAAAAAAAAACEZXRoMpD1pf1CAAAAAP__________gmlkgnY0gmlwhBLf22SJc2VjcDI1NmsxoQMeFF5GrS7UZpAH2Ly84aLK-TyvH-dRo0JM1i8yygH50YN1ZHCCJxA", "enr:-Ku4QPp9z1W4tAO8Ber_NQierYaOStqhDqQdOPY3bB3jDgkjcbk6YrEnVYIiCBbTxuar3CzS528d2iE7TdJsrL-dEKoBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpD1pf1CAAAAAP__________gmlkgnY0gmlwhBLf22SJc2VjcDI1NmsxoQMw5fqqkw2hHC4F5HZZDPsNmPdB1Gi8JPQK7pRc9XHh-oN1ZHCCKvg", "enr:-IS4QLkKqDMy_ExrpOEWa59NiClemOnor-krjp4qoeZwIw2QduPC-q7Kz4u1IOWf3DDbdxqQIgC4fejavBOuUPy-HE4BgmlkgnY0gmlwhCLzAHqJc2VjcDI1NmsxoQLQSJfEAHZApkm5edTCZ_4qps_1k_ub2CxHFxi-gr2JMIN1ZHCCIyg", "enr:-IS4QDAyibHCzYZmIYZCjXwU9BqpotWmv2BsFlIq1V31BwDDMJPFEbox1ijT5c2Ou3kvieOKejxuaCqIcjxBjJ_3j_cBgmlkgnY0gmlwhAMaHiCJc2VjcDI1NmsxoQJIdpj_foZ02MXz4It8xKD7yUHTBx7lVFn3oeRP21KRV4N1ZHCCIyg", "enr:-Ku4QHqVeJ8PPICcWk1vSn_XcSkjOkNiTg6Fmii5j6vUQgvzMc9L1goFnLKgXqBJspJjIsB91LTOleFmyWWrFVATGngBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpC1MD8qAAAAAP__________gmlkgnY0gmlwhAMRHkWJc2VjcDI1NmsxoQKLVXFOhp2uX6jeT0DvvDpPcU8FWMjQdR4wMuORMhpX24N1ZHCCIyg", "enr:-Ku4QG-2_Md3sZIAUebGYT6g0SMskIml77l6yR-M_JXc-UdNHCmHQeOiMLbylPejyJsdAPsTHJyjJB2sYGDLe0dn8uYBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpC1MD8qAAAAAP__________gmlkgnY0gmlwhBLY-NyJc2VjcDI1NmsxoQORcM6e19T1T9gi7jxEZjk_sjVLGFscUNqAY9obgZaxbIN1ZHCCIyg", "enr:-Ku4QPn5eVhcoF1opaFEvg1b6JNFD2rqVkHQ8HApOKK61OIcIXD127bKWgAtbwI7pnxx6cDyk_nI88TrZKQaGMZj0q0Bh2F0dG5ldHOIAAAAAAAAAACEZXRoMpC1MD8qAAAAAP__________gmlkgnY0gmlwhDayLMaJc2VjcDI1NmsxoQK2sBOLGcUb4AwuYzFuAVCaNHA-dy24UuEKkeFNgCVCsIN1ZHCCIyg", "enr:-Ku4QEWzdnVtXc2Q0ZVigfCGggOVB2Vc1ZCPEc6j21NIFLODSJbvNaef1g4PxhPwl_3kax86YPheFUSLXPRs98vvYsoBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpC1MD8qAAAAAP__________gmlkgnY0gmlwhDZBrP2Jc2VjcDI1NmsxoQM6jr8Rb1ktLEsVcKAPa08wCsKUmvoQ8khiOl_SLozf9IN1ZHCCIyg"]
// StaticNodes = []
// TrustedNodes = []
// ListenAddr = ":30303"
// EnableMsgEvents = false
//
// [Node.HTTPTimeouts]
// ReadTimeout = 30000000000
// WriteTimeout = 30000000000
// IdleTimeout = 120000000000
//
// [Metrics]
// Enabled = true
// HTTP = "127.0.0.1"
// Port = 6060
// InfluxDBEndpoint = "http://localhost:8086"
// InfluxDBDatabase = "geth"
// InfluxDBUsername = "test"
// InfluxDBPassword = "test"
// InfluxDBTags = "host=localhost"
// InfluxDBToken = "test"
// InfluxDBBucket = "geth"
// InfluxDBOrganization = "geth"
