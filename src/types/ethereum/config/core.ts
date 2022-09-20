export const base = `
[Eth]
NetworkId = 1
[Node]
DataDir = "/root/data"
KeyStoreDir = "/root/keystore"
HTTPHost = "0.0.0.0"
HTTPPort = {{RPC_PORT}}
HTTPVirtualHosts = ["*"]
HTTPModules = ["net", "web3", "eth"]

IPCPath = "/root/config/geth.ipc"
AuthAddr = "0.0.0.0"
AuthPort = {{AUTH_PORT}}
AuthVirtualHosts = ["*"]
JWTSecret = "/root/config/jwt.hex"

[Node.P2P]
ListenAddr = ":{{PEER_PORT}}"
`;
