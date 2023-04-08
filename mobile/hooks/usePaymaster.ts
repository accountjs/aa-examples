import { PAYMASTER_TO_ADDRESS, PaymasterMode } from "../lib/type"
import { useEffect, useState } from "react"
import { useLocalStorage } from "./useLocalStorage"


export const usePaymaster = () => {
  const [paymasterMode, setPaymasterMode] = useLocalStorage<PaymasterMode>(
    "__PAYMASTER_MODE__",
    PaymasterMode.none,
  )


  return {
    paymasterAddress: PAYMASTER_TO_ADDRESS[paymasterMode!],
    paymasterMode,
    setPaymasterMode,
  }
}