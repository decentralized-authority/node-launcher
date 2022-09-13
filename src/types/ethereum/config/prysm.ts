export const beacon = `
datadir: "/root/data"
accept-terms-of-use: true
beacon-rpc-provider: "0.0.0.0:{{RPC_PORT}}"
rpc-host: "0.0.0.0"
p2p-tcp-port: {{PEER_PORT}}
p2p-udp-port: {{PEER_PORT}}
execution-endpoint: "http://192.168.100.6:10021"
`;

export const validator = `
#p2p-host-ip: "XXX.XXX.XXX.XXX"
monitoring-host: "0.0.0.0"
wallet-password-file: "/home/validator/.eth2validators/wallet-password.txt"
http-web3provider: "http://YYY.YYY.YYY.YYY:8545"
graffiti: "YOUR_GRAFFITI_HERE"
beacon-rpc-provider: "0.0.0.0:{{RPC_PORT}}"
`;