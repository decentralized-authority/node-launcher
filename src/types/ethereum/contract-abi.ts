import { AbiItem } from 'web3-utils';

type EFAbi = AbiItem & { gas?: number };

export const contractAbi: EFAbi[] = [
  {
    name: 'DepositEvent',
    inputs: [
      { type: 'bytes', name: 'pubkey', indexed: false },
      { type: 'bytes', name: 'withdrawal_credentials', indexed: false },
      { type: 'bytes', name: 'amount', indexed: false },
      { type: 'bytes', name: 'signature', indexed: false },
      { type: 'bytes', name: 'index', indexed: false },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    outputs: [],
    inputs: [],
    constant: false,
    payable: false,
    type: 'constructor',
  },
  {
    name: 'get_deposit_root',
    outputs: [{ type: 'bytes32', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
  },
  {
    name: 'get_deposit_count',
    outputs: [{ type: 'bytes', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
  },
  {
    name: 'deposit',
    outputs: [],
    inputs: [
      { type: 'bytes', name: 'pubkey' },
      { type: 'bytes', name: 'withdrawal_credentials' },
      { type: 'bytes', name: 'signature' },
      { type: 'bytes32', name: 'deposit_data_root' },
    ],
    constant: false,
    payable: true,
    type: 'function',
  },
  {
    name: 'drain',
    outputs: [],
    inputs: [],
    constant: false,
    payable: false,
    type: 'function',
  },
];
