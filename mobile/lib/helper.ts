import {
  ClientConfig,
  ERC4337EthersProvider,
  HttpRpcClient,
  PrivateRecoveryAccountAPI,
  TokenPaymasterAPI,
  VerifiedPaymasterAPI,
} from "@accountjs/sdk"

import { LOCAL_CONFIG } from "@/config"
import { Currency, PaymasterMode, zeroAddress } from "./type"
import { Signer } from "ethers"
import { parseEther, parseUnits } from "ethers/lib/utils.js"
import { Address } from "wagmi"
import { Token__factory, WETHPaymaster__factory } from "@accountjs/contracts"
import { wrapPrivateGuardianProvider } from "@accountjs/sdk/dist/src/Provider"

import { provider, admin } from "./instance"
import { balanceOf } from "./utils"

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
        walletAddress,
      }

      return wrapPrivateGuardianProvider(
        provider,
        config,
        owner,
        zeroAddress,
        zeroAddress
      )
    case PaymasterMode.weth:
      const WethPaymaster = new TokenPaymasterAPI(wethPaymaster)
      config = {
        entryPointAddress: entryPoint,
        bundlerUrl: bundlerUrl,
        accountFactory: privateRecoveryFactory,
        paymasterAPI: WethPaymaster,
        walletAddress,
      }

      return wrapPrivateGuardianProvider(
        provider,
        config,
        owner,
        weth,
        wethPaymaster
      )
    case PaymasterMode.usdt:
      const USDTPaymaster = new TokenPaymasterAPI(usdtPaymaster)
      config = {
        entryPointAddress: entryPoint,
        bundlerUrl: bundlerUrl,
        accountFactory: privateRecoveryFactory,
        paymasterAPI: USDTPaymaster,
        walletAddress,
      }

      return wrapPrivateGuardianProvider(
        provider,
        config,
        owner,
        usdt,
        usdtPaymaster
      )

    case PaymasterMode.token:
      const FixedPaymaster = new TokenPaymasterAPI(fixedPaymaster)
      config = {
        entryPointAddress: entryPoint,
        bundlerUrl: bundlerUrl,
        accountFactory: privateRecoveryFactory,
        paymasterAPI: FixedPaymaster,
        walletAddress,
      }

      return wrapPrivateGuardianProvider(
        provider,
        config,
        owner,
        tokenAddr,
        fixedPaymaster
      )

    case PaymasterMode.gasless:
      const GaslessPaymaster = new VerifiedPaymasterAPI(gaslessPaymaster, admin)
      config = {
        entryPointAddress: entryPoint,
        bundlerUrl: bundlerUrl,
        accountFactory: privateRecoveryFactory,
        paymasterAPI: GaslessPaymaster,
        walletAddress,
      }

      return wrapPrivateGuardianProvider(
        provider,
        config,
        owner,
        zeroAddress,
        zeroAddress
      )

    default:
      throw new Error("Not implemented")
  }
}

export async function testFaucet(account: Address, amount = "1") {
  // const ethBalance = await balanceOf(account)

  console.log("Admin address", admin.address)
  await admin.sendTransaction({
    to: account,
    value: parseEther(amount),
  }) // ETH

  // WETH
  await admin.sendTransaction({
    to: weth,
    value: parseEther(amount),
  })

  const adminWETH = await balanceOf(admin.address as Address, weth)
  console.log("WETH balance", adminWETH)
  await Token__factory.connect(weth, admin).transfer(
    account,
    parseEther(amount)
  )

  // USDT
  const adminUSDT = await balanceOf(admin.address as Address, usdt)
  console.log("USDT balance", adminUSDT)
  await Token__factory.connect(usdt, admin).transfer(
    account,
    parseUnits(amount, 10)
  )

  // Token
  const token = Token__factory.connect(tokenAddr, admin)
  const requiredTok = parseEther("100")
  token.mint(requiredTok)
  const adminToken = await balanceOf(admin.address as Address, tokenAddr)
  console.log("Token balance", adminToken)
  token.transfer(account, requiredTok)
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

export async function testDeposit(amount = "1") {
  const WethPaymaster = WETHPaymaster__factory.connect(wethPaymaster, admin)
  await WethPaymaster.deposit({ value: parseEther(amount) })
  console.log("WETH Paymaster deposited", parseEther(amount))
}

const TOKEN_ADDRESS_MAP = {
  [Currency.usdt]: usdt,
  [Currency.weth]: weth,
  [Currency.token]: tokenAddr,
}

export const transfer = async (
  currency: Currency,
  target: Address,
  amount: string,
  aaProvider: ERC4337EthersProvider
) => {
  switch (currency) {
    case Currency.ether: {
      await aaProvider.getSigner().sendTransaction({
        to: target,
        value: parseEther(amount),
      })
      break
    }
    case Currency.weth:
    case Currency.usdt:
    case Currency.token: {
      const tokenAddress = TOKEN_ADDRESS_MAP[currency]
      const tokenContract = Token__factory.connect(tokenAddress, aaProvider)
      const decimals = await tokenContract.decimals()
      const data = Token__factory.createInterface().encodeFunctionData(
        "transfer",
        [target, parseUnits(amount, decimals)]
      )
      await aaProvider.getSigner().sendTransaction({
        data,
        to: tokenAddress,
      })
      break
    }
    default: {
      throw new Error("Unknown token")
    }
  }
}
