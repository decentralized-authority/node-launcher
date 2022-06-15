export const mainnetBootnodes = `
ed25519:86EtEy7epneKyrcJwSWP7zsisTkfDRH5CFVszt4qiQYw@35.195.32.249:24567,ed25519:BFB78VTDBBfCY4jCP99zWxhXUcFAZqR22oSx2KEr8UM1@35.229.222.235:24567,ed25519:Cw1YyiX9cybvz3yZcbYdG7oDV6D7Eihdfc8eM1e1KKoh@35.195.27.104:24567,ed25519:33g3PZRdDvzdRpRpFRZLyscJdbMxUA3j3Rf2ktSYwwF8@34.94.132.112:24567,ed25519:CDQFcD9bHUWdc31rDfRi4ZrJczxg8derCzybcac142tK@35.196.209.192:24567
`
export const testnetBootnodes = `
ed25519:4k9csx6zMiXy4waUvRMPTkEtAS2RFKLVScocR5HwN53P@34.73.25.182:24567,ed25519:4keFArc3M4SE1debUQWi3F1jiuFZSWThgVuA2Ja2p3Jv@34.94.158.10:24567,ed25519:D2t1KTLJuwKDhbcD9tMXcXaydMNykA99Cedz7SkJkdj2@35.234.138.23:24567,ed25519:CAzhtaUPrxCuwJoFzceebiThD9wBofzqqEMCiupZ4M3E@34.94.177.51:24567    
`
export const betanetBootnodes = `

`

export const _1261 = `
{
    "genesis_file": "genesis.json",
    "genesis_records_file": null,
    "validator_key_file": "{{KEYSTORE}}/validator_key.json",
    "node_key_file": "{{KEYSTORE}}/node_key.json",
    "rpc": {
      "addr": "0.0.0.0:{{RPC_PORT}}",
      "prometheus_addr": null,
      "cors_allowed_origins": [
        "*"
      ],
      "polling_config": {
        "polling_interval": {
          "secs": 0,
          "nanos": 500000000
        },
        "polling_timeout": {
          "secs": 10,
          "nanos": 0
        }
      },
      "limits_config": {
        "json_payload_max_size": 10485760
      },
      "enable_debug_rpc": false
    },
    "telemetry": {
      "endpoints": [
        "https://explorer.mainnet.near.org/api/nodes",
        "https://explorer.mainnet.near.org/api/nodes"
      ]
    },
    "network": {
      "addr": "0.0.0.0:{{PEER_PORT}}",
      "external_address": "",
      "boot_nodes": "{{BOOTNODES}}",
      "whitelist_nodes": "",
      "max_num_peers": 40,
      "minimum_outbound_peers": 5,
      "ideal_connections_lo": 30,
      "ideal_connections_hi": 35,
      "peer_recent_time_window": {
        "secs": 600,
        "nanos": 0
      },
      "safe_set_size": 20,
      "archival_peer_connections_lower_bound": 10,
      "handshake_timeout": {
        "secs": 20,
        "nanos": 0
      },
      "reconnect_delay": {
        "secs": 60,
        "nanos": 0
      },
      "skip_sync_wait": false,
      "ban_window": {
        "secs": 10800,
        "nanos": 0
      },
      "blacklist": [],
      "ttl_account_id_router": {
        "secs": 3600,
        "nanos": 0
      },
      "peer_stats_period": {
        "secs": 5,
        "nanos": 0
      }
    },
    "consensus": {
      "min_num_peers": 3,
      "block_production_tracking_delay": {
        "secs": 0,
        "nanos": 100000000
      },
      "min_block_production_delay": {
        "secs": 1,
        "nanos": 300000000
      },
      "max_block_production_delay": {
        "secs": 3,
        "nanos": 0
      },
      "max_block_wait_delay": {
        "secs": 6,
        "nanos": 0
      },
      "reduce_wait_for_missing_block": {
        "secs": 0,
        "nanos": 100000000
      },
      "produce_empty_blocks": true,
      "block_fetch_horizon": 50,
      "state_fetch_horizon": 5,
      "block_header_fetch_horizon": 50,
      "catchup_step_period": {
        "secs": 0,
        "nanos": 100000000
      },
      "chunk_request_retry_period": {
        "secs": 0,
        "nanos": 400000000
      },
      "header_sync_initial_timeout": {
        "secs": 10,
        "nanos": 0
      },
      "header_sync_progress_timeout": {
        "secs": 2,
        "nanos": 0
      },
      "header_sync_stall_ban_timeout": {
        "secs": 120,
        "nanos": 0
      },
      "state_sync_timeout": {
        "secs": 60,
        "nanos": 0
      },
      "header_sync_expected_height_per_second": 10,
      "sync_check_period": {
        "secs": 10,
        "nanos": 0
      },
      "sync_step_period": {
        "secs": 0,
        "nanos": 10000000
      },
      "doomslug_step_period": {
        "secs": 0,
        "nanos": 100000000
      }
    },
    "tracked_accounts": [],
    "tracked_shards": [
      0
    ],
    "archive": false,
    "log_summary_style": "colored",
    "gc_blocks_limit": 2,
    "gc_fork_clean_step": 100,
    "gc_num_epochs_to_keep": 5,
    "view_client_threads": 4,
    "epoch_sync_enabled": true,
    "view_client_throttle_period": {
      "secs": 30,
      "nanos": 0
    },
    "trie_viewer_state_size_limit": 50000,
    "use_db_migration_snapshot": true,
    "store": {
      "enable_statistics": false,
      "max_open_files": 10000,
      "col_state_cache_size": 536870912,
      "block_size": 16384
    }
  }
  `

