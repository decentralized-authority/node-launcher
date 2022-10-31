export const beacon = `
datadir: "/root/data"
accept-terms-of-use: true
rpc-http-enabled: true
http-modules: "prysm,eth"
#network-id: 0
rpc-host: "0.0.0.0"
rpc-port: {{VALIDATOR_RPC_PORT}} # this is the port the validator needs to connect to. (they both use grpc, but this is technical debt) I think this should not be exposed to user in docker and be closed to the world
grpc-gateway-corsdomain: "*"
grpc-gateway-host: "0.0.0.0"
grpc-gateway-port: {{RPC_PORT}} # this is the rest api for querying and apps and stuff, okay to expose in docker for user but close in firewall to world
grpc-max-msg-size: 65568081
p2p-tcp-port: {{PEER_PORT}}
p2p-udp-port: {{PEER_PORT}} # be sure to expose #:#udp
execution-endpoint: "{{EXEC}}"
checkpoint-sync-url: "{{CHECKPOINT_SYNC_URL}}" # syncs in ~12 hours, should we still rely on a checkpoint now that we've gotten past the merge hump?
genesis-beacon-api-url: "{{GENESIS_BEACON_API_URL}}"
jwt-secret: /root/config/jwt.hex

# will add 1TB + and needs to be enabled on validator as well
historical-slasher-node: false
slasher: false

`;

export const validator = `
accept-terms-of-use: true
log-file: "/root/data/validator.log"
verbosity: "info"
keys-dir: "/root/keystore/validator_keys/" # to import from
account-password-file: "/.hidden/pass.pwd"
wallet-dir: "/root/keystore/" # to place imported file into
wallet-password-file: "/.hidden/pass.pwd"
enable-doppelganger: true

# grpc-gateway-corsdomain: "http://localhost:7500,http://127.0.0.1:7500,http://0.0.0.0:7500,http://localhost:4242,http://127.0.0.1:4242,http://localhost:4200,http://0.0.0.0:4242,http://127.0.0.1:4200,http://0.0.0.0:4200,http://localhost:3000,http://0.0.0.0:3000,http://127.0.0.1:3000" #Comma separated list of domains from which to accept cross origin requests (browser enforced). This flag has no effect if not used with --grpc-gateway-port. (default: "http://localhost:7500,http://127.0.0.1:7500,http://0.0.0.0:7500,http://localhost:4242,http://127.0.0.1:4242,http://localhost:4200,http://0.0.0.0:4242,http://127.0.0.1:4200,http://0.0.0.0:4200,http://localhost:3000,http://0.0.0.0:3000,http://127.0.0.1:3000")
grpc-gateway-host: "0.0.0.0" #The host on which the gateway server runs on (default: "127.0.0.1")
grpc-gateway-port: {{RPC_PORT}}

graffiti: "Running with Node Launcher"
beacon-rpc-provider: "{{CONSENSUS}}"
jwt-secret: /root/config/jwt.hex
suggested-fee-recipient: {{ETH1_ADDRESS}}

#enable-external-slasher-protection: false # to use must enable --slasher on beacon, and point validator to slasher port
#slasher-rpc-provider: "{{CONSENSUS}}"
# proposer-settings-file: fee recipient yml diff recipients for each validator
# /path/to/geth.ipc
# p2p-host-ip: "XXX.XXX.XXX.XXX"
# monitoring-host: "0.0.0.0"
# http-web3provider: "http://YYY.YYY.YYY.YYY:8545" deprecated
`;
