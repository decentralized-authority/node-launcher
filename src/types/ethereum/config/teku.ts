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
ee-endpoint: "{{EXEC}}"
ee-jwt-secret-file: "/opt/teku/config/jwt.hex" 

# rpc
rest-api-enabled: true
rest-api-interface: "0.0.0.0"
rest-api-port: {{RPC_PORT}}
rest-api-cors-origins: ["*"]
rest-api-host-allowlist: ["*"]
p2p-port: {{PEER_PORT}}
`;

export const validator = `

# validators
#validator-keys: ":"
validators-graffiti: "Running with Node Launcher"
validator-api-port: {{VALIDATOR_RPC_PORT}}
validators-external-signer-slashing-protection-enabled: false

# fee recipient
validators-proposer-default-fee-recipient: "{{ETH1_ADDRESS}}"

# metrics
metrics-enabled: true
metrics-port: 8008
`


