export const base = `
datadir = "/erigon/data"
port = "{{PEER_PORT}}"
chain = "{{NETWORK}}"
http = "true"

"http.addr" = "0.0.0.0"
"http.api" = "engine,eth,erigon,web3,net,debug,trace,txpool"
"http.port" = "{{RPC_PORT}}"
"http.corsdomain" = "*"
`;