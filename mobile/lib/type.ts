import { BigNumber } from "ethers"

export enum Currency {
    ether = "eth",
    weth = "weth",
    usdt = "usdt",
    token = "token",
  }

export enum PaymasterMode {
    none = "none",
    weth = "weth",
    usdt = "usdt",
    token = "token",
    gasless = "gasless",
}