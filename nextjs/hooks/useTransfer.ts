import { Address } from "wagmi"
import useEvent from "react-use-event-hook"
import { Currency } from "@/lib/type"
import { transfer } from "@/lib/helper"
import { useAccountAbstractionAccount } from "./useAccountAbstractionAccount"

export const useTransfer = () => {
  const { aaProvider } = useAccountAbstractionAccount()

  return useEvent((currency: Currency, target: Address, amount: string) =>
    transfer(currency, target, amount, aaProvider),
  )
}
