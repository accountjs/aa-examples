import { Address } from "wagmi"
import useEvent from "react-use-event-hook"
import { CURRENCY_TO_ADDRESS, Currency } from "@/lib/type"
import { transfer } from "@/lib/utils"
import { ERC4337EthersProvider } from "@accountjs/sdk";

export const useTransfer = (provider?: ERC4337EthersProvider) => {
  return useEvent((currency: Currency, target: Address, amount: string) => {
    if (!provider) {
      return
    }
    const token = CURRENCY_TO_ADDRESS[currency]
    return transfer(target, amount, provider, token)
  })
}