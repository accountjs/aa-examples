import { BigNumber } from "ethers"
import { LOCAL_CONFIG } from "@/config"

const {
  usdt,
  weth,
  tokenAddr,
  wethPaymaster,
  usdtPaymaster,
  fixedPaymaster,
  gaslessPaymaster
} = LOCAL_CONFIG

export type Balance = {
    symbol: string
    decimals: number
    value: BigNumber
    formatted: string
}

export type Balances = {
    usdt?: Balance
    weth?: Balance
    ether?: Balance
    token?: Balance
  }

export enum Currency {
    ether = "ETH",
    weth = "WETH",
    usdt = "USDT",
    token = "MYTOK",
  }

export enum PaymasterMode {
    none = "none",
    weth = "weth",
    usdt = "usdt",
    token = "token",
    gasless = "gasless",
}

export const zeroAddress = "0x0000000000000000000000000000000000000000"

export const PAYMASTER_TO_ADDRESS = {
    [PaymasterMode.none]: undefined,
    [PaymasterMode.weth]: wethPaymaster,
    [PaymasterMode.usdt]: usdtPaymaster,
    [PaymasterMode.token]: fixedPaymaster,
    [PaymasterMode.gasless]: gaslessPaymaster,
}

export const CURRENCY_TO_ADDRESS = {
  [Currency.ether]: undefined,
  [Currency.weth]: weth,
  [Currency.usdt]: usdt,
  [Currency.token]: tokenAddr,
}