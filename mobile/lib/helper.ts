import { EntryPoint__factory } from "@account-abstraction/contracts"
import {
  ClientConfig,
  ERC4337EthersProvider,
  HttpRpcClient,
  PrivateRecoveryAccountAPI,
  TokenPaymasterAPI,
  VerifiedPaymasterAPI,
} from "@accountjs/sdk"

import { LOCAL_CONFIG } from "@/config"
import { Balances, PaymasterMode, zeroAddress } from "./type"
import { Signer } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers"
import { parseEther, parseUnits } from "ethers/lib/utils.js"
import { provider, admin } from "./instance"
import { balanceOf } from "./utils"
import { Address } from "wagmi"
import { WETH__factory, Token__factory, 
  WETHPaymaster__factory, USDPaymaster__factory,
  FixedPaymaster__factory, VerifyingPaymaster__factory  
} from "@accountjs/contracts"
import { wrapPrivateGuardianProvider } from "@accountjs/sdk/dist/src/Provider"

const {
  bundlerUrl,
  entryPoint,
  privateRecoveryFactory,
  weth,
  usdt,
  tokenAddr,
  wethPaymaster,
  usdtPaymaster,
  fixedPaymaster,
  gaslessPaymaster
} = LOCAL_CONFIG

export async function getAAProvider(
  owner: Signer,
  paymasterMode: PaymasterMode = PaymasterMode.none,
  walletAddress?: string
): Promise<ERC4337EthersProvider> {
  let config: ClientConfig
  switch (paymasterMode) {
    case PaymasterMode.none:
      config = {
        entryPointAddress: entryPoint,
        bundlerUrl: bundlerUrl,
        accountFactory: privateRecoveryFactory,
        walletAddress
      }
      
      return wrapPrivateGuardianProvider(provider, config, owner, zeroAddress, zeroAddress)
    case PaymasterMode.weth:
      const WethPaymaster = new TokenPaymasterAPI(wethPaymaster)
      config = {
        entryPointAddress: entryPoint,
        bundlerUrl: bundlerUrl,
        accountFactory: privateRecoveryFactory,
        paymasterAPI: WethPaymaster,
        walletAddress
      }
      
      return wrapPrivateGuardianProvider(provider, config, owner, weth, wethPaymaster)
    case PaymasterMode.usdt:
      const USDTPaymaster = new TokenPaymasterAPI(wethPaymaster)
      config = {
        entryPointAddress: entryPoint,
        bundlerUrl: bundlerUrl,
        accountFactory: privateRecoveryFactory,
        paymasterAPI: USDTPaymaster,
        walletAddress
      }
      
      return wrapPrivateGuardianProvider(provider, config, owner, usdt, usdtPaymaster)

      case PaymasterMode.token:
        const FixedPaymaster = new TokenPaymasterAPI(fixedPaymaster)
        config = {
          entryPointAddress: entryPoint,
          bundlerUrl: bundlerUrl,
          accountFactory: privateRecoveryFactory,
          paymasterAPI: FixedPaymaster,
          walletAddress
        }
        
        return wrapPrivateGuardianProvider(provider, config, owner, tokenAddr, fixedPaymaster)

      case PaymasterMode.gasless:
        const GaslessPaymaster = new VerifiedPaymasterAPI(gaslessPaymaster, admin)
        config = {
          entryPointAddress: entryPoint,
          bundlerUrl: bundlerUrl,
          accountFactory: privateRecoveryFactory,
          paymasterAPI: GaslessPaymaster,
          walletAddress
        }
        
        return wrapPrivateGuardianProvider(provider, config, owner, zeroAddress, zeroAddress)

    default:
      throw new Error("Not implemented")
  }
}

export async function testFaucet(account: Address, amount = "1") {
  // const ethBalance = await balanceOf(account)
  await admin.sendTransaction({
    to: account,
    value: parseEther(amount),
  }) // ETH

  // WETH
  await admin.sendTransaction({
    to: weth,
    value: parseEther(amount),
  })

  await Token__factory.connect(weth, admin).transfer(
    account,
    parseEther(amount)
  )

  // USDT
  await Token__factory.connect(usdt, admin).transfer(
    account,
    parseUnits(amount, 12)
  )

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

export async function depositAll(amount = "1") {
  const WethPaymaster = WETHPaymaster__factory.connect(wethPaymaster, admin)
  await WethPaymaster.deposit({ value: parseEther(amount) })
  const UsdPaymaster = USDPaymaster__factory.connect(usdtPaymaster, admin)
  await UsdPaymaster.deposit({ value: parseEther(amount) })
  const TokenPaymaster = FixedPaymaster__factory.connect(fixedPaymaster, admin)
  await TokenPaymaster.deposit({ value: parseEther(amount) })
  const GaslessPaymaster = VerifyingPaymaster__factory.connect(
    gaslessPaymaster,
    admin,
  )
  await GaslessPaymaster.deposit({ value: parseEther(amount) })
}
