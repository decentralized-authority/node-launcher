export const base = `
datadir = "/erigon/data/erigon"
port = "{{PEER_PORT}}"
chain = "{{NETWORK}}"
http = "true"

"http.addr" = "0.0.0.0"
"http.api" = "eth,erigon,web3,net,debug,trace,txpool,miner"
"http.port" = "{{RPC_PORT}}"
"http.corsdomain" = "*"

"authrpc.jwtsecret" = "/erigon/config/jwt.hex"
"authrpc.addr" = "0.0.0.0"
"authrpc.port" = {{AUTH_PORT}}
"authrpc.vhosts" = "*"
`;

// "log.dir.verbosity" = 4
// "log.console.verbosity" = 0
// "log.dir.path" = "/erigon/data/"
