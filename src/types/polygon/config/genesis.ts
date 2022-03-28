export const heimdallMainnet = `
{
  "genesis_time": "2020-05-30T04:28:03.177054Z",
  "chain_id": "heimdall-137",
  "consensus_params": {
    "block": {
      "max_bytes": "22020096",
      "max_gas": "25000000",
      "time_iota_ms": "1000"
    },
    "evidence": {
      "max_age": "100000"
    },
    "validator": {
      "pub_key_types": [
        "secp256k1"
      ]
    }
  },
  "app_hash": "",
  "app_state": {
    "auth": {
      "params": {
        "max_memo_characters": "256",
        "tx_sig_limit": "7",
        "tx_size_cost_per_byte": "10",
        "sig_verify_cost_ed25519": "590",
        "sig_verify_cost_secp256k1": "1000",
        "max_tx_gas": "1000000",
        "tx_fees": "1000000000000000"
      },
      "accounts": [
        {
          "address": "0x5973918275c01f50555d44e92c9d9b353cadad54",
          "coins": [
            {
              "denom": "matic",
              "amount": "10000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        },
        {
          "address": "0xb8bb158b93c94ed35c1970d610d1e2b34e26652c",
          "coins": [
            {
              "denom": "matic",
              "amount": "10000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        },
        {
          "address": "0xf84c74dea96df0ec22e11e7c33996c73fcc2d822",
          "coins": [
            {
              "denom": "matic",
              "amount": "10000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        },
        {
          "address": "0xb702f1c9154ac9c08da247a8e30ee6f2f3373f41",
          "coins": [
            {
              "denom": "matic",
              "amount": "10000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        },
        {
          "address": "0x7fcd58c2d53d980b247f1612fdba93e9a76193e6",
          "coins": [
            {
              "denom": "matic",
              "amount": "10000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        },
        {
          "address": "0x0375b2fc7140977c9c76d45421564e354ed42277",
          "coins": [
            {
              "denom": "matic",
              "amount": "10000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        },
        {
          "address": "0x42eefcda06ead475cde3731b8eb138e88cd0bac3",
          "coins": [
            {
              "denom": "matic",
              "amount": "10000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        }
      ]
    },
    "bank": {
      "send_enabled": true
    },
    "bor": {
      "params": {
        "sprint_duration": "64",
        "span_duration": "6400",
        "producer_count": "11"
      },
      "spans": [
        {
          "span_id": "0",
          "start_block": "0",
          "end_block": "255",
          "validator_set": {
            "validators": [
              {
                "ID": "6",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x0447ed13442b485dd6990efc01d4297d798e90d3fa8467dd9c2f50ffe3238c8bf722f6c774f584b5fe91364b7b430c5a24fe57aca48665cf778030266f2c452bd9",
                "signer": "0x0375b2fc7140977c9c76d45421564e354ed42277",
                "last_updated": "",
                "jailed": false,
                "accum": "-60000"
              },
              {
                "ID": "7",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x043522a004012c9740703f676b95b5121edd7237fb0f182c3c45e7c7a77eaa67a20e6d0ac025d5bd96295bf95e2e875ab2a9da5c0e547b7d00ca7ede33c1b03893",
                "signer": "0x42eefcda06ead475cde3731b8eb138e88cd0bac3",
                "last_updated": "",
                "jailed": false,
                "accum": "10000"
              },
              {
                "ID": "1",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x043c53ea6e1964e0670dc9ac72b3224207885d4c5f08cabe1e1080c662fdec278e7e833798757cb5cf121447dcd02a15f010eb4aa87cceecb23daa4bf904112e77",
                "signer": "0x5973918275c01f50555d44e92c9d9b353cadad54",
                "last_updated": "",
                "jailed": false,
                "accum": "10000"
              },
              {
                "ID": "5",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x0479efe8c50b1f9923f48a467ecac0a64c2d6bcaa9ae67e135df84cac5aed5321f9cbb29c115f26dc84f2ef0e5fea29615848c79d690cb205cc10d688324ae8bce",
                "signer": "0x7fcd58c2d53d980b247f1612fdba93e9a76193e6",
                "last_updated": "",
                "jailed": false,
                "accum": "10000"
              },
              {
                "ID": "4",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x04b4e1d56b3429f7756452426be611e595debcb858d59f47d29ec9dd6e4b547dce1539f9b7144420bc309de496b70d6dc5f13345eee85e6b7fb332cd9f364ef12f",
                "signer": "0xb702f1c9154ac9c08da247a8e30ee6f2f3373f41",
                "last_updated": "",
                "jailed": false,
                "accum": "10000"
              },
              {
                "ID": "2",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x04d6b06c725f5410e4ccbd65906ece180364ebea4902b21232c1fb5892a76be7eec22480397d6bf653e9abe7ac50435ee472b59364fe78b17acb2be2116f92a76f",
                "signer": "0xb8bb158b93c94ed35c1970d610d1e2b34e26652c",
                "last_updated": "",
                "jailed": false,
                "accum": "10000"
              },
              {
                "ID": "3",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x040600efda73e1404b0c596e08c78c5ed51631fc173e5f39d21deeddd5712fcd7d6d440c53d211eb48b03063a05b2c0c0eb084053dfcf1c6540def705c8e028456",
                "signer": "0xf84c74dea96df0ec22e11e7c33996c73fcc2d822",
                "last_updated": "",
                "jailed": false,
                "accum": "10000"
              }
            ],
            "proposer": {
              "ID": "6",
              "startEpoch": "0",
              "endEpoch": "0",
              "nonce": "1",
              "power": "10000",
              "pubKey": "0x0447ed13442b485dd6990efc01d4297d798e90d3fa8467dd9c2f50ffe3238c8bf722f6c774f584b5fe91364b7b430c5a24fe57aca48665cf778030266f2c452bd9",
              "signer": "0x0375b2fc7140977c9c76d45421564e354ed42277",
              "last_updated": "",
              "jailed": false,
              "accum": "-60000"
            }
          },
          "selected_producers": [
            {
              "ID": "6",
              "startEpoch": "0",
              "endEpoch": "0",
              "nonce": "1",
              "power": "10000",
              "pubKey": "0x0447ed13442b485dd6990efc01d4297d798e90d3fa8467dd9c2f50ffe3238c8bf722f6c774f584b5fe91364b7b430c5a24fe57aca48665cf778030266f2c452bd9",
              "signer": "0x0375b2fc7140977c9c76d45421564e354ed42277",
              "last_updated": "",
              "jailed": false,
              "accum": "-60000"
            },
            {
              "ID": "7",
              "startEpoch": "0",
              "endEpoch": "0",
              "nonce": "1",
              "power": "10000",
              "pubKey": "0x043522a004012c9740703f676b95b5121edd7237fb0f182c3c45e7c7a77eaa67a20e6d0ac025d5bd96295bf95e2e875ab2a9da5c0e547b7d00ca7ede33c1b03893",
              "signer": "0x42eefcda06ead475cde3731b8eb138e88cd0bac3",
              "last_updated": "",
              "jailed": false,
              "accum": "10000"
            },
            {
              "ID": "1",
              "startEpoch": "0",
              "endEpoch": "0",
              "nonce": "1",
              "power": "10000",
              "pubKey": "0x043c53ea6e1964e0670dc9ac72b3224207885d4c5f08cabe1e1080c662fdec278e7e833798757cb5cf121447dcd02a15f010eb4aa87cceecb23daa4bf904112e77",
              "signer": "0x5973918275c01f50555d44e92c9d9b353cadad54",
              "last_updated": "",
              "jailed": false,
              "accum": "10000"
            },
            {
              "ID": "5",
              "startEpoch": "0",
              "endEpoch": "0",
              "nonce": "1",
              "power": "10000",
              "pubKey": "0x0479efe8c50b1f9923f48a467ecac0a64c2d6bcaa9ae67e135df84cac5aed5321f9cbb29c115f26dc84f2ef0e5fea29615848c79d690cb205cc10d688324ae8bce",
              "signer": "0x7fcd58c2d53d980b247f1612fdba93e9a76193e6",
              "last_updated": "",
              "jailed": false,
              "accum": "10000"
            }
          ],
          "bor_chain_id": "137"
        }
      ]
    },
    "chainmanager": {
      "params": {
        "mainchain_tx_confirmations": "6",
        "maticchain_tx_confirmations": "10",
        "chain_params": {
          "bor_chain_id": "137",
          "matic_token_address": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
          "staking_manager_address": "0x88F65097BA6E10F25E93bf41987f9416BBB303eB",
          "slash_manager_address": "0xbfAEa5DCcbA49DB25A9F9DD0E4245Ba7b1858aB4",
          "root_chain_address": "0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287",
          "staking_info_address": "0xCe911aE0ffe9F54F96AFE49FC9BcBA0658f5CD1F",
          "state_sender_address": "0x28e4F3a7f651294B9564800b2D01f35189A5bFbE",
          "state_receiver_address": "0x0000000000000000000000000000000000001001",
          "validator_set_address": "0x0000000000000000000000000000000000001000"
        }
      }
    },
    "checkpoint": {
      "params": {
        "checkpoint_buffer_time": "1000000000000",
        "avg_checkpoint_length": "256",
        "max_checkpoint_length": "1024",
        "child_chain_block_interval": "10000"
      },
      "buffered_checkpoint": null,
      "last_no_ack": "0",
      "ack_count": "0",
      "checkpoints": null
    },
    "clerk": {
      "event_records": [],
      "record_sequences": null
    },
    "gov": {
      "starting_proposal_id": "1",
      "deposits": null,
      "votes": null,
      "proposals": null,
      "deposit_params": {
        "min_deposit": [
          {
            "denom": "matic",
            "amount": "100000000000000000000"
          }
        ],
        "max_deposit_period": "3600000000000"
      },
      "voting_params": {
        "voting_period": "3600000000000"
      },
      "tally_params": {
        "quorum": "0.334000000000000000",
        "threshold": "0.500000000000000000",
        "veto": "0.334000000000000000"
      }
    },
    "params": null,
    "sidechannel": {
      "past_commits": []
    },
    "slashing": {
      "params": {
        "signed_blocks_window": "100",
        "min_signed_per_window": "0.500000000000000000",
        "downtime_jail_duration": "600000000000",
        "slash_fraction_double_sign": "0.050000000000000000",
        "slash_fraction_downtime": "0.010000000000000000",
        "slash_fraction_limit": "0.333333333333333333",
        "jail_fraction_limit": "0.333333333333333333",
        "max_evidence_age": "120000000000",
        "enable_slashing": false
      },
      "signing_infos": {
        "1": {
          "valID": "1",
          "startHeight": "0",
          "indexOffset": "0"
        },
        "2": {
          "valID": "2",
          "startHeight": "0",
          "indexOffset": "0"
        },
        "3": {
          "valID": "3",
          "startHeight": "0",
          "indexOffset": "0"
        },
        "4": {
          "valID": "4",
          "startHeight": "0",
          "indexOffset": "0"
        },
        "5": {
          "valID": "5",
          "startHeight": "0",
          "indexOffset": "0"
        },
        "6": {
          "valID": "6",
          "startHeight": "0",
          "indexOffset": "0"
        },
        "7": {
          "valID": "7",
          "startHeight": "0",
          "indexOffset": "0"
        }
      },
      "missed_blocks": {},
      "buffer_val_slash_info": null,
      "tick_val_slash_info": null,
      "tick_count": "0"
    },
    "staking": {
      "validators": [
        {
          "ID": "1",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x043c53ea6e1964e0670dc9ac72b3224207885d4c5f08cabe1e1080c662fdec278e7e833798757cb5cf121447dcd02a15f010eb4aa87cceecb23daa4bf904112e77",
          "signer": "0x5973918275c01f50555d44e92c9d9b353cadad54",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        },
        {
          "ID": "2",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x04d6b06c725f5410e4ccbd65906ece180364ebea4902b21232c1fb5892a76be7eec22480397d6bf653e9abe7ac50435ee472b59364fe78b17acb2be2116f92a76f",
          "signer": "0xb8bb158b93c94ed35c1970d610d1e2b34e26652c",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        },
        {
          "ID": "3",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x040600efda73e1404b0c596e08c78c5ed51631fc173e5f39d21deeddd5712fcd7d6d440c53d211eb48b03063a05b2c0c0eb084053dfcf1c6540def705c8e028456",
          "signer": "0xf84c74dea96df0ec22e11e7c33996c73fcc2d822",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        },
        {
          "ID": "4",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x04b4e1d56b3429f7756452426be611e595debcb858d59f47d29ec9dd6e4b547dce1539f9b7144420bc309de496b70d6dc5f13345eee85e6b7fb332cd9f364ef12f",
          "signer": "0xb702f1c9154ac9c08da247a8e30ee6f2f3373f41",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        },
        {
          "ID": "5",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x0479efe8c50b1f9923f48a467ecac0a64c2d6bcaa9ae67e135df84cac5aed5321f9cbb29c115f26dc84f2ef0e5fea29615848c79d690cb205cc10d688324ae8bce",
          "signer": "0x7fcd58c2d53d980b247f1612fdba93e9a76193e6",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        },
        {
          "ID": "6",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x0447ed13442b485dd6990efc01d4297d798e90d3fa8467dd9c2f50ffe3238c8bf722f6c774f584b5fe91364b7b430c5a24fe57aca48665cf778030266f2c452bd9",
          "signer": "0x0375b2fc7140977c9c76d45421564e354ed42277",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        },
        {
          "ID": "7",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x043522a004012c9740703f676b95b5121edd7237fb0f182c3c45e7c7a77eaa67a20e6d0ac025d5bd96295bf95e2e875ab2a9da5c0e547b7d00ca7ede33c1b03893",
          "signer": "0x42eefcda06ead475cde3731b8eb138e88cd0bac3",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        }
      ],
      "current_val_set": {
        "validators": [
          {
            "ID": "6",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x0447ed13442b485dd6990efc01d4297d798e90d3fa8467dd9c2f50ffe3238c8bf722f6c774f584b5fe91364b7b430c5a24fe57aca48665cf778030266f2c452bd9",
            "signer": "0x0375b2fc7140977c9c76d45421564e354ed42277",
            "last_updated": "",
            "jailed": false,
            "accum": "-60000"
          },
          {
            "ID": "7",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x043522a004012c9740703f676b95b5121edd7237fb0f182c3c45e7c7a77eaa67a20e6d0ac025d5bd96295bf95e2e875ab2a9da5c0e547b7d00ca7ede33c1b03893",
            "signer": "0x42eefcda06ead475cde3731b8eb138e88cd0bac3",
            "last_updated": "",
            "jailed": false,
            "accum": "10000"
          },
          {
            "ID": "1",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x043c53ea6e1964e0670dc9ac72b3224207885d4c5f08cabe1e1080c662fdec278e7e833798757cb5cf121447dcd02a15f010eb4aa87cceecb23daa4bf904112e77",
            "signer": "0x5973918275c01f50555d44e92c9d9b353cadad54",
            "last_updated": "",
            "jailed": false,
            "accum": "10000"
          },
          {
            "ID": "5",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x0479efe8c50b1f9923f48a467ecac0a64c2d6bcaa9ae67e135df84cac5aed5321f9cbb29c115f26dc84f2ef0e5fea29615848c79d690cb205cc10d688324ae8bce",
            "signer": "0x7fcd58c2d53d980b247f1612fdba93e9a76193e6",
            "last_updated": "",
            "jailed": false,
            "accum": "10000"
          },
          {
            "ID": "4",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x04b4e1d56b3429f7756452426be611e595debcb858d59f47d29ec9dd6e4b547dce1539f9b7144420bc309de496b70d6dc5f13345eee85e6b7fb332cd9f364ef12f",
            "signer": "0xb702f1c9154ac9c08da247a8e30ee6f2f3373f41",
            "last_updated": "",
            "jailed": false,
            "accum": "10000"
          },
          {
            "ID": "2",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x04d6b06c725f5410e4ccbd65906ece180364ebea4902b21232c1fb5892a76be7eec22480397d6bf653e9abe7ac50435ee472b59364fe78b17acb2be2116f92a76f",
            "signer": "0xb8bb158b93c94ed35c1970d610d1e2b34e26652c",
            "last_updated": "",
            "jailed": false,
            "accum": "10000"
          },
          {
            "ID": "3",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x040600efda73e1404b0c596e08c78c5ed51631fc173e5f39d21deeddd5712fcd7d6d440c53d211eb48b03063a05b2c0c0eb084053dfcf1c6540def705c8e028456",
            "signer": "0xf84c74dea96df0ec22e11e7c33996c73fcc2d822",
            "last_updated": "",
            "jailed": false,
            "accum": "10000"
          }
        ],
        "proposer": {
          "ID": "6",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x0447ed13442b485dd6990efc01d4297d798e90d3fa8467dd9c2f50ffe3238c8bf722f6c774f584b5fe91364b7b430c5a24fe57aca48665cf778030266f2c452bd9",
          "signer": "0x0375b2fc7140977c9c76d45421564e354ed42277",
          "last_updated": "",
          "jailed": false,
          "accum": "-60000"
        }
      },
      "staking_sequences": null
    },
    "supply": {
      "supply": {
        "total": []
      }
    },
    "topup": {
      "tx_sequences": null,
      "dividend_accounts": [
        {
          "user": "0x5973918275c01f50555d44e92c9d9b353cadad54",
          "feeAmount": "0"
        },
        {
          "user": "0xb8bb158b93c94ed35c1970d610d1e2b34e26652c",
          "feeAmount": "0"
        },
        {
          "user": "0xf84c74dea96df0ec22e11e7c33996c73fcc2d822",
          "feeAmount": "0"
        },
        {
          "user": "0xb702f1c9154ac9c08da247a8e30ee6f2f3373f41",
          "feeAmount": "0"
        },
        {
          "user": "0x7fcd58c2d53d980b247f1612fdba93e9a76193e6",
          "feeAmount": "0"
        },
        {
          "user": "0x0375b2fc7140977c9c76d45421564e354ed42277",
          "feeAmount": "0"
        },
        {
          "user": "0x42eefcda06ead475cde3731b8eb138e88cd0bac3",
          "feeAmount": "0"
        }
      ]
    }
  }
}
`;

