export const base = `
[Eth]
NetworkId = 1
[Node]
DataDir = "/root/.ethereum"
KeyStoreDir = "/root/keystore"
HTTPHost = "0.0.0.0"
HTTPPort = {{RPC_PORT}}
HTTPVirtualHosts = ["*"]
HTTPModules = ["net", "web3", "eth"]


IPCPath = "/root/config/geth.ipc"
AuthAddr = "localhost"
AuthPort = 8551
AuthVirtualHosts = ["*"]
JWTSecret = "/root/keystore/jwt.hex"

[Node.P2P]
ListenAddr = ":{{PEER_PORT}}"

`;