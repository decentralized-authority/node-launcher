export const base = `
datadir: "/root/data"
accept-terms-of-use: true
#p2p-host-ip: "XXX.XXX.XXX.XXX"
monitoring-host: "0.0.0.0"
beacon-rpc-provider: "0.0.0.0:{{RPC_PORT}}"
wallet-password-file: "/home/validator/.eth2validators/wallet-password.txt"
http-web3provider: "http://YYY.YYY.YYY.YYY:8545"
p2p-tcp-port: {{PEER_PORT}}
p2p-udp-port: {{PEER_PORT}}
graffiti: "YOUR_GRAFFITI_HERE"
wallet-password-file: "/home/validator/.eth2validators/wallet-password.txt"
`;

export const rinkeby = `

`;