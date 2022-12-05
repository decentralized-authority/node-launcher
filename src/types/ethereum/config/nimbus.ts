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
jwt-secret = "/var/lib/config/jwt.hex"
`



export const validator = `

validators-dir = "/var/lib/keystore/validators"
secrets-dir = "/run/secrets"
suggested-fee-recipient = {{ETH1_ADDRESS}}
doppelganger-detection = true
in-process-validators = true
`
