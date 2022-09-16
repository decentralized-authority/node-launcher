export const beacon = `
datadir: "/root/data"
accept-terms-of-use: true
rpc-http-enabled: true
http-modules: "prysm,eth"
network-id: 0
rpc-host: "0.0.0.0"
rpc-port: {{RPC_PORT}}
p2p-tcp-port: {{PEER_PORT}}
p2p-udp-port: {{PEER_PORT}}
execution-endpoint: "{{EXEC}}"
checkpoint-sync-url: "{{CHECKPOINT_SYNC_URL}}"
genesis-beacon-api-url: "{{GENESIS_BEACON_API_URL}}"
jwt-secret: /root/config/jwt.hex
`;

export const validator = `
#/path/to/geth.ipc
#p2p-host-ip: "XXX.XXX.XXX.XXX"
monitoring-host: "0.0.0.0"
wallet-password-file: "/home/validator/.eth2validators/wallet-password.txt"
#should be wallet dir flag
# http-web3provider: "http://YYY.YYY.YYY.YYY:8545" deprecated
graffiti: "YOUR_GRAFFITI_HERE"
beacon-rpc-provider: "0.0.0.0:{{RPC_PORT}}" #not used for beacon
--jwt-secret value  #REQUIRED if connecting to an execution node via HTTP. Provides a path to a file containing a hex-encoded string representing a 32 byte secret used for authentication with an execution node via HTTP. If this is not set, all requests to execution nodes via HTTP for consensus-related calls will fail, which will prevent your validators from performing their duties. This is not required if using an IPC connection.
`;