export const heimdallTestnet = `
{
  "genesis_time": "2020-06-04T10:47:20.806665Z",
  "chain_id": "heimdall-80001",
  "consensus_params": {
    "block": {
      "max_bytes": "22020096",
      "max_gas": "25000000",
      "time_iota_ms": "1000"
    },
    "evidence": {
      "max_age": "100000"
    },
    "validator": {
      "pub_key_types": [
        "secp256k1"
      ]
    }
  },
  "app_hash": "",
  "app_state": {
    "auth": {
      "params": {
        "max_memo_characters": "256",
        "tx_sig_limit": "7",
        "tx_size_cost_per_byte": "10",
        "sig_verify_cost_ed25519": "590",
        "sig_verify_cost_secp256k1": "1000",
        "max_tx_gas": "1000000",
        "tx_fees": "1000000000000000"
      },
      "accounts": [
        {
          "address": "0xc26880a0af2ea0c7e8130e6ec47af756465452e8",
          "coins": [
            {
              "denom": "matic",
              "amount": "1000000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        },
        {
          "address": "0xbe188d6641e8b680743a4815dfa0f6208038960f",
          "coins": [
            {
              "denom": "matic",
              "amount": "1000000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        },
        {
          "address": "0xc275dc8be39f50d12f66b6a63629c39da5bae5bd",
          "coins": [
            {
              "denom": "matic",
              "amount": "1000000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        },
        {
          "address": "0xf903ba9e006193c1527bfbe65fe2123704ea3f99",
          "coins": [
            {
              "denom": "matic",
              "amount": "1000000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        },
        {
          "address": "0x928ed6a3e94437bbd316ccad78479f1d163a6a8c",
          "coins": [
            {
              "denom": "matic",
              "amount": "1000000000000000000000"
            }
          ],
          "sequence_number": "0",
          "account_number": "0",
          "module_name": "",
          "module_permissions": null
        }
      ]
    },
    "bank": {
      "send_enabled": true
    },
    "bor": {
      "params": {
        "sprint_duration": "64",
        "span_duration": "6400",
        "producer_count": "11"
      },
      "spans": [
        {
          "span_id": "0",
          "start_block": "0",
          "end_block": "255",
          "validator_set": {
            "validators": [
              {
                "ID": "5",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x04a267a9c19d2bc85bc8d7419e864eded7e193581fd98915d07cae86fd8a03aeb66ed87b02003a7897654562d29677221808d7790b300e69162ad86c1b7b24cd07",
                "signer": "0x928ed6a3e94437bbd316ccad78479f1d163a6a8c",
                "last_updated": "",
                "jailed": false,
                "accum": "-40000"
              },
              {
                "ID": "2",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x04888a737a003f4e522ccf23bd9980fdbe7ef2b54365249deba0f9acd45279d66355b1864173b2cf9e75a1cbfb45e65a1a72b9ea76e47aa4bd50d79772ef301769",
                "signer": "0xbe188d6641e8b680743a4815dfa0f6208038960f",
                "last_updated": "",
                "jailed": false,
                "accum": "10000"
              },
              {
                "ID": "1",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x040bec8102c221c7cfff3e250bb6cc01c3b9a3964fb1bf4d53e91905320eef09595acb09ee0950e7374ec19488ff2523f186f6b1a9164c78dba8602e4e3c4eb013",
                "signer": "0xc26880a0af2ea0c7e8130e6ec47af756465452e8",
                "last_updated": "",
                "jailed": false,
                "accum": "10000"
              },
              {
                "ID": "3",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x04f3f18a027c929380417d2bd7d2a489cb662d4977e9daff335bc51f23c1c5f5f468aa19c6c8e937a745462ef2550bce42e4f38608dffb5a06e7b9d27d964cffee",
                "signer": "0xc275dc8be39f50d12f66b6a63629c39da5bae5bd",
                "last_updated": "",
                "jailed": false,
                "accum": "10000"
              },
              {
                "ID": "4",
                "startEpoch": "0",
                "endEpoch": "0",
                "nonce": "1",
                "power": "10000",
                "pubKey": "0x04dcd2883416e7b8663caafbfc885e757b0ea809657df8d6f322f01a0c5a11fd033bf13d3e0d5e88feff92ba415d32d626e3f7d9dd7b5ec7c2fef8ded83d660ac2",
                "signer": "0xf903ba9e006193c1527bfbe65fe2123704ea3f99",
                "last_updated": "",
                "jailed": false,
                "accum": "10000"
              }
            ],
            "proposer": {
              "ID": "5",
              "startEpoch": "0",
              "endEpoch": "0",
              "nonce": "1",
              "power": "10000",
              "pubKey": "0x04a267a9c19d2bc85bc8d7419e864eded7e193581fd98915d07cae86fd8a03aeb66ed87b02003a7897654562d29677221808d7790b300e69162ad86c1b7b24cd07",
              "signer": "0x928ed6a3e94437bbd316ccad78479f1d163a6a8c",
              "last_updated": "",
              "jailed": false,
              "accum": "-40000"
            }
          },
          "selected_producers": [
            {
              "ID": "5",
              "startEpoch": "0",
              "endEpoch": "0",
              "nonce": "1",
              "power": "10000",
              "pubKey": "0x04a267a9c19d2bc85bc8d7419e864eded7e193581fd98915d07cae86fd8a03aeb66ed87b02003a7897654562d29677221808d7790b300e69162ad86c1b7b24cd07",
              "signer": "0x928ed6a3e94437bbd316ccad78479f1d163a6a8c",
              "last_updated": "",
              "jailed": false,
              "accum": "-40000"
            },
            {
              "ID": "2",
              "startEpoch": "0",
              "endEpoch": "0",
              "nonce": "1",
              "power": "10000",
              "pubKey": "0x04888a737a003f4e522ccf23bd9980fdbe7ef2b54365249deba0f9acd45279d66355b1864173b2cf9e75a1cbfb45e65a1a72b9ea76e47aa4bd50d79772ef301769",
              "signer": "0xbe188d6641e8b680743a4815dfa0f6208038960f",
              "last_updated": "",
              "jailed": false,
              "accum": "10000"
            },
            {
              "ID": "1",
              "startEpoch": "0",
              "endEpoch": "0",
              "nonce": "1",
              "power": "10000",
              "pubKey": "0x040bec8102c221c7cfff3e250bb6cc01c3b9a3964fb1bf4d53e91905320eef09595acb09ee0950e7374ec19488ff2523f186f6b1a9164c78dba8602e4e3c4eb013",
              "signer": "0xc26880a0af2ea0c7e8130e6ec47af756465452e8",
              "last_updated": "",
              "jailed": false,
              "accum": "10000"
            },
            {
              "ID": "3",
              "startEpoch": "0",
              "endEpoch": "0",
              "nonce": "1",
              "power": "10000",
              "pubKey": "0x04f3f18a027c929380417d2bd7d2a489cb662d4977e9daff335bc51f23c1c5f5f468aa19c6c8e937a745462ef2550bce42e4f38608dffb5a06e7b9d27d964cffee",
              "signer": "0xc275dc8be39f50d12f66b6a63629c39da5bae5bd",
              "last_updated": "",
              "jailed": false,
              "accum": "10000"
            }
          ],
          "bor_chain_id": "80001"
        }
      ]
    },
    "chainmanager": {
      "params": {
        "mainchain_tx_confirmations": "6",
        "maticchain_tx_confirmations": "10",
        "chain_params": {
          "bor_chain_id": "80001",
          "matic_token_address": "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae",
          "staking_manager_address": "0x4864d89DCE4e24b2eDF64735E014a7E4154bfA7A",
          "slash_manager_address": "0x93D8f8A1A88498b258ceb69dD82311962374269C",
          "root_chain_address": "0x2890bA17EfE978480615e330ecB65333b880928e",
          "staking_info_address": "0x318EeD65F064904Bc6E0e3842940c5972BC8E38f",
          "state_sender_address": "0xEAa852323826C71cd7920C3b4c007184234c3945",
          "state_receiver_address": "0x0000000000000000000000000000000000001001",
          "validator_set_address": "0x0000000000000000000000000000000000001000"
        }
      }
    },
    "checkpoint": {
      "params": {
        "checkpoint_buffer_time": "1000000000000",
        "avg_checkpoint_length": "256",
        "max_checkpoint_length": "1024",
        "child_chain_block_interval": "10000"
      },
      "buffered_checkpoint": null,
      "last_no_ack": "0",
      "ack_count": "0",
      "checkpoints": null
    },
    "clerk": {
      "event_records": [],
      "record_sequences": null
    },
    "gov": {
      "starting_proposal_id": "1",
      "deposits": null,
      "votes": null,
      "proposals": null,
      "deposit_params": {
        "min_deposit": [
          {
            "denom": "matic",
            "amount": "10000000000000000000"
          }
        ],
        "max_deposit_period": "3600000000000"
      },
      "voting_params": {
        "voting_period": "3600000000000"
      },
      "tally_params": {
        "quorum": "0.334000000000000000",
        "threshold": "0.500000000000000000",
        "veto": "0.334000000000000000"
      }
    },
    "params": null,
    "sidechannel": {
      "past_commits": []
    },
    "slashing": {
      "params": {
        "signed_blocks_window": "100",
        "min_signed_per_window": "0.500000000000000000",
        "downtime_jail_duration": "600000000000",
        "slash_fraction_double_sign": "0.050000000000000000",
        "slash_fraction_downtime": "0.010000000000000000",
        "slash_fraction_limit": "0.333333333333333333",
        "jail_fraction_limit": "0.333333333333333333",
        "max_evidence_age": "120000000000",
        "enable_slashing": false
      },
      "signing_infos": {
        "2": {
          "valID": "2",
          "startHeight": "0",
          "indexOffset": "0"
        },
        "3": {
          "valID": "3",
          "startHeight": "0",
          "indexOffset": "0"
        },
        "4": {
          "valID": "4",
          "startHeight": "0",
          "indexOffset": "0"
        },
        "5": {
          "valID": "5",
          "startHeight": "0",
          "indexOffset": "0"
        },
        "1": {
          "valID": "1",
          "startHeight": "0",
          "indexOffset": "0"
        }
      },
      "missed_blocks": {},
      "buffer_val_slash_info": null,
      "tick_val_slash_info": null,
      "tick_count": "0"
    },
    "staking": {
      "validators": [
        {
          "ID": "1",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x040bec8102c221c7cfff3e250bb6cc01c3b9a3964fb1bf4d53e91905320eef09595acb09ee0950e7374ec19488ff2523f186f6b1a9164c78dba8602e4e3c4eb013",
          "signer": "0xc26880a0af2ea0c7e8130e6ec47af756465452e8",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        },
        {
          "ID": "2",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x04888a737a003f4e522ccf23bd9980fdbe7ef2b54365249deba0f9acd45279d66355b1864173b2cf9e75a1cbfb45e65a1a72b9ea76e47aa4bd50d79772ef301769",
          "signer": "0xbe188d6641e8b680743a4815dfa0f6208038960f",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        },
        {
          "ID": "3",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x04f3f18a027c929380417d2bd7d2a489cb662d4977e9daff335bc51f23c1c5f5f468aa19c6c8e937a745462ef2550bce42e4f38608dffb5a06e7b9d27d964cffee",
          "signer": "0xc275dc8be39f50d12f66b6a63629c39da5bae5bd",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        },
        {
          "ID": "4",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x04dcd2883416e7b8663caafbfc885e757b0ea809657df8d6f322f01a0c5a11fd033bf13d3e0d5e88feff92ba415d32d626e3f7d9dd7b5ec7c2fef8ded83d660ac2",
          "signer": "0xf903ba9e006193c1527bfbe65fe2123704ea3f99",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        },
        {
          "ID": "5",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x04a267a9c19d2bc85bc8d7419e864eded7e193581fd98915d07cae86fd8a03aeb66ed87b02003a7897654562d29677221808d7790b300e69162ad86c1b7b24cd07",
          "signer": "0x928ed6a3e94437bbd316ccad78479f1d163a6a8c",
          "last_updated": "",
          "jailed": false,
          "accum": "0"
        }
      ],
      "current_val_set": {
        "validators": [
          {
            "ID": "5",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x04a267a9c19d2bc85bc8d7419e864eded7e193581fd98915d07cae86fd8a03aeb66ed87b02003a7897654562d29677221808d7790b300e69162ad86c1b7b24cd07",
            "signer": "0x928ed6a3e94437bbd316ccad78479f1d163a6a8c",
            "last_updated": "",
            "jailed": false,
            "accum": "-40000"
          },
          {
            "ID": "2",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x04888a737a003f4e522ccf23bd9980fdbe7ef2b54365249deba0f9acd45279d66355b1864173b2cf9e75a1cbfb45e65a1a72b9ea76e47aa4bd50d79772ef301769",
            "signer": "0xbe188d6641e8b680743a4815dfa0f6208038960f",
            "last_updated": "",
            "jailed": false,
            "accum": "10000"
          },
          {
            "ID": "1",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x040bec8102c221c7cfff3e250bb6cc01c3b9a3964fb1bf4d53e91905320eef09595acb09ee0950e7374ec19488ff2523f186f6b1a9164c78dba8602e4e3c4eb013",
            "signer": "0xc26880a0af2ea0c7e8130e6ec47af756465452e8",
            "last_updated": "",
            "jailed": false,
            "accum": "10000"
          },
          {
            "ID": "3",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x04f3f18a027c929380417d2bd7d2a489cb662d4977e9daff335bc51f23c1c5f5f468aa19c6c8e937a745462ef2550bce42e4f38608dffb5a06e7b9d27d964cffee",
            "signer": "0xc275dc8be39f50d12f66b6a63629c39da5bae5bd",
            "last_updated": "",
            "jailed": false,
            "accum": "10000"
          },
          {
            "ID": "4",
            "startEpoch": "0",
            "endEpoch": "0",
            "nonce": "1",
            "power": "10000",
            "pubKey": "0x04dcd2883416e7b8663caafbfc885e757b0ea809657df8d6f322f01a0c5a11fd033bf13d3e0d5e88feff92ba415d32d626e3f7d9dd7b5ec7c2fef8ded83d660ac2",
            "signer": "0xf903ba9e006193c1527bfbe65fe2123704ea3f99",
            "last_updated": "",
            "jailed": false,
            "accum": "10000"
          }
        ],
        "proposer": {
          "ID": "5",
          "startEpoch": "0",
          "endEpoch": "0",
          "nonce": "1",
          "power": "10000",
          "pubKey": "0x04a267a9c19d2bc85bc8d7419e864eded7e193581fd98915d07cae86fd8a03aeb66ed87b02003a7897654562d29677221808d7790b300e69162ad86c1b7b24cd07",
          "signer": "0x928ed6a3e94437bbd316ccad78479f1d163a6a8c",
          "last_updated": "",
          "jailed": false,
          "accum": "-40000"
        }
      },
      "staking_sequences": null
    },
    "supply": {
      "supply": {
        "total": []
      }
    },
    "topup": {
      "tx_sequences": null,
      "dividend_accounts": [
        {
          "user": "0xc26880a0af2ea0c7e8130e6ec47af756465452e8",
          "feeAmount": "0"
        },
        {
          "user": "0xbe188d6641e8b680743a4815dfa0f6208038960f",
          "feeAmount": "0"
        },
        {
          "user": "0xc275dc8be39f50d12f66b6a63629c39da5bae5bd",
          "feeAmount": "0"
        },
        {
          "user": "0xf903ba9e006193c1527bfbe65fe2123704ea3f99",
          "feeAmount": "0"
        },
        {
          "user": "0x928ed6a3e94437bbd316ccad78479f1d163a6a8c",
          "feeAmount": "0"
        }
      ]
    }
  }
}
`;

