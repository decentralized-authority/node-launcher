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
  cache = 4096
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
