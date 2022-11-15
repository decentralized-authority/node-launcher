export const base = `
network = "{{NETWORK}}"
data-dir = "/var/lib/data"
#trusted-node-url = "{{CHECKPOINT_SYNC_URL}}"
#log-level = "info"
tcp-port = {{PEER_PORT}}
udp-port = {{PEER_PORT}}
rest = true
rest-port = {{RPC_PORT}}
rest-address = "0.0.0.0"
#backfill = false #??
web3-url = ["{{EXEC}}"]

jwt-secret = "/var/lib/config/jwt.hex"`

export const validator = ``
//metrics
//metrics-port=8008 \
//#suggested-fee-recipient=0x_CHANGE_THIS_TO_MY_ETH_FEE_RECIPIENT_ADDRESS