export const borMainnet = `
{
  "config": {
    "chainId": 137,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 3395000,
    "muirGlacierBlock": 3395000,
    "berlinBlock": 14750000,
    "londonBlock": 23850000,
    "bor": {
      "jaipurBlock": 23850000,
      "period": {
        "0": 2
      },
      "producerDelay": 6,
      "sprint": 64,
      "backupMultiplier": {
        "0": 2
      },
      "validatorContract": "0x0000000000000000000000000000000000001000",
      "stateReceiverContract": "0x0000000000000000000000000000000000001001",
      "overrideStateSyncRecords": {
        "14949120": 8,
        "14949184": 0,
        "14953472": 0,
        "14953536": 5,
        "14953600": 0,
        "14953664": 0,
        "14953728": 0,
        "14953792": 0,
        "14953856": 0
      },
      "blockAlloc": {
        "22156660": {
          "0000000000000000000000000000000000001010": {
            "balance": "0x0",
            "code": "0x60806040526004361061019c5760003560e01c806377d32e94116100ec578063acd06cb31161008a578063e306f77911610064578063e306f77914610a7b578063e614d0d614610aa6578063f2fde38b14610ad1578063fc0c546a14610b225761019c565b8063acd06cb31461097a578063b789543c146109cd578063cc79f97b14610a505761019c565b80639025e64c116100c65780639025e64c146107c957806395d89b4114610859578063a9059cbb146108e9578063abceeba21461094f5761019c565b806377d32e94146106315780638da5cb5b146107435780638f32d59b1461079a5761019c565b806347e7ef24116101595780637019d41a116101335780637019d41a1461053357806370a082311461058a578063715018a6146105ef578063771282f6146106065761019c565b806347e7ef2414610410578063485cc9551461046b57806360f96a8f146104dc5761019c565b806306fdde03146101a15780631499c5921461023157806318160ddd1461028257806319d27d9c146102ad5780632e1a7d4d146103b1578063313ce567146103df575b600080fd5b3480156101ad57600080fd5b506101b6610b79565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101f65780820151818401526020810190506101db565b50505050905090810190601f1680156102235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561023d57600080fd5b506102806004803603602081101561025457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610bb6565b005b34801561028e57600080fd5b50610297610c24565b6040518082815260200191505060405180910390f35b3480156102b957600080fd5b5061036f600480360360a08110156102d057600080fd5b81019080803590602001906401000000008111156102ed57600080fd5b8201836020820111156102ff57600080fd5b8035906020019184600183028401116401000000008311171561032157600080fd5b9091929391929390803590602001909291908035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c3a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103dd600480360360208110156103c757600080fd5b8101908080359060200190929190505050610caa565b005b3480156103eb57600080fd5b506103f4610dfc565b604051808260ff1660ff16815260200191505060405180910390f35b34801561041c57600080fd5b506104696004803603604081101561043357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610e05565b005b34801561047757600080fd5b506104da6004803603604081101561048e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610fc1565b005b3480156104e857600080fd5b506104f1611090565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561053f57600080fd5b506105486110b6565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561059657600080fd5b506105d9600480360360208110156105ad57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506110dc565b6040518082815260200191505060405180910390f35b3480156105fb57600080fd5b506106046110fd565b005b34801561061257600080fd5b5061061b6111cd565b6040518082815260200191505060405180910390f35b34801561063d57600080fd5b506107016004803603604081101561065457600080fd5b81019080803590602001909291908035906020019064010000000081111561067b57600080fd5b82018360208201111561068d57600080fd5b803590602001918460018302840111640100000000831117156106af57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506111d3565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561074f57600080fd5b50610758611358565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156107a657600080fd5b506107af611381565b604051808215151515815260200191505060405180910390f35b3480156107d557600080fd5b506107de6113d8565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561081e578082015181840152602081019050610803565b50505050905090810190601f16801561084b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561086557600080fd5b5061086e611411565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156108ae578082015181840152602081019050610893565b50505050905090810190601f1680156108db5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610935600480360360408110156108ff57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061144e565b604051808215151515815260200191505060405180910390f35b34801561095b57600080fd5b50610964611474565b6040518082815260200191505060405180910390f35b34801561098657600080fd5b506109b36004803603602081101561099d57600080fd5b8101908080359060200190929190505050611501565b604051808215151515815260200191505060405180910390f35b3480156109d957600080fd5b50610a3a600480360360808110156109f057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291908035906020019092919080359060200190929190505050611521565b6040518082815260200191505060405180910390f35b348015610a5c57600080fd5b50610a65611541565b6040518082815260200191505060405180910390f35b348015610a8757600080fd5b50610a90611546565b6040518082815260200191505060405180910390f35b348015610ab257600080fd5b50610abb61154c565b6040518082815260200191505060405180910390f35b348015610add57600080fd5b50610b2060048036036020811015610af457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506115d9565b005b348015610b2e57600080fd5b50610b376115f6565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60606040518060400160405280600b81526020017f4d6174696320546f6b656e000000000000000000000000000000000000000000815250905090565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f44697361626c656420666561747572650000000000000000000000000000000081525060200191505060405180910390fd5b6000601260ff16600a0a6402540be40002905090565b60006040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f44697361626c656420666561747572650000000000000000000000000000000081525060200191505060405180910390fd5b60003390506000610cba826110dc565b9050610cd18360065461161c90919063ffffffff16565b600681905550600083118015610ce657508234145b610d58576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f496e73756666696369656e7420616d6f756e740000000000000000000000000081525060200191505060405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167febff2602b3f468259e1e99f613fed6691f3a6526effe6ef3e768ba7ae7a36c4f8584610dd4876110dc565b60405180848152602001838152602001828152602001935050505060405180910390a3505050565b60006012905090565b610e0d611381565b610e1657600080fd5b600081118015610e535750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b610ea8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180611da76023913960400191505060405180910390fd5b6000610eb3836110dc565b905060008390508073ffffffffffffffffffffffffffffffffffffffff166108fc849081150290604051600060405180830381858888f19350505050158015610f00573d6000803e3d6000fd5b50610f168360065461163c90919063ffffffff16565b6006819055508373ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f4e2ca0515ed1aef1395f66b5303bb5d6f1bf9d61a353fa53f73f8ac9973fa9f68585610f98896110dc565b60405180848152602001838152602001828152602001935050505060405180910390a350505050565b600760009054906101000a900460ff1615611027576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180611d846023913960400191505060405180910390fd5b6001600760006101000a81548160ff02191690831515021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061108c8261165b565b5050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b611105611381565b61110e57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a360008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60065481565b60008060008060418551146111ee5760009350505050611352565b602085015192506040850151915060ff6041860151169050601b8160ff16101561121957601b810190505b601b8160ff16141580156112315750601c8160ff1614155b156112425760009350505050611352565b60018682858560405160008152602001604052604051808581526020018460ff1660ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa15801561129f573d6000803e3d6000fd5b505050602060405103519350600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16141561134e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f4572726f7220696e2065637265636f766572000000000000000000000000000081525060200191505060405180910390fd5b5050505b92915050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b6040518060400160405280600181526020017f890000000000000000000000000000000000000000000000000000000000000081525081565b60606040518060400160405280600581526020017f4d41544943000000000000000000000000000000000000000000000000000000815250905090565b6000813414611460576000905061146e565b61146b338484611753565b90505b92915050565b6040518060800160405280605b8152602001611e1c605b91396040516020018082805190602001908083835b602083106114c357805182526020820191506020810190506020830392506114a0565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040528051906020012081565b60056020528060005260406000206000915054906101000a900460ff1681565b600061153761153286868686611b10565b611be6565b9050949350505050565b608981565b60015481565b604051806080016040528060528152602001611dca605291396040516020018082805190602001908083835b6020831061159b5780518252602082019150602081019050602083039250611578565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040528051906020012081565b6115e1611381565b6115ea57600080fd5b6115f38161165b565b50565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008282111561162b57600080fd5b600082840390508091505092915050565b60008082840190508381101561165157600080fd5b8091505092915050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561169557600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000803073ffffffffffffffffffffffffffffffffffffffff166370a08231866040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156117d357600080fd5b505afa1580156117e7573d6000803e3d6000fd5b505050506040513d60208110156117fd57600080fd5b8101908080519060200190929190505050905060003073ffffffffffffffffffffffffffffffffffffffff166370a08231866040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561188f57600080fd5b505afa1580156118a3573d6000803e3d6000fd5b505050506040513d60208110156118b957600080fd5b810190808051906020019092919050505090506118d7868686611c30565b8473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c48786863073ffffffffffffffffffffffffffffffffffffffff166370a082318e6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156119df57600080fd5b505afa1580156119f3573d6000803e3d6000fd5b505050506040513d6020811015611a0957600080fd5b81019080805190602001909291905050503073ffffffffffffffffffffffffffffffffffffffff166370a082318e6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015611a9757600080fd5b505afa158015611aab573d6000803e3d6000fd5b505050506040513d6020811015611ac157600080fd5b8101908080519060200190929190505050604051808681526020018581526020018481526020018381526020018281526020019550505050505060405180910390a46001925050509392505050565b6000806040518060800160405280605b8152602001611e1c605b91396040516020018082805190602001908083835b60208310611b625780518252602082019150602081019050602083039250611b3f565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405160208183030381529060405280519060200120905060405181815273ffffffffffffffffffffffffffffffffffffffff8716602082015285604082015284606082015283608082015260a0812092505081915050949350505050565b60008060015490506040517f190100000000000000000000000000000000000000000000000000000000000081528160028201528360228201526042812092505081915050919050565b3073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611cd2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f63616e27742073656e6420746f204d524332300000000000000000000000000081525060200191505060405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015611d18573d6000803e3d6000fd5b508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a350505056fe54686520636f6e747261637420697320616c726561647920696e697469616c697a6564496e73756666696369656e7420616d6f756e74206f7220696e76616c69642075736572454950373132446f6d61696e28737472696e67206e616d652c737472696e672076657273696f6e2c75696e7432353620636861696e49642c6164647265737320766572696679696e67436f6e747261637429546f6b656e5472616e736665724f726465722861646472657373207370656e6465722c75696e7432353620746f6b656e49644f72416d6f756e742c6279746573333220646174612c75696e743235362065787069726174696f6e29a265627a7a72315820a4a6f71a98ac3fc613c3a8f1e2e11b9eb9b6b39f125f7d9508916c2b8fb02c7164736f6c63430005100032"
          }
        }
      },
      "burntContract": {
        "23850000": "0x70bca57f4579f58670ab2d18ef16e02c17553c38"
      }
    }
  },
  "nonce": "0x0",
  "timestamp": "0x5ED20F84",
  "extraData": "",
  "gasLimit": "0x989680",
  "difficulty": "0x1",
  "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "alloc": {
    "0000000000000000000000000000000000001000": {
      "balance": "0x0",
      "code": "0x608060405234801561001057600080fd5b50600436106101f05760003560e01c806360c8614d1161010f578063af26aa96116100a2578063d5b844eb11610071578063d5b844eb14610666578063dcf2793a14610684578063e3b7c924146106b6578063f59cf565146106d4576101f0565b8063af26aa96146105c7578063b71d7a69146105e7578063b7ab4db514610617578063c1b3c91914610636576101f0565b806370ba5707116100de57806370ba57071461052b57806398ab2b621461055b5780639d11b80714610579578063ae756451146105a9576101f0565b806360c8614d1461049c57806365b3a1e2146104bc57806366332354146104db578063687a9bd6146104f9576101f0565b80633434735f1161018757806344d6528f1161015657806344d6528f146103ee5780634dbc959f1461041e57806355614fcc1461043c578063582a8d081461046c576101f0565b80633434735f1461035257806335ddfeea1461037057806343ee8213146103a057806344c15cb1146103be576101f0565b806323f2a73f116101c357806323f2a73f146102a45780632bc06564146102d45780632de3a180146102f25780632eddf35214610322576101f0565b8063047a6c5b146101f55780630c35b1cb146102275780631270b5741461025857806323c2a2b414610288575b600080fd5b61020f600480360361020a9190810190612c14565b610706565b60405161021e93929190613553565b60405180910390f35b610241600480360361023c9190810190612c14565b61075d565b60405161024f929190613374565b60405180910390f35b610272600480360361026d9190810190612c3d565b610939565b60405161027f91906133ab565b60405180910390f35b6102a2600480360361029d9190810190612d1c565b610a91565b005b6102be60048036036102b99190810190612c3d565b61112a565b6040516102cb91906133ab565b60405180910390f35b6102dc611281565b6040516102e99190613501565b60405180910390f35b61030c60048036036103079190810190612b71565b611286565b60405161031991906133c6565b60405180910390f35b61033c60048036036103379190810190612c14565b611307565b6040516103499190613501565b60405180910390f35b61035a611437565b6040516103679190613359565b60405180910390f35b61038a60048036036103859190810190612bad565b61144f565b60405161039791906133ab565b60405180910390f35b6103a861151a565b6040516103b591906133c6565b60405180910390f35b6103d860048036036103d39190810190612c79565b611531565b6040516103e59190613501565b60405180910390f35b61040860048036036104039190810190612c3d565b611619565b60405161041591906134e6565b60405180910390f35b610426611781565b6040516104339190613501565b60405180910390f35b61045660048036036104519190810190612af6565b611791565b60405161046391906133ab565b60405180910390f35b61048660048036036104819190810190612b1f565b6117ab565b60405161049391906133c6565b60405180910390f35b6104a4611829565b6040516104b393929190613553565b60405180910390f35b6104c461189d565b6040516104d2929190613374565b60405180910390f35b6104e3611c5e565b6040516104f09190613501565b60405180910390f35b610513600480360361050e9190810190612ce0565b611c63565b6040516105229392919061351c565b60405180910390f35b61054560048036036105409190810190612af6565b611cc7565b60405161055291906133ab565b60405180910390f35b610563611ce1565b60405161057091906133c6565b60405180910390f35b610593600480360361058e9190810190612c14565b611cf8565b6040516105a09190613501565b60405180910390f35b6105b1611e29565b6040516105be91906133c6565b60405180910390f35b6105cf611e40565b6040516105de93929190613553565b60405180910390f35b61060160048036036105fc9190810190612c14565b611ea1565b60405161060e9190613501565b60405180910390f35b61061f611fa1565b60405161062d929190613374565b60405180910390f35b610650600480360361064b9190810190612c14565b611fb5565b60405161065d9190613501565b60405180910390f35b61066e611fd6565b60405161067b919061358a565b60405180910390f35b61069e60048036036106999190810190612ce0565b611fdb565b6040516106ad9392919061351c565b60405180910390f35b6106be61203f565b6040516106cb9190613501565b60405180910390f35b6106ee60048036036106e99190810190612c14565b612051565b6040516106fd93929190613553565b60405180910390f35b60008060006002600085815260200190815260200160002060000154600260008681526020019081526020016000206001015460026000878152602001908152602001600020600201549250925092509193909250565b60608060ff83116107795761077061189d565b91509150610934565b600061078484611ea1565b9050606060016000838152602001908152602001600020805490506040519080825280602002602001820160405280156107cd5781602001602082028038833980820191505090505b509050606060016000848152602001908152602001600020805490506040519080825280602002602001820160405280156108175781602001602082028038833980820191505090505b50905060008090505b60016000858152602001908152602001600020805490508110156109295760016000858152602001908152602001600020818154811061085c57fe5b906000526020600020906003020160020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1683828151811061089a57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250506001600085815260200190815260200160002081815481106108f257fe5b90600052602060002090600302016001015482828151811061091057fe5b6020026020010181815250508080600101915050610820565b508181945094505050505b915091565b6000606060016000858152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b82821015610a0c578382906000526020600020906003020160405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152505081526020019060010190610970565b50505050905060008090505b8151811015610a84578373ffffffffffffffffffffffffffffffffffffffff16828281518110610a4457fe5b60200260200101516040015173ffffffffffffffffffffffffffffffffffffffff161415610a7757600192505050610a8b565b8080600101915050610a18565b5060009150505b92915050565b73fffffffffffffffffffffffffffffffffffffffe73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b13576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b0a906134c6565b60405180910390fd5b6000610b1d611781565b90506000811415610b3157610b3061207b565b5b610b4560018261239c90919063ffffffff16565b8814610b86576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b7d90613446565b60405180910390fd5b868611610bc8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bbf906134a6565b60405180910390fd5b6000604060018989030181610bd957fe5b0614610c1a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c1190613486565b60405180910390fd5b8660026000838152602001908152602001600020600101541115610c73576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c6a90613426565b60405180910390fd5b6000600260008a81526020019081526020016000206000015414610ccc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cc390613466565b60405180910390fd5b604051806060016040528089815260200188815260200187815250600260008a8152602001908152602001600020600082015181600001556020820151816001015560408201518160020155905050600388908060018154018082558091505090600182039060005260206000200160009091929091909150555060008060008a815260200190815260200160002081610d6691906128f0565b506000600160008a815260200190815260200160002081610d8791906128f0565b506060610ddf610dda87878080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050506123bb565b6123e9565b905060008090505b8151811015610f51576060610e0e838381518110610e0157fe5b60200260200101516123e9565b90506000808c81526020019081526020016000208054809190600101610e3491906128f0565b506040518060600160405280610e5d83600081518110610e5057fe5b60200260200101516124c6565b8152602001610e7f83600181518110610e7257fe5b60200260200101516124c6565b8152602001610ea183600281518110610e9457fe5b6020026020010151612537565b73ffffffffffffffffffffffffffffffffffffffff168152506000808d81526020019081526020016000208381548110610ed757fe5b9060005260206000209060030201600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550905050508080600101915050610de7565b506060610fa9610fa486868080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050506123bb565b6123e9565b905060008090505b815181101561111d576060610fd8838381518110610fcb57fe5b60200260200101516123e9565b9050600160008d81526020019081526020016000208054809190600101610fff91906128f0565b5060405180606001604052806110288360008151811061101b57fe5b60200260200101516124c6565b815260200161104a8360018151811061103d57fe5b60200260200101516124c6565b815260200161106c8360028151811061105f57fe5b6020026020010151612537565b73ffffffffffffffffffffffffffffffffffffffff16815250600160008e815260200190815260200160002083815481106110a357fe5b9060005260206000209060030201600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550905050508080600101915050610fb1565b5050505050505050505050565b60006060600080858152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b828210156111fc578382906000526020600020906003020160405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152505081526020019060010190611160565b50505050905060008090505b8151811015611274578373ffffffffffffffffffffffffffffffffffffffff1682828151811061123457fe5b60200260200101516040015173ffffffffffffffffffffffffffffffffffffffff1614156112675760019250505061127b565b8080600101915050611208565b5060009150505b92915050565b604081565b60006002600160f81b84846040516020016112a3939291906132c6565b6040516020818303038152906040526040516112bf9190613303565b602060405180830381855afa1580156112dc573d6000803e3d6000fd5b5050506040513d601f19601f820116820180604052506112ff9190810190612b48565b905092915050565b60006060600080848152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b828210156113d9578382906000526020600020906003020160405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815250508152602001906001019061133d565b505050509050600080905060008090505b825181101561142c5761141d83828151811061140257fe5b6020026020010151602001518361239c90919063ffffffff16565b915080806001019150506113ea565b508092505050919050565b73fffffffffffffffffffffffffffffffffffffffe81565b600080600080859050600060218087518161146657fe5b04029050600081111561147f5761147c876117ab565b91505b6000602190505b818111611509576000600182038801519050818801519550806000602081106114ab57fe5b1a60f81b9450600060f81b857effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614156114f0576114e98685611286565b93506114fd565b6114fa8487611286565b93505b50602181019050611486565b508782149450505050509392505050565b60405161152690613344565b604051809103902081565b60008060009050600080905060008090505b84518167ffffffffffffffff16101561160c57606061156e868367ffffffffffffffff16604161255a565b9050600061158582896125e690919063ffffffff16565b905061158f612922565b6115998a83611619565b90506115a58a8361112a565b80156115dc57508473ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16115b156115fe578194506115fb81602001518761239c90919063ffffffff16565b95505b505050604181019050611543565b5081925050509392505050565b611621612922565b6060600080858152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b828210156116f1578382906000526020600020906003020160405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152505081526020019060010190611655565b50505050905060008090505b8151811015611779578373ffffffffffffffffffffffffffffffffffffffff1682828151811061172957fe5b60200260200101516040015173ffffffffffffffffffffffffffffffffffffffff16141561176c5781818151811061175d57fe5b60200260200101519250611779565b80806001019150506116fd565b505092915050565b600061178c43611ea1565b905090565b60006117a461179e611781565b8361112a565b9050919050565b60006002600060f81b836040516020016117c692919061329a565b6040516020818303038152906040526040516117e29190613303565b602060405180830381855afa1580156117ff573d6000803e3d6000fd5b5050506040513d601f19601f820116820180604052506118229190810190612b48565b9050919050565b60008060008061184a600161183c611781565b61239c90919063ffffffff16565b905060026000828152602001908152602001600020600001546002600083815260200190815260200160002060010154600260008481526020019081526020016000206002015493509350935050909192565b606080606060076040519080825280602002602001820160405280156118d25781602001602082028038833980820191505090505b509050735973918275c01f50555d44e92c9d9b353cadad54816000815181106118f757fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505073b8bb158b93c94ed35c1970d610d1e2b34e26652c8160018151811061195357fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505073f84c74dea96df0ec22e11e7c33996c73fcc2d822816002815181106119af57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505073b702f1c9154ac9c08da247a8e30ee6f2f3373f4181600381518110611a0b57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050737fcd58c2d53d980b247f1612fdba93e9a76193e681600481518110611a6757fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050730375b2fc7140977c9c76d45421564e354ed4227781600581518110611ac357fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250507342eefcda06ead475cde3731b8eb138e88cd0bac381600681518110611b1f57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505060606007604051908082528060200260200182016040528015611b8b5781602001602082028038833980820191505090505b50905061271081600081518110611b9e57fe5b60200260200101818152505061271081600181518110611bba57fe5b60200260200101818152505061271081600281518110611bd657fe5b60200260200101818152505061271081600381518110611bf257fe5b60200260200101818152505061271081600481518110611c0e57fe5b60200260200101818152505061271081600581518110611c2a57fe5b60200260200101818152505061271081600681518110611c4657fe5b60200260200101818152505081819350935050509091565b60ff81565b60016020528160005260406000208181548110611c7c57fe5b9060005260206000209060030201600091509150508060000154908060010154908060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905083565b6000611cda611cd4611781565b83610939565b9050919050565b604051611ced9061331a565b604051809103902081565b6000606060016000848152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b82821015611dcb578382906000526020600020906003020160405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152505081526020019060010190611d2f565b505050509050600080905060008090505b8251811015611e1e57611e0f838281518110611df457fe5b6020026020010151602001518361239c90919063ffffffff16565b91508080600101915050611ddc565b508092505050919050565b604051611e359061332f565b604051809103902081565b600080600080611e4e611781565b905060026000828152602001908152602001600020600001546002600083815260200190815260200160002060010154600260008481526020019081526020016000206002015493509350935050909192565b60008060038054905090505b6000811115611f6157611ebe612959565b6002600060036001850381548110611ed257fe5b906000526020600020015481526020019081526020016000206040518060600160405290816000820154815260200160018201548152602001600282015481525050905083816020015111158015611f2f57506000816040015114155b8015611f3f575080604001518411155b15611f5257806000015192505050611f9c565b50808060019003915050611ead565b5060006003805490501115611f9757600360016003805490500381548110611f8557fe5b90600052602060002001549050611f9c565b600090505b919050565b606080611fad4361075d565b915091509091565b60038181548110611fc257fe5b906000526020600020016000915090505481565b600281565b60006020528160005260406000208181548110611ff457fe5b9060005260206000209060030201600091509150508060000154908060010154908060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905083565b60006040438161204b57fe5b04905090565b60026020528060005260406000206000915090508060000154908060010154908060020154905083565b60608061208661189d565b8092508193505050600080905060405180606001604052808281526020016000815260200160ff81525060026000838152602001908152602001600020600082015181600001556020820151816001015560408201518160020155905050600381908060018154018082558091505090600182039060005260206000200160009091929091909150555060008060008381526020019081526020016000208161212f91906128f0565b506000600160008381526020019081526020016000208161215091906128f0565b5060008090505b835181101561227257600080838152602001908152602001600020805480919060010161218491906128f0565b5060405180606001604052808281526020018483815181106121a257fe5b602002602001015181526020018583815181106121bb57fe5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1681525060008084815260200190815260200160002082815481106121f957fe5b9060005260206000209060030201600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050508080600101915050612157565b5060008090505b8351811015612396576001600083815260200190815260200160002080548091906001016122a791906128f0565b5060405180606001604052808281526020018483815181106122c557fe5b602002602001015181526020018583815181106122de57fe5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1681525060016000848152602001908152602001600020828154811061231d57fe5b9060005260206000209060030201600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050508080600101915050612279565b50505050565b6000808284019050838110156123b157600080fd5b8091505092915050565b6123c361297a565b600060208301905060405180604001604052808451815260200182815250915050919050565b60606123f4826126f0565b6123fd57600080fd5b60006124088361273e565b905060608160405190808252806020026020018201604052801561244657816020015b612433612994565b81526020019060019003908161242b5790505b509050600061245885602001516127af565b8560200151019050600080600090505b848110156124b95761247983612838565b915060405180604001604052808381526020018481525084828151811061249c57fe5b602002602001018190525081830192508080600101915050612468565b5082945050505050919050565b60008082600001511180156124e057506021826000015111155b6124e957600080fd5b60006124f883602001516127af565b9050600081846000015103905060008083866020015101905080519150602083101561252b57826020036101000a820491505b81945050505050919050565b6000601582600001511461254a57600080fd5b612553826124c6565b9050919050565b60608183018451101561256c57600080fd5b6060821560008114612589576040519150602082016040526125da565b6040519150601f8416801560200281840101858101878315602002848b0101015b818310156125c757805183526020830192506020810190506125aa565b50868552601f19601f8301166040525050505b50809150509392505050565b600080600080604185511461260157600093505050506126ea565b602085015192506040850151915060ff6041860151169050601b8160ff16101561262c57601b810190505b601b8160ff16141580156126445750601c8160ff1614155b1561265557600093505050506126ea565b60006001878386866040516000815260200160405260405161267a94939291906133e1565b6020604051602081039080840390855afa15801561269c573d6000803e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156126e257600080fd5b809450505050505b92915050565b600080826000015114156127075760009050612739565b60008083602001519050805160001a915060c060ff168260ff16101561273257600092505050612739565b6001925050505b919050565b6000808260000151141561275557600090506127aa565b6000809050600061276984602001516127af565b84602001510190506000846000015185602001510190505b808210156127a35761279282612838565b820191508280600101935050612781565b8293505050505b919050565b600080825160001a9050608060ff168110156127cf576000915050612833565b60b860ff168110806127f4575060c060ff1681101580156127f3575060f860ff1681105b5b15612803576001915050612833565b60c060ff168110156128235760018060b80360ff16820301915050612833565b60018060f80360ff168203019150505b919050565b6000806000835160001a9050608060ff1681101561285957600191506128e6565b60b860ff16811015612876576001608060ff1682030191506128e5565b60c060ff168110156128a65760b78103600185019450806020036101000a855104600182018101935050506128e4565b60f860ff168110156128c357600160c060ff1682030191506128e3565b60f78103600185019450806020036101000a855104600182018101935050505b5b5b5b8192505050919050565b81548183558181111561291d5760030281600302836000526020600020918201910161291c91906129ae565b5b505050565b60405180606001604052806000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff1681525090565b60405180606001604052806000815260200160008152602001600081525090565b604051806040016040528060008152602001600081525090565b604051806040016040528060008152602001600081525090565b612a0191905b808211156129fd5760008082016000905560018201600090556002820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055506003016129b4565b5090565b90565b600081359050612a1381613783565b92915050565b600081359050612a288161379a565b92915050565b600081519050612a3d8161379a565b92915050565b60008083601f840112612a5557600080fd5b8235905067ffffffffffffffff811115612a6e57600080fd5b602083019150836001820283011115612a8657600080fd5b9250929050565b600082601f830112612a9e57600080fd5b8135612ab1612aac826135d2565b6135a5565b91508082526020830160208301858383011115612acd57600080fd5b612ad883828461372d565b50505092915050565b600081359050612af0816137b1565b92915050565b600060208284031215612b0857600080fd5b6000612b1684828501612a04565b91505092915050565b600060208284031215612b3157600080fd5b6000612b3f84828501612a19565b91505092915050565b600060208284031215612b5a57600080fd5b6000612b6884828501612a2e565b91505092915050565b60008060408385031215612b8457600080fd5b6000612b9285828601612a19565b9250506020612ba385828601612a19565b9150509250929050565b600080600060608486031215612bc257600080fd5b6000612bd086828701612a19565b9350506020612be186828701612a19565b925050604084013567ffffffffffffffff811115612bfe57600080fd5b612c0a86828701612a8d565b9150509250925092565b600060208284031215612c2657600080fd5b6000612c3484828501612ae1565b91505092915050565b60008060408385031215612c5057600080fd5b6000612c5e85828601612ae1565b9250506020612c6f85828601612a04565b9150509250929050565b600080600060608486031215612c8e57600080fd5b6000612c9c86828701612ae1565b9350506020612cad86828701612a19565b925050604084013567ffffffffffffffff811115612cca57600080fd5b612cd686828701612a8d565b9150509250925092565b60008060408385031215612cf357600080fd5b6000612d0185828601612ae1565b9250506020612d1285828601612ae1565b9150509250929050565b600080600080600080600060a0888a031215612d3757600080fd5b6000612d458a828b01612ae1565b9750506020612d568a828b01612ae1565b9650506040612d678a828b01612ae1565b955050606088013567ffffffffffffffff811115612d8457600080fd5b612d908a828b01612a43565b9450945050608088013567ffffffffffffffff811115612daf57600080fd5b612dbb8a828b01612a43565b925092505092959891949750929550565b6000612dd88383612dfc565b60208301905092915050565b6000612df0838361326d565b60208301905092915050565b612e05816136a2565b82525050565b612e14816136a2565b82525050565b6000612e258261361e565b612e2f8185613659565b9350612e3a836135fe565b8060005b83811015612e6b578151612e528882612dcc565b9750612e5d8361363f565b925050600181019050612e3e565b5085935050505092915050565b6000612e8382613629565b612e8d818561366a565b9350612e988361360e565b8060005b83811015612ec9578151612eb08882612de4565b9750612ebb8361364c565b925050600181019050612e9c565b5085935050505092915050565b612edf816136b4565b82525050565b612ef6612ef1826136c0565b61376f565b82525050565b612f05816136ec565b82525050565b612f1c612f17826136ec565b613779565b82525050565b6000612f2d82613634565b612f37818561367b565b9350612f4781856020860161373c565b80840191505092915050565b6000612f60600483613697565b91507f766f7465000000000000000000000000000000000000000000000000000000006000830152600482019050919050565b6000612fa0602d83613686565b91507f537461727420626c6f636b206d7573742062652067726561746572207468616e60008301527f2063757272656e74207370616e000000000000000000000000000000000000006020830152604082019050919050565b6000613006600383613697565b91507f31333700000000000000000000000000000000000000000000000000000000006000830152600382019050919050565b6000613046600f83613686565b91507f496e76616c6964207370616e20696400000000000000000000000000000000006000830152602082019050919050565b6000613086601383613686565b91507f5370616e20616c726561647920657869737473000000000000000000000000006000830152602082019050919050565b60006130c6604583613686565b91507f446966666572656e6365206265747765656e20737461727420616e6420656e6460008301527f20626c6f636b206d75737420626520696e206d756c7469706c6573206f66207360208301527f7072696e740000000000000000000000000000000000000000000000000000006040830152606082019050919050565b6000613152600c83613697565b91507f6865696d64616c6c2d31333700000000000000000000000000000000000000006000830152600c82019050919050565b6000613192602a83613686565b91507f456e6420626c6f636b206d7573742062652067726561746572207468616e207360008301527f7461727420626c6f636b000000000000000000000000000000000000000000006020830152604082019050919050565b60006131f8601283613686565b91507f4e6f742053797374656d204164646573732100000000000000000000000000006000830152602082019050919050565b606082016000820151613241600085018261326d565b506020820151613254602085018261326d565b5060408201516132676040850182612dfc565b50505050565b61327681613716565b82525050565b61328581613716565b82525050565b61329481613720565b82525050565b60006132a68285612ee5565b6001820191506132b68284612f0b565b6020820191508190509392505050565b60006132d28286612ee5565b6001820191506132e28285612f0b565b6020820191506132f28284612f0b565b602082019150819050949350505050565b600061330f8284612f22565b915081905092915050565b600061332582612f53565b9150819050919050565b600061333a82612ff9565b9150819050919050565b600061334f82613145565b9150819050919050565b600060208201905061336e6000830184612e0b565b92915050565b6000604082019050818103600083015261338e8185612e1a565b905081810360208301526133a28184612e78565b90509392505050565b60006020820190506133c06000830184612ed6565b92915050565b60006020820190506133db6000830184612efc565b92915050565b60006080820190506133f66000830187612efc565b613403602083018661328b565b6134106040830185612efc565b61341d6060830184612efc565b95945050505050565b6000602082019050818103600083015261343f81612f93565b9050919050565b6000602082019050818103600083015261345f81613039565b9050919050565b6000602082019050818103600083015261347f81613079565b9050919050565b6000602082019050818103600083015261349f816130b9565b9050919050565b600060208201905081810360008301526134bf81613185565b9050919050565b600060208201905081810360008301526134df816131eb565b9050919050565b60006060820190506134fb600083018461322b565b92915050565b6000602082019050613516600083018461327c565b92915050565b6000606082019050613531600083018661327c565b61353e602083018561327c565b61354b6040830184612e0b565b949350505050565b6000606082019050613568600083018661327c565b613575602083018561327c565b613582604083018461327c565b949350505050565b600060208201905061359f600083018461328b565b92915050565b6000604051905081810181811067ffffffffffffffff821117156135c857600080fd5b8060405250919050565b600067ffffffffffffffff8211156135e957600080fd5b601f19601f8301169050602081019050919050565b6000819050602082019050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b60006136ad826136f6565b9050919050565b60008115159050919050565b60007fff0000000000000000000000000000000000000000000000000000000000000082169050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b82818337600083830152505050565b60005b8381101561375a57808201518184015260208101905061373f565b83811115613769576000848401525b50505050565b6000819050919050565b6000819050919050565b61378c816136a2565b811461379757600080fd5b50565b6137a3816136ec565b81146137ae57600080fd5b50565b6137ba81613716565b81146137c557600080fd5b5056fea365627a7a72315820638c74b73aaddeb2f2fb9267028e09737291458f6da93b6619d30c86432701d96c6578706572696d656e74616cf564736f6c634300050b0040"
    },
    "0000000000000000000000000000000000001001": {
      "balance": "0x0",
      "code": "0x608060405234801561001057600080fd5b50600436106100415760003560e01c806319494a17146100465780633434735f146100e15780635407ca671461012b575b600080fd5b6100c76004803603604081101561005c57600080fd5b81019080803590602001909291908035906020019064010000000081111561008357600080fd5b82018360208201111561009557600080fd5b803590602001918460018302840111640100000000831117156100b757600080fd5b9091929391929390505050610149565b604051808215151515815260200191505060405180910390f35b6100e961047a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610133610492565b6040518082815260200191505060405180910390f35b600073fffffffffffffffffffffffffffffffffffffffe73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610200576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f4e6f742053797374656d2041646465737321000000000000000000000000000081525060200191505060405180910390fd5b606061025761025285858080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050610498565b6104c6565b905060006102788260008151811061026b57fe5b60200260200101516105a3565b905080600160005401146102f4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f537461746549647320617265206e6f742073657175656e7469616c000000000081525060200191505060405180910390fd5b600080815480929190600101919050555060006103248360018151811061031757fe5b6020026020010151610614565b905060606103458460028151811061033857fe5b6020026020010151610637565b9050610350826106c3565b1561046f576000624c4b409050606084836040516024018083815260200180602001828103825283818151815260200191508051906020019080838360005b838110156103aa57808201518184015260208101905061038f565b50505050905090810190601f1680156103d75780820380516001836020036101000a031916815260200191505b5093505050506040516020818303038152906040527f26c53bea000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050905060008082516020840160008887f1965050505b505050509392505050565b73fffffffffffffffffffffffffffffffffffffffe81565b60005481565b6104a0610943565b600060208301905060405180604001604052808451815260200182815250915050919050565b60606104d1826106dc565b6104da57600080fd5b60006104e58361072a565b905060608160405190808252806020026020018201604052801561052357816020015b61051061095d565b8152602001906001900390816105085790505b5090506000610535856020015161079b565b8560200151019050600080600090505b848110156105965761055683610824565b915060405180604001604052808381526020018481525084828151811061057957fe5b602002602001018190525081830192508080600101915050610545565b5082945050505050919050565b60008082600001511180156105bd57506021826000015111155b6105c657600080fd5b60006105d5836020015161079b565b9050600081846000015103905060008083866020015101905080519150602083101561060857826020036101000a820491505b81945050505050919050565b6000601582600001511461062757600080fd5b610630826105a3565b9050919050565b6060600082600001511161064a57600080fd5b6000610659836020015161079b565b905060008184600001510390506060816040519080825280601f01601f19166020018201604052801561069b5781602001600182028038833980820191505090505b50905060008160200190506106b78487602001510182856108dc565b81945050505050919050565b600080823b905060008163ffffffff1611915050919050565b600080826000015114156106f35760009050610725565b60008083602001519050805160001a915060c060ff168260ff16101561071e57600092505050610725565b6001925050505b919050565b600080826000015114156107415760009050610796565b60008090506000610755846020015161079b565b84602001510190506000846000015185602001510190505b8082101561078f5761077e82610824565b82019150828060010193505061076d565b8293505050505b919050565b600080825160001a9050608060ff168110156107bb57600091505061081f565b60b860ff168110806107e0575060c060ff1681101580156107df575060f860ff1681105b5b156107ef57600191505061081f565b60c060ff1681101561080f5760018060b80360ff1682030191505061081f565b60018060f80360ff168203019150505b919050565b6000806000835160001a9050608060ff1681101561084557600191506108d2565b60b860ff16811015610862576001608060ff1682030191506108d1565b60c060ff168110156108925760b78103600185019450806020036101000a855104600182018101935050506108d0565b60f860ff168110156108af57600160c060ff1682030191506108cf565b60f78103600185019450806020036101000a855104600182018101935050505b5b5b5b8192505050919050565b60008114156108ea5761093e565b5b602060ff16811061091a5782518252602060ff1683019250602060ff1682019150602060ff16810390506108eb565b6000600182602060ff16036101000a03905080198451168184511681811785525050505b505050565b604051806040016040528060008152602001600081525090565b60405180604001604052806000815260200160008152509056fea265627a7a7231582083fbdacb76f32b4112d0f7db9a596937925824798a0026ba0232322390b5263764736f6c634300050b0032"
    },
    "0000000000000000000000000000000000001010": {
      "balance": "0x204fcce2c5a141f7f9a00000",
      "code": "0x60806040526004361061019c5760003560e01c806377d32e94116100ec578063acd06cb31161008a578063e306f77911610064578063e306f77914610a7b578063e614d0d614610aa6578063f2fde38b14610ad1578063fc0c546a14610b225761019c565b8063acd06cb31461097a578063b789543c146109cd578063cc79f97b14610a505761019c565b80639025e64c116100c65780639025e64c146107c957806395d89b4114610859578063a9059cbb146108e9578063abceeba21461094f5761019c565b806377d32e94146106315780638da5cb5b146107435780638f32d59b1461079a5761019c565b806347e7ef24116101595780637019d41a116101335780637019d41a1461053357806370a082311461058a578063715018a6146105ef578063771282f6146106065761019c565b806347e7ef2414610410578063485cc9551461046b57806360f96a8f146104dc5761019c565b806306fdde03146101a15780631499c5921461023157806318160ddd1461028257806319d27d9c146102ad5780632e1a7d4d146103b1578063313ce567146103df575b600080fd5b3480156101ad57600080fd5b506101b6610b79565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101f65780820151818401526020810190506101db565b50505050905090810190601f1680156102235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561023d57600080fd5b506102806004803603602081101561025457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610bb6565b005b34801561028e57600080fd5b50610297610c24565b6040518082815260200191505060405180910390f35b3480156102b957600080fd5b5061036f600480360360a08110156102d057600080fd5b81019080803590602001906401000000008111156102ed57600080fd5b8201836020820111156102ff57600080fd5b8035906020019184600183028401116401000000008311171561032157600080fd5b9091929391929390803590602001909291908035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c3a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103dd600480360360208110156103c757600080fd5b8101908080359060200190929190505050610e06565b005b3480156103eb57600080fd5b506103f4610f58565b604051808260ff1660ff16815260200191505060405180910390f35b34801561041c57600080fd5b506104696004803603604081101561043357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610f61565b005b34801561047757600080fd5b506104da6004803603604081101561048e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061111d565b005b3480156104e857600080fd5b506104f16111ec565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561053f57600080fd5b50610548611212565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561059657600080fd5b506105d9600480360360208110156105ad57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611238565b6040518082815260200191505060405180910390f35b3480156105fb57600080fd5b50610604611259565b005b34801561061257600080fd5b5061061b611329565b6040518082815260200191505060405180910390f35b34801561063d57600080fd5b506107016004803603604081101561065457600080fd5b81019080803590602001909291908035906020019064010000000081111561067b57600080fd5b82018360208201111561068d57600080fd5b803590602001918460018302840111640100000000831117156106af57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061132f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561074f57600080fd5b506107586114b4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156107a657600080fd5b506107af6114dd565b604051808215151515815260200191505060405180910390f35b3480156107d557600080fd5b506107de611534565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561081e578082015181840152602081019050610803565b50505050905090810190601f16801561084b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561086557600080fd5b5061086e61156d565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156108ae578082015181840152602081019050610893565b50505050905090810190601f1680156108db5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610935600480360360408110156108ff57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506115aa565b604051808215151515815260200191505060405180910390f35b34801561095b57600080fd5b506109646115d0565b6040518082815260200191505060405180910390f35b34801561098657600080fd5b506109b36004803603602081101561099d57600080fd5b810190808035906020019092919050505061165d565b604051808215151515815260200191505060405180910390f35b3480156109d957600080fd5b50610a3a600480360360808110156109f057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001909291908035906020019092919050505061167d565b6040518082815260200191505060405180910390f35b348015610a5c57600080fd5b50610a6561169d565b6040518082815260200191505060405180910390f35b348015610a8757600080fd5b50610a906116a2565b6040518082815260200191505060405180910390f35b348015610ab257600080fd5b50610abb6116a8565b6040518082815260200191505060405180910390f35b348015610add57600080fd5b50610b2060048036036020811015610af457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611735565b005b348015610b2e57600080fd5b50610b37611752565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60606040518060400160405280600b81526020017f4d6174696320546f6b656e000000000000000000000000000000000000000000815250905090565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f44697361626c656420666561747572650000000000000000000000000000000081525060200191505060405180910390fd5b6000601260ff16600a0a6402540be40002905090565b6000808511610c4857600080fd5b6000831480610c575750824311155b610cc9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f5369676e6174757265206973206578706972656400000000000000000000000081525060200191505060405180910390fd5b6000610cd73387878761167d565b9050600015156005600083815260200190815260200160002060009054906101000a900460ff16151514610d73576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600f8152602001807f536967206465616374697661746564000000000000000000000000000000000081525060200191505060405180910390fd5b60016005600083815260200190815260200160002060006101000a81548160ff021916908315150217905550610ded8189898080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505061132f565b9150610dfa828488611778565b50509695505050505050565b60003390506000610e1682611238565b9050610e2d83600654611b3590919063ffffffff16565b600681905550600083118015610e4257508234145b610eb4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f496e73756666696369656e7420616d6f756e740000000000000000000000000081525060200191505060405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167febff2602b3f468259e1e99f613fed6691f3a6526effe6ef3e768ba7ae7a36c4f8584610f3087611238565b60405180848152602001838152602001828152602001935050505060405180910390a3505050565b60006012905090565b610f696114dd565b610f7257600080fd5b600081118015610faf5750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b611004576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180611f036023913960400191505060405180910390fd5b600061100f83611238565b905060008390508073ffffffffffffffffffffffffffffffffffffffff166108fc849081150290604051600060405180830381858888f1935050505015801561105c573d6000803e3d6000fd5b5061107283600654611b5590919063ffffffff16565b6006819055508373ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f4e2ca0515ed1aef1395f66b5303bb5d6f1bf9d61a353fa53f73f8ac9973fa9f685856110f489611238565b60405180848152602001838152602001828152602001935050505060405180910390a350505050565b600760009054906101000a900460ff1615611183576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180611ee06023913960400191505060405180910390fd5b6001600760006101000a81548160ff02191690831515021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506111e882611b74565b5050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b6112616114dd565b61126a57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a360008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60065481565b600080600080604185511461134a57600093505050506114ae565b602085015192506040850151915060ff6041860151169050601b8160ff16101561137557601b810190505b601b8160ff161415801561138d5750601c8160ff1614155b1561139e57600093505050506114ae565b60018682858560405160008152602001604052604051808581526020018460ff1660ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa1580156113fb573d6000803e3d6000fd5b505050602060405103519350600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614156114aa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f4572726f7220696e2065637265636f766572000000000000000000000000000081525060200191505060405180910390fd5b5050505b92915050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b6040518060400160405280600181526020017f890000000000000000000000000000000000000000000000000000000000000081525081565b60606040518060400160405280600581526020017f4d41544943000000000000000000000000000000000000000000000000000000815250905090565b60008134146115bc57600090506115ca565b6115c7338484611778565b90505b92915050565b6040518060800160405280605b8152602001611f78605b91396040516020018082805190602001908083835b6020831061161f57805182526020820191506020810190506020830392506115fc565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040528051906020012081565b60056020528060005260406000206000915054906101000a900460ff1681565b600061169361168e86868686611c6c565b611d42565b9050949350505050565b608981565b60015481565b604051806080016040528060528152602001611f26605291396040516020018082805190602001908083835b602083106116f757805182526020820191506020810190506020830392506116d4565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040528051906020012081565b61173d6114dd565b61174657600080fd5b61174f81611b74565b50565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000803073ffffffffffffffffffffffffffffffffffffffff166370a08231866040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156117f857600080fd5b505afa15801561180c573d6000803e3d6000fd5b505050506040513d602081101561182257600080fd5b8101908080519060200190929190505050905060003073ffffffffffffffffffffffffffffffffffffffff166370a08231866040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156118b457600080fd5b505afa1580156118c8573d6000803e3d6000fd5b505050506040513d60208110156118de57600080fd5b810190808051906020019092919050505090506118fc868686611d8c565b8473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c48786863073ffffffffffffffffffffffffffffffffffffffff166370a082318e6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015611a0457600080fd5b505afa158015611a18573d6000803e3d6000fd5b505050506040513d6020811015611a2e57600080fd5b81019080805190602001909291905050503073ffffffffffffffffffffffffffffffffffffffff166370a082318e6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015611abc57600080fd5b505afa158015611ad0573d6000803e3d6000fd5b505050506040513d6020811015611ae657600080fd5b8101908080519060200190929190505050604051808681526020018581526020018481526020018381526020018281526020019550505050505060405180910390a46001925050509392505050565b600082821115611b4457600080fd5b600082840390508091505092915050565b600080828401905083811015611b6a57600080fd5b8091505092915050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611bae57600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000806040518060800160405280605b8152602001611f78605b91396040516020018082805190602001908083835b60208310611cbe5780518252602082019150602081019050602083039250611c9b565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405160208183030381529060405280519060200120905060405181815273ffffffffffffffffffffffffffffffffffffffff8716602082015285604082015284606082015283608082015260a0812092505081915050949350505050565b60008060015490506040517f190100000000000000000000000000000000000000000000000000000000000081528160028201528360228201526042812092505081915050919050565b3073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611e2e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f63616e27742073656e6420746f204d524332300000000000000000000000000081525060200191505060405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015611e74573d6000803e3d6000fd5b508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a350505056fe54686520636f6e747261637420697320616c726561647920696e697469616c697a6564496e73756666696369656e7420616d6f756e74206f7220696e76616c69642075736572454950373132446f6d61696e28737472696e67206e616d652c737472696e672076657273696f6e2c75696e7432353620636861696e49642c6164647265737320766572696679696e67436f6e747261637429546f6b656e5472616e736665724f726465722861646472657373207370656e6465722c75696e7432353620746f6b656e49644f72416d6f756e742c6279746573333220646174612c75696e743235362065787069726174696f6e29a265627a7a7231582098247ec3c8d127ebf969c8f317e340b1cd6c481af077234c38e0c7d92aba4d6364736f6c634300050b0032"
    },
    "5973918275C01F50555d44e92c9d9b353CaDAD54": {
      "balance": "0x3635c9adc5dea00000"
    },
    "b8bB158B93c94ed35c1970D610d1E2B34E26652c": {
      "balance": "0x3635c9adc5dea00000"
    },
    "F84C74dEa96DF0EC22e11e7C33996C73FCC2D822": {
      "balance": "0x3635c9adc5dea00000"
    },
    "b702f1C9154ac9c08Da247a8e30ee6F2F3373f41": {
      "balance": "0x3635c9adc5dea00000"
    },
    "7fCD58C2D53D980b247F1612FdbA93E9a76193E6": {
      "balance": "0x3635c9adc5dea00000"
    },
    "0375b2fc7140977c9c76D45421564e354ED42277": {
      "balance": "0x3635c9adc5dea00000"
    },
    "42EEfcda06eaD475cdE3731B8eb138e88CD0bAC3": {
      "balance": "0x3635c9adc5dea00000"
    }
  },
  "number": "0x0",
  "gasUsed": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
`;

