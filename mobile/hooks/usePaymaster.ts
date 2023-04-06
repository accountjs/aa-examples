import { Address } from "wagmi"
import { PaymasterMode } from "../lib/type"
import { useEffect, useState } from "react"
import { useLocalStorage } from "./useLocalStorage"


export const usePaymaster = () => {
  const [paymasterAddress, setPaymasterAddress] = useLocalStorage<Address>(
    "__PAYMASTER_ADDRESS__",
    "0x",
  )
  const [paymasterMode, setPaymasterMode] = useLocalStorage<PaymasterMode>(
    "__PAYMASTER_MODE__",
    PaymasterMode.none,
  )

  return {
    paymasterAddress,
    paymasterMode,
    setPaymasterAddress,
    setPaymasterMode,
  }
}