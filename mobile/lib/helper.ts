import {
  EntryPoint__factory,
} from "@account-abstraction/contracts"
import {
  ClientConfig,
  ERC4337EthersProvider,
  HttpRpcClient,
  SimpleAccountAPI,
} from "@accountjs/sdk"

import { LOCAL_CONFIG } from "@/config"
import { PaymasterMode } from "./type"
import { Signer } from "ethers"
import { JsonRpcProvider } from '@ethersproject/providers'
import {
  parseEther,
  parseUnits,
} from "ethers/lib/utils.js"
import { provider, admin } from "./instance"
import { balanceOf } from "./utils"
import { Address } from "wagmi"
import { WETH__factory, Token__factory } from "@accountjs/contracts"

const {
    bundlerUrl,
    entryPoint,
    accountFactory,
    accountForTokenFactory,
    weth, usdt, tokenAddr,
  } = LOCAL_CONFIG

async function wrapProvider(provider: JsonRpcProvider, config: ClientConfig, owner: Signer) {
    const chainId = await provider.getNetwork().then(net => net.chainId)
    console.log("chainId", chainId)
    const httpRpcClient = new HttpRpcClient(config.bundlerUrl, config.entryPointAddress, chainId)
    const entryPointContract = EntryPoint__factory.connect(config.entryPointAddress, provider)
    const smartAccountAPI = new SimpleAccountAPI({
      provider,
      entryPointAddress: config.entryPointAddress,
      owner,
      factoryAddress: accountFactory,
    })
    
    return new ERC4337EthersProvider(
      chainId,
      config,
      owner,
      provider,
      httpRpcClient,
      entryPointContract,
      smartAccountAPI
    ).init()
  }

export async function getAAProvider(
    owner: Signer,
    paymasterMode: PaymasterMode = PaymasterMode.none,
    account?: string,
  ): Promise<ERC4337EthersProvider> {
    switch (paymasterMode) {
      case PaymasterMode.none:
        const config = {
          entryPointAddress: entryPoint,
          bundlerUrl: bundlerUrl,
        }
        return wrapProvider(provider, config, owner)
      default:
        throw new Error("Not implemented")
    }
  }

export async function testFaucet(account: Address, amount = "1") {
  // const ethBalance = await balanceOf(account)
  await admin.sendTransaction({
    to: account,
    value: parseEther(amount)
  }) // ETH

  // WETH
  await admin.sendTransaction({
    to: weth,
    value: parseEther(amount),
  })

  await Token__factory.connect(weth, admin).transfer(
    account, parseEther(amount))

  // USDT
  await Token__factory.connect(usdt, admin).transfer(
    account, parseUnits(amount, 12))

  // Token
  // const token = Token__factory.connect(tokenAddr, admin)
  // const requiredTok = parseEther("100")
  // token.mint(requiredTok)
  // token.transfer(account, requiredTok)
}

export const getUserBalances = async (address: Address) => {
  const etherBalance = await balanceOf(address)
  const wethBalance = await balanceOf(address, weth)
  const usdtBalance = await balanceOf(address, usdt)
  const tokenBalance = await balanceOf(address, tokenAddr)

  return {
    ether: etherBalance,
    weth: wethBalance,
    usdt: usdtBalance,
    token: tokenBalance,
  }
}


// export async function depositAll(amount = "1") {
//   const WethPaymaster = WETHPaymaster__factory.connect(wethPaymaster, admin)
//   await WethPaymaster.deposit({ value: parseEther(amount) })
//   const UsdPaymaster = USDPaymaster__factory.connect(usdtPaymaster, admin)
//   await UsdPaymaster.deposit({ value: parseEther(amount) })
//   const TokenPaymaster = FixedPaymaster__factory.connect(fixedPaymaster, admin)
//   await TokenPaymaster.deposit({ value: parseEther(amount) })
//   const GaslessPaymaster = VerifyingPaymaster__factory.connect(
//     gaslessPaymaster,
//     admin,
//   )
//   await GaslessPaymaster.deposit({ value: parseEther(amount) })
// }