export const _1260 = `
{
  "genesis_file": "genesis.json",
  "genesis_records_file": null,
  "validator_key_file": "validator_key.json",
  "node_key_file": "node_key.json",
  "rpc": {
    "addr": "0.0.0.0:3030",
    "prometheus_addr": null,
    "cors_allowed_origins": [
      "*"
    ],
    "polling_config": {
      "polling_interval": {
        "secs": 0,
        "nanos": 500000000
      },
      "polling_timeout": {
        "secs": 10,
        "nanos": 0
      }
    },
    "limits_config": {
      "json_payload_max_size": 10485760
    },
    "enable_debug_rpc": false
  },
  "telemetry": {
    "endpoints": [
      "https://explorer.mainnet.near.org/api/nodes",
      "https://explorer.mainnet.near.org/api/nodes"
    ]
  },
  "network": {
    "addr": "0.0.0.0:24567",
    "external_address": "",
    "boot_nodes": "ed25519:86EtEy7epneKyrcJwSWP7zsisTkfDRH5CFVszt4qiQYw@35.195.32.249:24567,ed25519:BFB78VTDBBfCY4jCP99zWxhXUcFAZqR22oSx2KEr8UM1@35.229.222.235:24567,ed25519:Cw1YyiX9cybvz3yZcbYdG7oDV6D7Eihdfc8eM1e1KKoh@35.195.27.104:24567,ed25519:33g3PZRdDvzdRpRpFRZLyscJdbMxUA3j3Rf2ktSYwwF8@34.94.132.112:24567,ed25519:CDQFcD9bHUWdc31rDfRi4ZrJczxg8derCzybcac142tK@35.196.209.192:24567",
    "whitelist_nodes": "",
    "max_num_peers": 40,
    "minimum_outbound_peers": 5,
    "ideal_connections_lo": 30,
    "ideal_connections_hi": 35,
    "peer_recent_time_window": {
      "secs": 600,
      "nanos": 0
    },
    "safe_set_size": 20,
    "archival_peer_connections_lower_bound": 10,
    "handshake_timeout": {
      "secs": 20,
      "nanos": 0
    },
    "reconnect_delay": {
      "secs": 60,
      "nanos": 0
    },
    "skip_sync_wait": false,
    "ban_window": {
      "secs": 10800,
      "nanos": 0
    },
    "blacklist": [],
    "ttl_account_id_router": {
      "secs": 3600,
      "nanos": 0
    },
    "peer_stats_period": {
      "secs": 5,
      "nanos": 0
    }
  },
  "consensus": {
    "min_num_peers": 3,
    "block_production_tracking_delay": {
      "secs": 0,
      "nanos": 100000000
    },
    "min_block_production_delay": {
      "secs": 1,
      "nanos": 300000000
    },
    "max_block_production_delay": {
      "secs": 3,
      "nanos": 0
    },
    "max_block_wait_delay": {
      "secs": 6,
      "nanos": 0
    },
    "reduce_wait_for_missing_block": {
      "secs": 0,
      "nanos": 100000000
    },
    "produce_empty_blocks": true,
    "block_fetch_horizon": 50,
    "state_fetch_horizon": 5,
    "block_header_fetch_horizon": 50,
    "catchup_step_period": {
      "secs": 0,
      "nanos": 100000000
    },
    "chunk_request_retry_period": {
      "secs": 0,
      "nanos": 400000000
    },
    "header_sync_initial_timeout": {
      "secs": 10,
      "nanos": 0
    },
    "header_sync_progress_timeout": {
      "secs": 2,
      "nanos": 0
    },
    "header_sync_stall_ban_timeout": {
      "secs": 120,
      "nanos": 0
    },
    "state_sync_timeout": {
      "secs": 60,
      "nanos": 0
    },
    "header_sync_expected_height_per_second": 10,
    "sync_check_period": {
      "secs": 10,
      "nanos": 0
    },
    "sync_step_period": {
      "secs": 0,
      "nanos": 10000000
    },
    "doomslug_step_period": {
      "secs": 0,
      "nanos": 100000000
    }
  },
  "tracked_accounts": [],
  "tracked_shards": [
    0
  ],
  "archive": false,
  "log_summary_style": "colored",
  "gc_blocks_limit": 2,
  "gc_fork_clean_step": 100,
  "gc_num_epochs_to_keep": 5,
  "view_client_threads": 4,
  "epoch_sync_enabled": true,
  "view_client_throttle_period": {
    "secs": 30,
    "nanos": 0
  },
  "trie_viewer_state_size_limit": 50000,
  "use_db_migration_snapshot": true,
  "store": {
    "enable_statistics": false,
    "max_open_files": 10000,
    "col_state_cache_size": 536870912,
    "block_size": 16384
  }
}
`