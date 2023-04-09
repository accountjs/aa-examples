export const LOCAL_CONFIG = {
  mnemonic: 'test test test test test test test test test test test junk',
  entryPoint: '0x5FbDB2315678afecb367f032d93F642f64180aa3',

  updateGuardianVerifier: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  socialRecoveryVerifier: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  privateRecoveryAccountFactory: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  poseidon: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',

  wethPaymaster: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
  usdtPaymaster: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  fixedPaymaster: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
  gaslessPaymaster: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',

  weth: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  usdt: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  tokenAddr: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  bundlerUrl: 'http://localhost:3000/rpc',
  providerUrl: 'http://localhost:8545',
} as const

// export const LOCAL_CONFIG = {
//   mnemonic: 'test test test test test test test test test test test junk',
//   entryPoint: '0x0576a174d229e3cfa37253523e645a78a0c91b57',
//   accountFactory: '0x7192244743491fcb3f8f682d57ab6e9e1f41de6e',
//   accountForTokenFactory: '0xf25dc911d2c89559aeef1a49e36582f9cb305397',

//   privateRecoveryFactory: '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
//   poseidonT3: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
//   updateGuardianVerifier: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
//   socialRecoveryVerifier: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',

//   wethPaymaster: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
//   usdtPaymaster: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
//   fixedPaymaster: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
//   gaslessPaymaster: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',

//   weth: '0xfb970555c468b82cd55831d09bb4c7ee85188675',
//   usdt: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
//   tokenAddr: '0x85d3ad7c7648d14ac4a6bfbfb10c4dfac2e63b5f',
//   bundlerUrl: 'http://localhost:3000/rpc',
//   providerUrl: 'http://localhost:8545',
// } as const

export const GOERLI_CONFIG = {
  mnemonic: 'test test test test test test test test test test test junk',
  entryPoint: '0x9B20815493cC9790AbbbD3f90F2657cdEB227640',
  accountFactory: '0xA855A1fCF6Be1E16eF3a0115B01965e839b64E65',
  accountForTokenFactory: '0xe48c5a94cB4EA5FFcc1b682d82aED5019Bc63b84',
  wethPaymaster: '0x36F7466875Cb9614864406d0a353021f01266cB7',
  usdtPaymaster: '0x2694a7b6Fe37373581308dfA12757f7a0b603Be1',
  fixedPaymaster: '0x7500Aad545348099cbBf2F8B720701f41336008A',
  weth: '0xb63D63c12Db7af135165227a98aa13B008c92f8A',
  usdt: '0xC8cd2521A45B6133d134458CE43Def8587E309ea',
  tokenAddr: '0x9Fcfd091b0519775d572C59E37ead19870c49cdD',
  bundlerUrl: 'http://localhost:3000/rpc',
  providerUrl: 'http://localhost:8545',
} as const
