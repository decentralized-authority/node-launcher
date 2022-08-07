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

[Node.P2P]
ListenAddr = ":{{PEER_PORT}}"
`;