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
  const [privateKey, setPrivateKey] = useLocalStorage<string>("__PRIVATE_KEY__")
  const [accountAddress, setAccountAddress] = useLocalStorage<string>(
    "__ACCOUNT_ADDRESS__",
    recoverAddress
  )

  useEffect(() => {
    setPrivateKey(randomWallet().privateKey)
  }, [setPrivateKey])

  useEffect(() => {
    if (accountAddress !== recoverAddress) {
      setAccountAddress(recoverAddress)
    }
  }, [accountAddress, recoverAddress, setAccountAddress])

  const [aaProvider, setAAProvider] = useState<ERC4337EthersProvider>()
  const [oldOwner, setOldOwner] = useState<Address>()
  const [newOwner, setNewOwner] = useState<Address>()
  const [guardians, setGuardians] = useState<string[]>()

  // when privateKey
  useEffect(() => {
    if (!privateKey || !recoverAddress) {
      return
    }

    ;(async () => {
      try {
        const ownerWallet = new Wallet(privateKey)
        const newAAProvider = await getAAProvider(
          ownerWallet,
          PaymasterMode.none,
          recoverAddress
        )
        const oldAccountOwner = await PrivateRecoveryAccount__factory.connect(
          recoverAddress,
          newAAProvider
        ).owner()
        const guardians = await PrivateRecoveryAccount__factory.connect(
          recoverAddress,
          newAAProvider
        )
          .getGuardians()
          .then((xs) => xs.map((x) => x.toString()))

        unstable_batchedUpdates(() => {
          setNewOwner(ownerWallet.address as Address)
          setAAProvider(newAAProvider)
          setOldOwner(oldAccountOwner as Address)
          setGuardians(guardians)
        })
      } catch {
        // recover address don't exist
      }
    })()
  }, [privateKey, recoverAddress])

  return {
    newOwner,
    oldOwner,
    aaProvider,
    guardians,
  }
}
