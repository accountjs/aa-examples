import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils.js"
import { Address } from "wagmi"
import { Balance, Currency } from "./type"
import { provider, admin } from "./instance"
import {
  Token__factory,
} from "@accountjs/contracts"
import { ERC4337EthersProvider } from "@accountjs/sdk"

const formatDecimals = (value: string, decimals = 2): string => {
  // format without rounding
  const [int, dec] = value.split(".")
  const formatted = `${int}.${dec.slice(0, decimals)}`
  return parseFloat(formatted).toFixed(decimals)
}

export async function balanceOf(
  of: Address,
  tokenAddress?: Address,
): Promise<Balance> {
  if (tokenAddress) {
    const token = await Token__factory.connect(tokenAddress, provider)
    const value = await token.balanceOf(of)
    const symbol = await token.symbol()
    const decimals = await token.decimals()

    // const float = formatUnits(value, decimals)
    // const formatted = parseFloat(float).toFixed(2)

    return {
      value,
      symbol,
      decimals,
      formatted: formatDecimals(formatUnits(value, decimals)),
    }
  }

  const value = await provider.getBalance(of)
  return {
    value,
    symbol: "eth",
    decimals: 18,
    formatted: formatDecimals(formatEther(value)),
  }
}

export const transfer = async (
  target: Address,
  amount: string,
  aaProvider: ERC4337EthersProvider,
  tokenAddress?: Address,
) => {
  if (tokenAddress) {
    const token = await Token__factory.connect(tokenAddress, aaProvider)
    const decimals = await token.decimals()
      const data = Token__factory.createInterface().encodeFunctionData(
        "transfer",
        [target, parseUnits(amount, decimals)],
      )
      await aaProvider.getSigner().sendTransaction({
        data,
        to: tokenAddress,
      })
    } else {
      await aaProvider.getSigner().sendTransaction({
        to: target,
        value: parseEther(amount),
      })
    }
}

export const parseExpectedGas = (e: Error): Error => {
  // parse a custom error generated by the BundlerHelper, which gives a hint of how much payment is missing
  const match = e.message?.match(/paid (\d+) expected (\d+)/)
  if (match != null) {
    const paid = Math.floor(parseInt(match[1]) / 1e9)
    const expected = Math.floor(parseInt(match[2]) / 1e9)
    return new Error(
      `Error: Paid ${paid}, expected ${expected} . Paid ${Math.floor(
        (paid / expected) * 100,
      )}%, missing ${expected - paid} `,
    )
  }
  return e
}