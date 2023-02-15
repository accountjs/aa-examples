export const LOCAL_CONFIG = {
  mnemonic: 'test test test test test test test test test test test junk',
  entryPoint: '0x1306b01bc3e4ad202612d3843387e94737673f53',
  accountFactory: '0x17d2a828e552031d2063442cca4f4a1d1d0119e1',
  accountForTokenFactory: '0x705560872870af0225199eee070d807aa585c0ea',
  wethPaymaster: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  usdtPaymaster: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
  usdt: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  bundlerUrl: 'http://localhost:3000/rpc',
  providerUrl: 'http://localhost:8545',
} as const

export const GOERLI_CONFIG = {
  mnemonic: 'test test test test test test test test test test test junk',
  entryPoint: '0x9B20815493cC9790AbbbD3f90F2657cdEB227640',
  accountFactory: '0xe48c5a94cB4EA5FFcc1b682d82aED5019Bc63b84',
  usdt: '0xC8cd2521A45B6133d134458CE43Def8587E309ea',
  bundlerUrl: 'http://localhost:3000/rpc',
  providerUrl: 'http://localhost:8545',
} as const
