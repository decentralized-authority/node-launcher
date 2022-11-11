export const teku = `
# network
network: {{NETWORK}}
initial-state: {{INITIAL_STATE}}

# database
data-path: "/opt/teku/data/"
data-storage-mode: "prune"

#
logging: "INFO"
log-destination: "BOTH"
log-file: "/opt/teku/data/teku.log"

# execution engine
ee-endpoint: "http://{{EXEC}}"
ee-jwt-secret-file: "/opt/teku/config/jwt.hex" 

# rpc
rest-api-enabled: true
rest-api-interface: "0.0.0.0"
rest-api-port: {{RPC_PORT}}
rest-api-cors-origins: ["*"]
p2p-port: {{PEER_PORT}}
`;

validator = `

# validators
validator-keys: "/root/keystore/validators:/.hidden/"
validators-graffiti: "Running with Node Launcher"
validator-api-keystore-password-file: "/.hidden/pass.pwd"
validator-api-port: {{VALIDATOR_RPC}}
validators-external-signer-slashing-protection-enabled: false

# fee recipient
validators-proposer-default-fee-recipient: "{{ETH1_ADDRESS}}"

# metrics
metrics-enabled: true
metrics-port: 8008
`