export const borTestnet = `
{
  "config": {
    "chainId": 80001,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 2722000,
    "muirGlacierBlock": 2722000,
    "berlinBlock": 13996000,
    "londonBlock": 22640000,
    "bor": {
      "jaipurBlock": 22770000,
      "period": {
        "0": 2,
        "25275000": 5
      },
      "producerDelay": 6,
      "sprint": 64,
      "backupMultiplier": {
        "0": 2,
        "25275000": 5
      },
      "validatorContract": "0x0000000000000000000000000000000000001000",
      "stateReceiverContract": "0x0000000000000000000000000000000000001001",
      "burntContract": {
        "22640000": "0x70bcA57F4579f58670aB2d18Ef16e02C17553C38"
      },
      "blockAlloc": {
        "22244000": {
          "0000000000000000000000000000000000001010": {
            "balance": "0x0",
            "code": "0x60806040526004361061019c5760003560e01c806377d32e94116100ec578063acd06cb31161008a578063e306f77911610064578063e306f77914610a7b578063e614d0d614610aa6578063f2fde38b14610ad1578063fc0c546a14610b225761019c565b8063acd06cb31461097a578063b789543c146109cd578063cc79f97b14610a505761019c565b80639025e64c116100c65780639025e64c146107c957806395d89b4114610859578063a9059cbb146108e9578063abceeba21461094f5761019c565b806377d32e94146106315780638da5cb5b146107435780638f32d59b1461079a5761019c565b806347e7ef24116101595780637019d41a116101335780637019d41a1461053357806370a082311461058a578063715018a6146105ef578063771282f6146106065761019c565b806347e7ef2414610410578063485cc9551461046b57806360f96a8f146104dc5761019c565b806306fdde03146101a15780631499c5921461023157806318160ddd1461028257806319d27d9c146102ad5780632e1a7d4d146103b1578063313ce567146103df575b600080fd5b3480156101ad57600080fd5b506101b6610b79565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101f65780820151818401526020810190506101db565b50505050905090810190601f1680156102235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561023d57600080fd5b506102806004803603602081101561025457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610bb6565b005b34801561028e57600080fd5b50610297610c24565b6040518082815260200191505060405180910390f35b3480156102b957600080fd5b5061036f600480360360a08110156102d057600080fd5b81019080803590602001906401000000008111156102ed57600080fd5b8201836020820111156102ff57600080fd5b8035906020019184600183028401116401000000008311171561032157600080fd5b9091929391929390803590602001909291908035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c3a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103dd600480360360208110156103c757600080fd5b8101908080359060200190929190505050610caa565b005b3480156103eb57600080fd5b506103f4610dfc565b604051808260ff1660ff16815260200191505060405180910390f35b34801561041c57600080fd5b506104696004803603604081101561043357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610e05565b005b34801561047757600080fd5b506104da6004803603604081101561048e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610fc1565b005b3480156104e857600080fd5b506104f1611090565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561053f57600080fd5b506105486110b6565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561059657600080fd5b506105d9600480360360208110156105ad57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506110dc565b6040518082815260200191505060405180910390f35b3480156105fb57600080fd5b506106046110fd565b005b34801561061257600080fd5b5061061b6111cd565b6040518082815260200191505060405180910390f35b34801561063d57600080fd5b506107016004803603604081101561065457600080fd5b81019080803590602001909291908035906020019064010000000081111561067b57600080fd5b82018360208201111561068d57600080fd5b803590602001918460018302840111640100000000831117156106af57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506111d3565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561074f57600080fd5b50610758611358565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156107a657600080fd5b506107af611381565b604051808215151515815260200191505060405180910390f35b3480156107d557600080fd5b506107de6113d8565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561081e578082015181840152602081019050610803565b50505050905090810190601f16801561084b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561086557600080fd5b5061086e611411565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156108ae578082015181840152602081019050610893565b50505050905090810190601f1680156108db5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610935600480360360408110156108ff57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061144e565b604051808215151515815260200191505060405180910390f35b34801561095b57600080fd5b50610964611474565b6040518082815260200191505060405180910390f35b34801561098657600080fd5b506109b36004803603602081101561099d57600080fd5b8101908080359060200190929190505050611501565b604051808215151515815260200191505060405180910390f35b3480156109d957600080fd5b50610a3a600480360360808110156109f057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291908035906020019092919080359060200190929190505050611521565b6040518082815260200191505060405180910390f35b348015610a5c57600080fd5b50610a65611541565b6040518082815260200191505060405180910390f35b348015610a8757600080fd5b50610a90611548565b6040518082815260200191505060405180910390f35b348015610ab257600080fd5b50610abb61154e565b6040518082815260200191505060405180910390f35b348015610add57600080fd5b50610b2060048036036020811015610af457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506115db565b005b348015610b2e57600080fd5b50610b376115f8565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60606040518060400160405280600b81526020017f4d6174696320546f6b656e000000000000000000000000000000000000000000815250905090565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f44697361626c656420666561747572650000000000000000000000000000000081525060200191505060405180910390fd5b6000601260ff16600a0a6402540be40002905090565b60006040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f44697361626c656420666561747572650000000000000000000000000000000081525060200191505060405180910390fd5b60003390506000610cba826110dc565b9050610cd18360065461161e90919063ffffffff16565b600681905550600083118015610ce657508234145b610d58576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f496e73756666696369656e7420616d6f756e740000000000000000000000000081525060200191505060405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167febff2602b3f468259e1e99f613fed6691f3a6526effe6ef3e768ba7ae7a36c4f8584610dd4876110dc565b60405180848152602001838152602001828152602001935050505060405180910390a3505050565b60006012905090565b610e0d611381565b610e1657600080fd5b600081118015610e535750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b610ea8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180611da96023913960400191505060405180910390fd5b6000610eb3836110dc565b905060008390508073ffffffffffffffffffffffffffffffffffffffff166108fc849081150290604051600060405180830381858888f19350505050158015610f00573d6000803e3d6000fd5b50610f168360065461163e90919063ffffffff16565b6006819055508373ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f4e2ca0515ed1aef1395f66b5303bb5d6f1bf9d61a353fa53f73f8ac9973fa9f68585610f98896110dc565b60405180848152602001838152602001828152602001935050505060405180910390a350505050565b600760009054906101000a900460ff1615611027576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180611d866023913960400191505060405180910390fd5b6001600760006101000a81548160ff02191690831515021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061108c8261165d565b5050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b611105611381565b61110e57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a360008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60065481565b60008060008060418551146111ee5760009350505050611352565b602085015192506040850151915060ff6041860151169050601b8160ff16101561121957601b810190505b601b8160ff16141580156112315750601c8160ff1614155b156112425760009350505050611352565b60018682858560405160008152602001604052604051808581526020018460ff1660ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa15801561129f573d6000803e3d6000fd5b505050602060405103519350600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16141561134e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f4572726f7220696e2065637265636f766572000000000000000000000000000081525060200191505060405180910390fd5b5050505b92915050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b6040518060400160405280600381526020017f013881000000000000000000000000000000000000000000000000000000000081525081565b60606040518060400160405280600581526020017f4d41544943000000000000000000000000000000000000000000000000000000815250905090565b6000813414611460576000905061146e565b61146b338484611755565b90505b92915050565b6040518060800160405280605b8152602001611e1e605b91396040516020018082805190602001908083835b602083106114c357805182526020820191506020810190506020830392506114a0565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040528051906020012081565b60056020528060005260406000206000915054906101000a900460ff1681565b600061153761153286868686611b12565b611be8565b9050949350505050565b6201388181565b60015481565b604051806080016040528060528152602001611dcc605291396040516020018082805190602001908083835b6020831061159d578051825260208201915060208101905060208303925061157a565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040528051906020012081565b6115e3611381565b6115ec57600080fd5b6115f58161165d565b50565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008282111561162d57600080fd5b600082840390508091505092915050565b60008082840190508381101561165357600080fd5b8091505092915050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561169757600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000803073ffffffffffffffffffffffffffffffffffffffff166370a08231866040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156117d557600080fd5b505afa1580156117e9573d6000803e3d6000fd5b505050506040513d60208110156117ff57600080fd5b8101908080519060200190929190505050905060003073ffffffffffffffffffffffffffffffffffffffff166370a08231866040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561189157600080fd5b505afa1580156118a5573d6000803e3d6000fd5b505050506040513d60208110156118bb57600080fd5b810190808051906020019092919050505090506118d9868686611c32565b8473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c48786863073ffffffffffffffffffffffffffffffffffffffff166370a082318e6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156119e157600080fd5b505afa1580156119f5573d6000803e3d6000fd5b505050506040513d6020811015611a0b57600080fd5b81019080805190602001909291905050503073ffffffffffffffffffffffffffffffffffffffff166370a082318e6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015611a9957600080fd5b505afa158015611aad573d6000803e3d6000fd5b505050506040513d6020811015611ac357600080fd5b8101908080519060200190929190505050604051808681526020018581526020018481526020018381526020018281526020019550505050505060405180910390a46001925050509392505050565b6000806040518060800160405280605b8152602001611e1e605b91396040516020018082805190602001908083835b60208310611b645780518252602082019150602081019050602083039250611b41565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405160208183030381529060405280519060200120905060405181815273ffffffffffffffffffffffffffffffffffffffff8716602082015285604082015284606082015283608082015260a0812092505081915050949350505050565b60008060015490506040517f190100000000000000000000000000000000000000000000000000000000000081528160028201528360228201526042812092505081915050919050565b3073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611cd4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f63616e27742073656e6420746f204d524332300000000000000000000000000081525060200191505060405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015611d1a573d6000803e3d6000fd5b508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a350505056fe54686520636f6e747261637420697320616c726561647920696e697469616c697a6564496e73756666696369656e7420616d6f756e74206f7220696e76616c69642075736572454950373132446f6d61696e28737472696e67206e616d652c737472696e672076657273696f6e2c75696e7432353620636861696e49642c6164647265737320766572696679696e67436f6e747261637429546f6b656e5472616e736665724f726465722861646472657373207370656e6465722c75696e7432353620746f6b656e49644f72416d6f756e742c6279746573333220646174612c75696e743235362065787069726174696f6e29a265627a7a72315820ccd6c2a9c259832bbb367986ee06cd87af23022681b0cb22311a864b701d939564736f6c63430005100032"
          }
        }
      }
    }
  },
  "nonce": "0x0",
  "timestamp": "0x5ce28211",
  "extraData": "",
  "gasLimit": "0x989680",
  "difficulty": "0x1",
  "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "alloc": {
    "0000000000000000000000000000000000001000": {
      "balance": "0x0",
      "code": "0x608060405234801561001057600080fd5b50600436106101f05760003560e01c806360c8614d1161010f578063af26aa96116100a2578063d5b844eb11610071578063d5b844eb14610666578063dcf2793a14610684578063e3b7c924146106b6578063f59cf565146106d4576101f0565b8063af26aa96146105c7578063b71d7a69146105e7578063b7ab4db514610617578063c1b3c91914610636576101f0565b806370ba5707116100de57806370ba57071461052b57806398ab2b621461055b5780639d11b80714610579578063ae756451146105a9576101f0565b806360c8614d1461049c57806365b3a1e2146104bc57806366332354146104db578063687a9bd6146104f9576101f0565b80633434735f1161018757806344d6528f1161015657806344d6528f146103ee5780634dbc959f1461041e57806355614fcc1461043c578063582a8d081461046c576101f0565b80633434735f1461035257806335ddfeea1461037057806343ee8213146103a057806344c15cb1146103be576101f0565b806323f2a73f116101c357806323f2a73f146102a45780632bc06564146102d45780632de3a180146102f25780632eddf35214610322576101f0565b8063047a6c5b146101f55780630c35b1cb146102275780631270b5741461025857806323c2a2b414610288575b600080fd5b61020f600480360361020a9190810190612b24565b610706565b60405161021e93929190613463565b60405180910390f35b610241600480360361023c9190810190612b24565b61075d565b60405161024f929190613284565b60405180910390f35b610272600480360361026d9190810190612b4d565b610939565b60405161027f91906132bb565b60405180910390f35b6102a2600480360361029d9190810190612c2c565b610a91565b005b6102be60048036036102b99190810190612b4d565b61112a565b6040516102cb91906132bb565b60405180910390f35b6102dc611281565b6040516102e99190613411565b60405180910390f35b61030c60048036036103079190810190612a81565b611286565b60405161031991906132d6565b60405180910390f35b61033c60048036036103379190810190612b24565b611307565b6040516103499190613411565b60405180910390f35b61035a611437565b6040516103679190613269565b60405180910390f35b61038a60048036036103859190810190612abd565b61144f565b60405161039791906132bb565b60405180910390f35b6103a861151a565b6040516103b591906132d6565b60405180910390f35b6103d860048036036103d39190810190612b89565b611531565b6040516103e59190613411565b60405180910390f35b61040860048036036104039190810190612b4d565b611619565b60405161041591906133f6565b60405180910390f35b610426611781565b6040516104339190613411565b60405180910390f35b61045660048036036104519190810190612a06565b611791565b60405161046391906132bb565b60405180910390f35b61048660048036036104819190810190612a2f565b6117ab565b60405161049391906132d6565b60405180910390f35b6104a4611829565b6040516104b393929190613463565b60405180910390f35b6104c461189d565b6040516104d2929190613284565b60405180910390f35b6104e3611b6e565b6040516104f09190613411565b60405180910390f35b610513600480360361050e9190810190612bf0565b611b73565b6040516105229392919061342c565b60405180910390f35b61054560048036036105409190810190612a06565b611bd7565b60405161055291906132bb565b60405180910390f35b610563611bf1565b60405161057091906132d6565b60405180910390f35b610593600480360361058e9190810190612b24565b611c08565b6040516105a09190613411565b60405180910390f35b6105b1611d39565b6040516105be91906132d6565b60405180910390f35b6105cf611d50565b6040516105de93929190613463565b60405180910390f35b61060160048036036105fc9190810190612b24565b611db1565b60405161060e9190613411565b60405180910390f35b61061f611eb1565b60405161062d929190613284565b60405180910390f35b610650600480360361064b9190810190612b24565b611ec5565b60405161065d9190613411565b60405180910390f35b61066e611ee6565b60405161067b919061349a565b60405180910390f35b61069e60048036036106999190810190612bf0565b611eeb565b6040516106ad9392919061342c565b60405180910390f35b6106be611f4f565b6040516106cb9190613411565b60405180910390f35b6106ee60048036036106e99190810190612b24565b611f61565b6040516106fd93929190613463565b60405180910390f35b60008060006002600085815260200190815260200160002060000154600260008681526020019081526020016000206001015460026000878152602001908152602001600020600201549250925092509193909250565b60608060ff83116107795761077061189d565b91509150610934565b600061078484611db1565b9050606060016000838152602001908152602001600020805490506040519080825280602002602001820160405280156107cd5781602001602082028038833980820191505090505b509050606060016000848152602001908152602001600020805490506040519080825280602002602001820160405280156108175781602001602082028038833980820191505090505b50905060008090505b60016000858152602001908152602001600020805490508110156109295760016000858152602001908152602001600020818154811061085c57fe5b906000526020600020906003020160020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1683828151811061089a57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250506001600085815260200190815260200160002081815481106108f257fe5b90600052602060002090600302016001015482828151811061091057fe5b6020026020010181815250508080600101915050610820565b508181945094505050505b915091565b6000606060016000858152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b82821015610a0c578382906000526020600020906003020160405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152505081526020019060010190610970565b50505050905060008090505b8151811015610a84578373ffffffffffffffffffffffffffffffffffffffff16828281518110610a4457fe5b60200260200101516040015173ffffffffffffffffffffffffffffffffffffffff161415610a7757600192505050610a8b565b8080600101915050610a18565b5060009150505b92915050565b73fffffffffffffffffffffffffffffffffffffffe73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b13576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b0a906133d6565b60405180910390fd5b6000610b1d611781565b90506000811415610b3157610b30611f8b565b5b610b456001826122ac90919063ffffffff16565b8814610b86576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b7d90613356565b60405180910390fd5b868611610bc8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bbf906133b6565b60405180910390fd5b6000604060018989030181610bd957fe5b0614610c1a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c1190613396565b60405180910390fd5b8660026000838152602001908152602001600020600101541115610c73576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c6a90613336565b60405180910390fd5b6000600260008a81526020019081526020016000206000015414610ccc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cc390613376565b60405180910390fd5b604051806060016040528089815260200188815260200187815250600260008a8152602001908152602001600020600082015181600001556020820151816001015560408201518160020155905050600388908060018154018082558091505090600182039060005260206000200160009091929091909150555060008060008a815260200190815260200160002081610d669190612800565b506000600160008a815260200190815260200160002081610d879190612800565b506060610ddf610dda87878080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050506122cb565b6122f9565b905060008090505b8151811015610f51576060610e0e838381518110610e0157fe5b60200260200101516122f9565b90506000808c81526020019081526020016000208054809190600101610e349190612800565b506040518060600160405280610e5d83600081518110610e5057fe5b60200260200101516123d6565b8152602001610e7f83600181518110610e7257fe5b60200260200101516123d6565b8152602001610ea183600281518110610e9457fe5b6020026020010151612447565b73ffffffffffffffffffffffffffffffffffffffff168152506000808d81526020019081526020016000208381548110610ed757fe5b9060005260206000209060030201600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550905050508080600101915050610de7565b506060610fa9610fa486868080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050506122cb565b6122f9565b905060008090505b815181101561111d576060610fd8838381518110610fcb57fe5b60200260200101516122f9565b9050600160008d81526020019081526020016000208054809190600101610fff9190612800565b5060405180606001604052806110288360008151811061101b57fe5b60200260200101516123d6565b815260200161104a8360018151811061103d57fe5b60200260200101516123d6565b815260200161106c8360028151811061105f57fe5b6020026020010151612447565b73ffffffffffffffffffffffffffffffffffffffff16815250600160008e815260200190815260200160002083815481106110a357fe5b9060005260206000209060030201600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550905050508080600101915050610fb1565b5050505050505050505050565b60006060600080858152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b828210156111fc578382906000526020600020906003020160405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152505081526020019060010190611160565b50505050905060008090505b8151811015611274578373ffffffffffffffffffffffffffffffffffffffff1682828151811061123457fe5b60200260200101516040015173ffffffffffffffffffffffffffffffffffffffff1614156112675760019250505061127b565b8080600101915050611208565b5060009150505b92915050565b604081565b60006002600160f81b84846040516020016112a3939291906131d6565b6040516020818303038152906040526040516112bf9190613213565b602060405180830381855afa1580156112dc573d6000803e3d6000fd5b5050506040513d601f19601f820116820180604052506112ff9190810190612a58565b905092915050565b60006060600080848152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b828210156113d9578382906000526020600020906003020160405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815250508152602001906001019061133d565b505050509050600080905060008090505b825181101561142c5761141d83828151811061140257fe5b602002602001015160200151836122ac90919063ffffffff16565b915080806001019150506113ea565b508092505050919050565b73fffffffffffffffffffffffffffffffffffffffe81565b600080600080859050600060218087518161146657fe5b04029050600081111561147f5761147c876117ab565b91505b6000602190505b818111611509576000600182038801519050818801519550806000602081106114ab57fe5b1a60f81b9450600060f81b857effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614156114f0576114e98685611286565b93506114fd565b6114fa8487611286565b93505b50602181019050611486565b508782149450505050509392505050565b60405161152690613254565b604051809103902081565b60008060009050600080905060008090505b84518167ffffffffffffffff16101561160c57606061156e868367ffffffffffffffff16604161246a565b9050600061158582896124f690919063ffffffff16565b905061158f612832565b6115998a83611619565b90506115a58a8361112a565b80156115dc57508473ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16115b156115fe578194506115fb8160200151876122ac90919063ffffffff16565b95505b505050604181019050611543565b5081925050509392505050565b611621612832565b6060600080858152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b828210156116f1578382906000526020600020906003020160405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152505081526020019060010190611655565b50505050905060008090505b8151811015611779578373ffffffffffffffffffffffffffffffffffffffff1682828151811061172957fe5b60200260200101516040015173ffffffffffffffffffffffffffffffffffffffff16141561176c5781818151811061175d57fe5b60200260200101519250611779565b80806001019150506116fd565b505092915050565b600061178c43611db1565b905090565b60006117a461179e611781565b8361112a565b9050919050565b60006002600060f81b836040516020016117c69291906131aa565b6040516020818303038152906040526040516117e29190613213565b602060405180830381855afa1580156117ff573d6000803e3d6000fd5b5050506040513d601f19601f820116820180604052506118229190810190612a58565b9050919050565b60008060008061184a600161183c611781565b6122ac90919063ffffffff16565b905060026000828152602001908152602001600020600001546002600083815260200190815260200160002060010154600260008481526020019081526020016000206002015493509350935050909192565b606080606060056040519080825280602002602001820160405280156118d25781602001602082028038833980820191505090505b50905073c26880a0af2ea0c7e8130e6ec47af756465452e8816000815181106118f757fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505073be188d6641e8b680743a4815dfa0f6208038960f8160018151811061195357fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505073c275dc8be39f50d12f66b6a63629c39da5bae5bd816002815181106119af57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505073f903ba9e006193c1527bfbe65fe2123704ea3f9981600381518110611a0b57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505073928ed6a3e94437bbd316ccad78479f1d163a6a8c81600481518110611a6757fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505060606005604051908082528060200260200182016040528015611ad35781602001602082028038833980820191505090505b50905061271081600081518110611ae657fe5b60200260200101818152505061271081600181518110611b0257fe5b60200260200101818152505061271081600281518110611b1e57fe5b60200260200101818152505061271081600381518110611b3a57fe5b60200260200101818152505061271081600481518110611b5657fe5b60200260200101818152505081819350935050509091565b60ff81565b60016020528160005260406000208181548110611b8c57fe5b9060005260206000209060030201600091509150508060000154908060010154908060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905083565b6000611bea611be4611781565b83610939565b9050919050565b604051611bfd9061322a565b604051809103902081565b6000606060016000848152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b82821015611cdb578382906000526020600020906003020160405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152505081526020019060010190611c3f565b505050509050600080905060008090505b8251811015611d2e57611d1f838281518110611d0457fe5b602002602001015160200151836122ac90919063ffffffff16565b91508080600101915050611cec565b508092505050919050565b604051611d459061323f565b604051809103902081565b600080600080611d5e611781565b905060026000828152602001908152602001600020600001546002600083815260200190815260200160002060010154600260008481526020019081526020016000206002015493509350935050909192565b60008060038054905090505b6000811115611e7157611dce612869565b6002600060036001850381548110611de257fe5b906000526020600020015481526020019081526020016000206040518060600160405290816000820154815260200160018201548152602001600282015481525050905083816020015111158015611e3f57506000816040015114155b8015611e4f575080604001518411155b15611e6257806000015192505050611eac565b50808060019003915050611dbd565b5060006003805490501115611ea757600360016003805490500381548110611e9557fe5b90600052602060002001549050611eac565b600090505b919050565b606080611ebd4361075d565b915091509091565b60038181548110611ed257fe5b906000526020600020016000915090505481565b600281565b60006020528160005260406000208181548110611f0457fe5b9060005260206000209060030201600091509150508060000154908060010154908060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905083565b600060404381611f5b57fe5b04905090565b60026020528060005260406000206000915090508060000154908060010154908060020154905083565b606080611f9661189d565b8092508193505050600080905060405180606001604052808281526020016000815260200160ff81525060026000838152602001908152602001600020600082015181600001556020820151816001015560408201518160020155905050600381908060018154018082558091505090600182039060005260206000200160009091929091909150555060008060008381526020019081526020016000208161203f9190612800565b50600060016000838152602001908152602001600020816120609190612800565b5060008090505b83518110156121825760008083815260200190815260200160002080548091906001016120949190612800565b5060405180606001604052808281526020018483815181106120b257fe5b602002602001015181526020018583815181106120cb57fe5b602002602001015173ffffffffffffffffffffffffffffffffffffffff16815250600080848152602001908152602001600020828154811061210957fe5b9060005260206000209060030201600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050508080600101915050612067565b5060008090505b83518110156122a6576001600083815260200190815260200160002080548091906001016121b79190612800565b5060405180606001604052808281526020018483815181106121d557fe5b602002602001015181526020018583815181106121ee57fe5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1681525060016000848152602001908152602001600020828154811061222d57fe5b9060005260206000209060030201600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050508080600101915050612189565b50505050565b6000808284019050838110156122c157600080fd5b8091505092915050565b6122d361288a565b600060208301905060405180604001604052808451815260200182815250915050919050565b606061230482612600565b61230d57600080fd5b60006123188361264e565b905060608160405190808252806020026020018201604052801561235657816020015b6123436128a4565b81526020019060019003908161233b5790505b509050600061236885602001516126bf565b8560200151019050600080600090505b848110156123c95761238983612748565b91506040518060400160405280838152602001848152508482815181106123ac57fe5b602002602001018190525081830192508080600101915050612378565b5082945050505050919050565b60008082600001511180156123f057506021826000015111155b6123f957600080fd5b600061240883602001516126bf565b9050600081846000015103905060008083866020015101905080519150602083101561243b57826020036101000a820491505b81945050505050919050565b6000601582600001511461245a57600080fd5b612463826123d6565b9050919050565b60608183018451101561247c57600080fd5b6060821560008114612499576040519150602082016040526124ea565b6040519150601f8416801560200281840101858101878315602002848b0101015b818310156124d757805183526020830192506020810190506124ba565b50868552601f19601f8301166040525050505b50809150509392505050565b600080600080604185511461251157600093505050506125fa565b602085015192506040850151915060ff6041860151169050601b8160ff16101561253c57601b810190505b601b8160ff16141580156125545750601c8160ff1614155b1561256557600093505050506125fa565b60006001878386866040516000815260200160405260405161258a94939291906132f1565b6020604051602081039080840390855afa1580156125ac573d6000803e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156125f257600080fd5b809450505050505b92915050565b600080826000015114156126175760009050612649565b60008083602001519050805160001a915060c060ff168260ff16101561264257600092505050612649565b6001925050505b919050565b6000808260000151141561266557600090506126ba565b6000809050600061267984602001516126bf565b84602001510190506000846000015185602001510190505b808210156126b3576126a282612748565b820191508280600101935050612691565b8293505050505b919050565b600080825160001a9050608060ff168110156126df576000915050612743565b60b860ff16811080612704575060c060ff168110158015612703575060f860ff1681105b5b15612713576001915050612743565b60c060ff168110156127335760018060b80360ff16820301915050612743565b60018060f80360ff168203019150505b919050565b6000806000835160001a9050608060ff1681101561276957600191506127f6565b60b860ff16811015612786576001608060ff1682030191506127f5565b60c060ff168110156127b65760b78103600185019450806020036101000a855104600182018101935050506127f4565b60f860ff168110156127d357600160c060ff1682030191506127f3565b60f78103600185019450806020036101000a855104600182018101935050505b5b5b5b8192505050919050565b81548183558181111561282d5760030281600302836000526020600020918201910161282c91906128be565b5b505050565b60405180606001604052806000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff1681525090565b60405180606001604052806000815260200160008152602001600081525090565b604051806040016040528060008152602001600081525090565b604051806040016040528060008152602001600081525090565b61291191905b8082111561290d5760008082016000905560018201600090556002820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055506003016128c4565b5090565b90565b60008135905061292381613693565b92915050565b600081359050612938816136aa565b92915050565b60008151905061294d816136aa565b92915050565b60008083601f84011261296557600080fd5b8235905067ffffffffffffffff81111561297e57600080fd5b60208301915083600182028301111561299657600080fd5b9250929050565b600082601f8301126129ae57600080fd5b81356129c16129bc826134e2565b6134b5565b915080825260208301602083018583830111156129dd57600080fd5b6129e883828461363d565b50505092915050565b600081359050612a00816136c1565b92915050565b600060208284031215612a1857600080fd5b6000612a2684828501612914565b91505092915050565b600060208284031215612a4157600080fd5b6000612a4f84828501612929565b91505092915050565b600060208284031215612a6a57600080fd5b6000612a788482850161293e565b91505092915050565b60008060408385031215612a9457600080fd5b6000612aa285828601612929565b9250506020612ab385828601612929565b9150509250929050565b600080600060608486031215612ad257600080fd5b6000612ae086828701612929565b9350506020612af186828701612929565b925050604084013567ffffffffffffffff811115612b0e57600080fd5b612b1a8682870161299d565b9150509250925092565b600060208284031215612b3657600080fd5b6000612b44848285016129f1565b91505092915050565b60008060408385031215612b6057600080fd5b6000612b6e858286016129f1565b9250506020612b7f85828601612914565b9150509250929050565b600080600060608486031215612b9e57600080fd5b6000612bac868287016129f1565b9350506020612bbd86828701612929565b925050604084013567ffffffffffffffff811115612bda57600080fd5b612be68682870161299d565b9150509250925092565b60008060408385031215612c0357600080fd5b6000612c11858286016129f1565b9250506020612c22858286016129f1565b9150509250929050565b600080600080600080600060a0888a031215612c4757600080fd5b6000612c558a828b016129f1565b9750506020612c668a828b016129f1565b9650506040612c778a828b016129f1565b955050606088013567ffffffffffffffff811115612c9457600080fd5b612ca08a828b01612953565b9450945050608088013567ffffffffffffffff811115612cbf57600080fd5b612ccb8a828b01612953565b925092505092959891949750929550565b6000612ce88383612d0c565b60208301905092915050565b6000612d00838361317d565b60208301905092915050565b612d15816135b2565b82525050565b612d24816135b2565b82525050565b6000612d358261352e565b612d3f8185613569565b9350612d4a8361350e565b8060005b83811015612d7b578151612d628882612cdc565b9750612d6d8361354f565b925050600181019050612d4e565b5085935050505092915050565b6000612d9382613539565b612d9d818561357a565b9350612da88361351e565b8060005b83811015612dd9578151612dc08882612cf4565b9750612dcb8361355c565b925050600181019050612dac565b5085935050505092915050565b612def816135c4565b82525050565b612e06612e01826135d0565b61367f565b82525050565b612e15816135fc565b82525050565b612e2c612e27826135fc565b613689565b82525050565b6000612e3d82613544565b612e47818561358b565b9350612e5781856020860161364c565b80840191505092915050565b6000612e706004836135a7565b91507f766f7465000000000000000000000000000000000000000000000000000000006000830152600482019050919050565b6000612eb0602d83613596565b91507f537461727420626c6f636b206d7573742062652067726561746572207468616e60008301527f2063757272656e74207370616e000000000000000000000000000000000000006020830152604082019050919050565b6000612f16600f83613596565b91507f496e76616c6964207370616e20696400000000000000000000000000000000006000830152602082019050919050565b6000612f56601383613596565b91507f5370616e20616c726561647920657869737473000000000000000000000000006000830152602082019050919050565b6000612f96604583613596565b91507f446966666572656e6365206265747765656e20737461727420616e6420656e6460008301527f20626c6f636b206d75737420626520696e206d756c7469706c6573206f66207360208301527f7072696e740000000000000000000000000000000000000000000000000000006040830152606082019050919050565b6000613022602a83613596565b91507f456e6420626c6f636b206d7573742062652067726561746572207468616e207360008301527f7461727420626c6f636b000000000000000000000000000000000000000000006020830152604082019050919050565b6000613088601283613596565b91507f4e6f742053797374656d204164646573732100000000000000000000000000006000830152602082019050919050565b60006130c86005836135a7565b91507f38303030310000000000000000000000000000000000000000000000000000006000830152600582019050919050565b6000613108600e836135a7565b91507f6865696d64616c6c2d38303030310000000000000000000000000000000000006000830152600e82019050919050565b606082016000820151613151600085018261317d565b506020820151613164602085018261317d565b5060408201516131776040850182612d0c565b50505050565b61318681613626565b82525050565b61319581613626565b82525050565b6131a481613630565b82525050565b60006131b68285612df5565b6001820191506131c68284612e1b565b6020820191508190509392505050565b60006131e28286612df5565b6001820191506131f28285612e1b565b6020820191506132028284612e1b565b602082019150819050949350505050565b600061321f8284612e32565b915081905092915050565b600061323582612e63565b9150819050919050565b600061324a826130bb565b9150819050919050565b600061325f826130fb565b9150819050919050565b600060208201905061327e6000830184612d1b565b92915050565b6000604082019050818103600083015261329e8185612d2a565b905081810360208301526132b28184612d88565b90509392505050565b60006020820190506132d06000830184612de6565b92915050565b60006020820190506132eb6000830184612e0c565b92915050565b60006080820190506133066000830187612e0c565b613313602083018661319b565b6133206040830185612e0c565b61332d6060830184612e0c565b95945050505050565b6000602082019050818103600083015261334f81612ea3565b9050919050565b6000602082019050818103600083015261336f81612f09565b9050919050565b6000602082019050818103600083015261338f81612f49565b9050919050565b600060208201905081810360008301526133af81612f89565b9050919050565b600060208201905081810360008301526133cf81613015565b9050919050565b600060208201905081810360008301526133ef8161307b565b9050919050565b600060608201905061340b600083018461313b565b92915050565b6000602082019050613426600083018461318c565b92915050565b6000606082019050613441600083018661318c565b61344e602083018561318c565b61345b6040830184612d1b565b949350505050565b6000606082019050613478600083018661318c565b613485602083018561318c565b613492604083018461318c565b949350505050565b60006020820190506134af600083018461319b565b92915050565b6000604051905081810181811067ffffffffffffffff821117156134d857600080fd5b8060405250919050565b600067ffffffffffffffff8211156134f957600080fd5b601f19601f8301169050602081019050919050565b6000819050602082019050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b60006135bd82613606565b9050919050565b60008115159050919050565b60007fff0000000000000000000000000000000000000000000000000000000000000082169050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b82818337600083830152505050565b60005b8381101561366a57808201518184015260208101905061364f565b83811115613679576000848401525b50505050565b6000819050919050565b6000819050919050565b61369c816135b2565b81146136a757600080fd5b50565b6136b3816135fc565b81146136be57600080fd5b50565b6136ca81613626565b81146136d557600080fd5b5056fea365627a7a723158208f52ee07630ffe523cc6ad3e15f437f973dcfa36729cd697f9b0fc4a145a48f06c6578706572696d656e74616cf564736f6c634300050b0040"
    },
    "0000000000000000000000000000000000001001": {
      "balance": "0x0",
      "code": "0x608060405234801561001057600080fd5b50600436106100415760003560e01c806319494a17146100465780633434735f146100e15780635407ca671461012b575b600080fd5b6100c76004803603604081101561005c57600080fd5b81019080803590602001909291908035906020019064010000000081111561008357600080fd5b82018360208201111561009557600080fd5b803590602001918460018302840111640100000000831117156100b757600080fd5b9091929391929390505050610149565b604051808215151515815260200191505060405180910390f35b6100e961047a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610133610492565b6040518082815260200191505060405180910390f35b600073fffffffffffffffffffffffffffffffffffffffe73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610200576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f4e6f742053797374656d2041646465737321000000000000000000000000000081525060200191505060405180910390fd5b606061025761025285858080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050610498565b6104c6565b905060006102788260008151811061026b57fe5b60200260200101516105a3565b905080600160005401146102f4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f537461746549647320617265206e6f742073657175656e7469616c000000000081525060200191505060405180910390fd5b600080815480929190600101919050555060006103248360018151811061031757fe5b6020026020010151610614565b905060606103458460028151811061033857fe5b6020026020010151610637565b9050610350826106c3565b1561046f576000624c4b409050606084836040516024018083815260200180602001828103825283818151815260200191508051906020019080838360005b838110156103aa57808201518184015260208101905061038f565b50505050905090810190601f1680156103d75780820380516001836020036101000a031916815260200191505b5093505050506040516020818303038152906040527f26c53bea000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050905060008082516020840160008887f1965050505b505050509392505050565b73fffffffffffffffffffffffffffffffffffffffe81565b60005481565b6104a0610943565b600060208301905060405180604001604052808451815260200182815250915050919050565b60606104d1826106dc565b6104da57600080fd5b60006104e58361072a565b905060608160405190808252806020026020018201604052801561052357816020015b61051061095d565b8152602001906001900390816105085790505b5090506000610535856020015161079b565b8560200151019050600080600090505b848110156105965761055683610824565b915060405180604001604052808381526020018481525084828151811061057957fe5b602002602001018190525081830192508080600101915050610545565b5082945050505050919050565b60008082600001511180156105bd57506021826000015111155b6105c657600080fd5b60006105d5836020015161079b565b9050600081846000015103905060008083866020015101905080519150602083101561060857826020036101000a820491505b81945050505050919050565b6000601582600001511461062757600080fd5b610630826105a3565b9050919050565b6060600082600001511161064a57600080fd5b6000610659836020015161079b565b905060008184600001510390506060816040519080825280601f01601f19166020018201604052801561069b5781602001600182028038833980820191505090505b50905060008160200190506106b78487602001510182856108dc565b81945050505050919050565b600080823b905060008163ffffffff1611915050919050565b600080826000015114156106f35760009050610725565b60008083602001519050805160001a915060c060ff168260ff16101561071e57600092505050610725565b6001925050505b919050565b600080826000015114156107415760009050610796565b60008090506000610755846020015161079b565b84602001510190506000846000015185602001510190505b8082101561078f5761077e82610824565b82019150828060010193505061076d565b8293505050505b919050565b600080825160001a9050608060ff168110156107bb57600091505061081f565b60b860ff168110806107e0575060c060ff1681101580156107df575060f860ff1681105b5b156107ef57600191505061081f565b60c060ff1681101561080f5760018060b80360ff1682030191505061081f565b60018060f80360ff168203019150505b919050565b6000806000835160001a9050608060ff1681101561084557600191506108d2565b60b860ff16811015610862576001608060ff1682030191506108d1565b60c060ff168110156108925760b78103600185019450806020036101000a855104600182018101935050506108d0565b60f860ff168110156108af57600160c060ff1682030191506108cf565b60f78103600185019450806020036101000a855104600182018101935050505b5b5b5b8192505050919050565b60008114156108ea5761093e565b5b602060ff16811061091a5782518252602060ff1683019250602060ff1682019150602060ff16810390506108eb565b6000600182602060ff16036101000a03905080198451168184511681811785525050505b505050565b604051806040016040528060008152602001600081525090565b60405180604001604052806000815260200160008152509056fea265627a7a7231582083fbdacb76f32b4112d0f7db9a596937925824798a0026ba0232322390b5263764736f6c634300050b0032"
    },
    "0000000000000000000000000000000000001010": {
      "balance": "0x204fcd4f31349d83b6e00000",
      "code": "0x60806040526004361061019c5760003560e01c806377d32e94116100ec578063acd06cb31161008a578063e306f77911610064578063e306f77914610a7b578063e614d0d614610aa6578063f2fde38b14610ad1578063fc0c546a14610b225761019c565b8063acd06cb31461097a578063b789543c146109cd578063cc79f97b14610a505761019c565b80639025e64c116100c65780639025e64c146107c957806395d89b4114610859578063a9059cbb146108e9578063abceeba21461094f5761019c565b806377d32e94146106315780638da5cb5b146107435780638f32d59b1461079a5761019c565b806347e7ef24116101595780637019d41a116101335780637019d41a1461053357806370a082311461058a578063715018a6146105ef578063771282f6146106065761019c565b806347e7ef2414610410578063485cc9551461046b57806360f96a8f146104dc5761019c565b806306fdde03146101a15780631499c5921461023157806318160ddd1461028257806319d27d9c146102ad5780632e1a7d4d146103b1578063313ce567146103df575b600080fd5b3480156101ad57600080fd5b506101b6610b79565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101f65780820151818401526020810190506101db565b50505050905090810190601f1680156102235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561023d57600080fd5b506102806004803603602081101561025457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610bb6565b005b34801561028e57600080fd5b50610297610c24565b6040518082815260200191505060405180910390f35b3480156102b957600080fd5b5061036f600480360360a08110156102d057600080fd5b81019080803590602001906401000000008111156102ed57600080fd5b8201836020820111156102ff57600080fd5b8035906020019184600183028401116401000000008311171561032157600080fd5b9091929391929390803590602001909291908035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c3a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103dd600480360360208110156103c757600080fd5b8101908080359060200190929190505050610e06565b005b3480156103eb57600080fd5b506103f4610f58565b604051808260ff1660ff16815260200191505060405180910390f35b34801561041c57600080fd5b506104696004803603604081101561043357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610f61565b005b34801561047757600080fd5b506104da6004803603604081101561048e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061111d565b005b3480156104e857600080fd5b506104f16111ec565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561053f57600080fd5b50610548611212565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561059657600080fd5b506105d9600480360360208110156105ad57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611238565b6040518082815260200191505060405180910390f35b3480156105fb57600080fd5b50610604611259565b005b34801561061257600080fd5b5061061b611329565b6040518082815260200191505060405180910390f35b34801561063d57600080fd5b506107016004803603604081101561065457600080fd5b81019080803590602001909291908035906020019064010000000081111561067b57600080fd5b82018360208201111561068d57600080fd5b803590602001918460018302840111640100000000831117156106af57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061132f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561074f57600080fd5b506107586114b4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156107a657600080fd5b506107af6114dd565b604051808215151515815260200191505060405180910390f35b3480156107d557600080fd5b506107de611534565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561081e578082015181840152602081019050610803565b50505050905090810190601f16801561084b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561086557600080fd5b5061086e61156d565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156108ae578082015181840152602081019050610893565b50505050905090810190601f1680156108db5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610935600480360360408110156108ff57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506115aa565b604051808215151515815260200191505060405180910390f35b34801561095b57600080fd5b506109646115d0565b6040518082815260200191505060405180910390f35b34801561098657600080fd5b506109b36004803603602081101561099d57600080fd5b810190808035906020019092919050505061165d565b604051808215151515815260200191505060405180910390f35b3480156109d957600080fd5b50610a3a600480360360808110156109f057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001909291908035906020019092919050505061167d565b6040518082815260200191505060405180910390f35b348015610a5c57600080fd5b50610a6561169d565b6040518082815260200191505060405180910390f35b348015610a8757600080fd5b50610a906116a4565b6040518082815260200191505060405180910390f35b348015610ab257600080fd5b50610abb6116aa565b6040518082815260200191505060405180910390f35b348015610add57600080fd5b50610b2060048036036020811015610af457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611737565b005b348015610b2e57600080fd5b50610b37611754565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60606040518060400160405280600b81526020017f4d6174696320546f6b656e000000000000000000000000000000000000000000815250905090565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f44697361626c656420666561747572650000000000000000000000000000000081525060200191505060405180910390fd5b6000601260ff16600a0a6402540be40002905090565b6000808511610c4857600080fd5b6000831480610c575750824311155b610cc9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f5369676e6174757265206973206578706972656400000000000000000000000081525060200191505060405180910390fd5b6000610cd73387878761167d565b9050600015156005600083815260200190815260200160002060009054906101000a900460ff16151514610d73576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600f8152602001807f536967206465616374697661746564000000000000000000000000000000000081525060200191505060405180910390fd5b60016005600083815260200190815260200160002060006101000a81548160ff021916908315150217905550610ded8189898080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505061132f565b9150610dfa82848861177a565b50509695505050505050565b60003390506000610e1682611238565b9050610e2d83600654611b3790919063ffffffff16565b600681905550600083118015610e4257508234145b610eb4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f496e73756666696369656e7420616d6f756e740000000000000000000000000081525060200191505060405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167febff2602b3f468259e1e99f613fed6691f3a6526effe6ef3e768ba7ae7a36c4f8584610f3087611238565b60405180848152602001838152602001828152602001935050505060405180910390a3505050565b60006012905090565b610f696114dd565b610f7257600080fd5b600081118015610faf5750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b611004576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180611e636023913960400191505060405180910390fd5b600061100f83611238565b905060008390508073ffffffffffffffffffffffffffffffffffffffff166108fc849081150290604051600060405180830381858888f1935050505015801561105c573d6000803e3d6000fd5b5061107283600654611b5790919063ffffffff16565b6006819055508373ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f4e2ca0515ed1aef1395f66b5303bb5d6f1bf9d61a353fa53f73f8ac9973fa9f685856110f489611238565b60405180848152602001838152602001828152602001935050505060405180910390a350505050565b600760009054906101000a900460ff1615611183576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180611e406023913960400191505060405180910390fd5b6001600760006101000a81548160ff02191690831515021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506111e882611b76565b5050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b6112616114dd565b61126a57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a360008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60065481565b600080600080604185511461134a57600093505050506114ae565b602085015192506040850151915060ff6041860151169050601b8160ff16101561137557601b810190505b601b8160ff161415801561138d5750601c8160ff1614155b1561139e57600093505050506114ae565b60018682858560405160008152602001604052604051808581526020018460ff1660ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa1580156113fb573d6000803e3d6000fd5b505050602060405103519350600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614156114aa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f4572726f7220696e2065637265636f766572000000000000000000000000000081525060200191505060405180910390fd5b5050505b92915050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b6040518060400160405280600381526020017f013881000000000000000000000000000000000000000000000000000000000081525081565b60606040518060400160405280600581526020017f4d41544943000000000000000000000000000000000000000000000000000000815250905090565b60008134146115bc57600090506115ca565b6115c733848461177a565b90505b92915050565b6040518060800160405280605b8152602001611ed8605b91396040516020018082805190602001908083835b6020831061161f57805182526020820191506020810190506020830392506115fc565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040528051906020012081565b60056020528060005260406000206000915054906101000a900460ff1681565b600061169361168e86868686611c6e565b611d44565b9050949350505050565b6201388181565b60015481565b604051806080016040528060528152602001611e86605291396040516020018082805190602001908083835b602083106116f957805182526020820191506020810190506020830392506116d6565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040528051906020012081565b61173f6114dd565b61174857600080fd5b61175181611b76565b50565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000803073ffffffffffffffffffffffffffffffffffffffff166370a08231866040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156117fa57600080fd5b505afa15801561180e573d6000803e3d6000fd5b505050506040513d602081101561182457600080fd5b8101908080519060200190929190505050905060003073ffffffffffffffffffffffffffffffffffffffff166370a08231866040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156118b657600080fd5b505afa1580156118ca573d6000803e3d6000fd5b505050506040513d60208110156118e057600080fd5b810190808051906020019092919050505090506118fe868686611d8e565b8473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c48786863073ffffffffffffffffffffffffffffffffffffffff166370a082318e6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015611a0657600080fd5b505afa158015611a1a573d6000803e3d6000fd5b505050506040513d6020811015611a3057600080fd5b81019080805190602001909291905050503073ffffffffffffffffffffffffffffffffffffffff166370a082318e6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015611abe57600080fd5b505afa158015611ad2573d6000803e3d6000fd5b505050506040513d6020811015611ae857600080fd5b8101908080519060200190929190505050604051808681526020018581526020018481526020018381526020018281526020019550505050505060405180910390a46001925050509392505050565b600082821115611b4657600080fd5b600082840390508091505092915050565b600080828401905083811015611b6c57600080fd5b8091505092915050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611bb057600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000806040518060800160405280605b8152602001611ed8605b91396040516020018082805190602001908083835b60208310611cc05780518252602082019150602081019050602083039250611c9d565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405160208183030381529060405280519060200120905060405181815273ffffffffffffffffffffffffffffffffffffffff8716602082015285604082015284606082015283608082015260a0812092505081915050949350505050565b60008060015490506040517f190100000000000000000000000000000000000000000000000000000000000081528160028201528360228201526042812092505081915050919050565b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015611dd4573d6000803e3d6000fd5b508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a350505056fe54686520636f6e747261637420697320616c726561647920696e697469616c697a6564496e73756666696369656e7420616d6f756e74206f7220696e76616c69642075736572454950373132446f6d61696e28737472696e67206e616d652c737472696e672076657273696f6e2c75696e7432353620636861696e49642c6164647265737320766572696679696e67436f6e747261637429546f6b656e5472616e736665724f726465722861646472657373207370656e6465722c75696e7432353620746f6b656e49644f72416d6f756e742c6279746573333220646174612c75696e743235362065787069726174696f6e29a265627a7a723158208f81700133738d766ae3d68af591ad588b0125bd91449192179f460893f79f6b64736f6c634300050b0032"
    },
    "C26880A0AF2EA0c7E8130e6EC47Af756465452E8": {
      "balance": "0x3635c9adc5dea00000"
    },
    "be188D6641E8b680743A4815dFA0f6208038960F": {
      "balance": "0x3635c9adc5dea00000"
    },
    "c275DC8bE39f50D12F66B6a63629C39dA5BAe5bd": {
      "balance": "0x3635c9adc5dea00000"
    },
    "F903ba9E006193c1527BfBe65fe2123704EA3F99": {
      "balance": "0x3635c9adc5dea00000"
    },
    "928Ed6A3e94437bbd316cCAD78479f1d163A6A8C": {
      "balance": "0x3635c9adc5dea00000"
    }
  },
  "number": "0x0",
  "gasUsed": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
`;
