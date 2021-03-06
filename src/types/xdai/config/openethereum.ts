export const openEthereumConfig = `
[parity]
base_path = "/blockchain/data"
db_path = "/blockchain/data/chains"
keys_path = "/blockchain/keys"
chain = "xdai"

[footprint]
tracing = "off"
db_compaction = "ssd"
pruning = "fast"
fat_db = "off"

[rpc]
disable = false
port = {{RPC_PORT}}
interface = "all"
cors = ["null"]
apis = ["web3", "eth", "net", "parity", "traces"]
hosts = ["all"]
allow_missing_blocks = false

[websockets]
disable = true

[ipc]
disable = true

[misc]
logging = "own_tx=trace"
log_file = "/blockchain/data/xdai.log"

[network]
port = {{PEER_PORT}}
bootnodes = ["enode://4716883567b5317aad93ea28e707fad0631fb4aa5ac7c5fbd485380b01d8801c21a8cbf4d6ee3a2c9b2b070a270a49d4a2a0da9e1d47a1f433dafbaf7b2edd06@157.245.92.222:30303,enode://ab7f6c633ba2dc54795dfd2c739ba7d964f499541c0b8d8ba9d275bd3df1b789470a21a921a469fa515a3dfccc96a434a3fd016a169d88d0043fc6744f34288e@67.205.180.17:30303,enode://0caa2d84aef00d0bc5de6cf9db3e736da245d882ec8f91e201b3e1635960e62cbb2f8bfc57e679ff3e1d53da2773e31df624a56b2f457ecb51d09fdf9970c86b@67.205.145.143:30303,enode://bd75111424c42c349fc255db017ac0be370b37b558627e3bbc41319071ef7642c04cdbd2b674193a99aa35d67a83016ab293b8ab87ed4a4606e69f114ac95535@157.230.185.80:30303,enode://bd75111424c42c349fc255db017ac0be370b37b558627e3bbc41319071ef7642c04cdbd2b674193a99aa35d67a83016ab293b8ab87ed4a4606e69f114ac95535@161.35.51.60:30303,enode://ef94ffb10c440dd990c5c4be1c85046f5f7329ba60d23db7a68c8b91b6a721081f8190369f3a32f3c02d213127b2066eb42ee0444998d354ba0923378522acb3@161.35.62.72:30303,enode://4a0eadf22d6a37c5596fd2df2a53a26a5b59dd863e67246ab94e6a81b31765e08d9f70a4dd9683221e63cc2120c8a808a6a457455bd658bdf49c688c62db2011@51.81.244.170:30303,enode://e75a1e9f080bd6012b39321c0f2d984567172625280b3e7362e962a42578c5e79c847b3eb83aa7e2a4cdeefbfadf0c36ed2719cad1d5e6377ccd6ebe314cc6bc@64.227.97.130:30303,enode://6674773f7aac78d5527fa90c847dcbca198de4081306406a8fec5c15f7a2e141362344041291dd10d0aafa7706a3d8f21a08b6f6834a5b1aab9cccd8ca35ccee@143.110.226.15:30303,enode://0caa2d84aef00d0bc5de6cf9db3e736da245d882ec8f91e201b3e1635960e62cbb2f8bfc57e679ff3e1d53da2773e31df624a56b2f457ecb51d09fdf9970c86b@134.122.24.231:30303"]
`;
