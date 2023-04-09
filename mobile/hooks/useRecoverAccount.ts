import { Wallet } from "ethers"
import { useEffect, useState } from "react"
import { unstable_batchedUpdates } from "react-dom"
import { Address } from "wagmi"
import { getAAProvider } from "@/lib/helper"
import { PaymasterMode } from "@/lib/type"
import { ERC4337EthersProvider } from "@accountjs/sdk"
import { randomWallet } from "./useAbstractAccount"
import { useLocalStorage } from "./useLocalStorage"
import { PrivateRecoveryAccount__factory } from "@accountjs/contracts"

export const useRecoverAccount = (recoverAddress?: string) => {
  const [privateKey, setPrivateKey] = useLocalStorage<string>("__PRIVATE_KEY__", () => randomWallet().privateKey)
  const [aaProvider, setAAProvider] = useState<ERC4337EthersProvider>()
  const [oldOwner, setOldOwner] = useState<Address>()
  const [newOwner, setNewOwner] = useState<Address>()

  // when privateKey
  useEffect(() => {
    if (!privateKey || !recoverAddress) {
      return
    }

    ;(async () => {
      try {
        const ownerWallet = new Wallet(privateKey)
        const newAAProvider = await getAAProvider(ownerWallet, PaymasterMode.none, recoverAddress)
        const oldAccountOwner = await PrivateRecoveryAccount__factory.connect(recoverAddress, newAAProvider).owner()

        unstable_batchedUpdates(() => {
          setNewOwner(ownerWallet.address as Address)
          setAAProvider(newAAProvider)
          setOldOwner(oldAccountOwner as Address)
        })
      } catch {
        // recover address don't exist
      }
    })()
  }, [privateKey, recoverAddress])

  return {
    newOwner,
    oldOwner,
    aaProvider
  }
}