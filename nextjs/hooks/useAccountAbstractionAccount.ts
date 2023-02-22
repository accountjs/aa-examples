import { useEffect, useState } from "react"
import { unstable_batchedUpdates } from "react-dom"
import { Wallet } from "ethers"
import useEvent from "react-use-event-hook"
import { Address } from "wagmi"
import { ERC4337EthersProvider } from "@aa-lib/sdk"
import { getAAProvider, getUserBalances, parseExpectedGas } from "@/lib/helper"
import { Balances, PaymasterMode } from "@/lib/type"
import { useLocalStorage } from "./useLocalStorage"

const generateNewOwner = () => Wallet.createRandom()
// TODO: Consider use user encrypted json file
const initialPrivateKey = generateNewOwner().privateKey

export const useAccountAbstractionAccount = (
  paymasterMode = PaymasterMode.none,
) => {
  const [privateKey, setPrivateKey] = useLocalStorage<string>(
    "__AA_LIB_PRIVATE_KEY_FOR_DEMO_ONLY",
    initialPrivateKey,
  )
  const [balances, setBalances] = useState<Balances>()
  const [address, setAddress] = useState<Address>()
  const [hasDeployed, setHasDeployed] = useState(false)
  const [isActivatingAccount, setIsActivatingAccount] = useState(false)
  const [aaProvider, setAAProvider] = useState<ERC4337EthersProvider>()

  const updateCurrUserBalances = useEvent(async () => {
    if (!address) {
      return
    }
    const balances = await getUserBalances(address)
    setBalances(balances)
  })

  // Activate account
  const activateAccount = async () => {
    if (!address || !aaProvider) {
      return
    }

    try {
      setIsActivatingAccount(true)
      await aaProvider.getSigner().sendTransaction({
        to: address,
        value: 0,
        gasLimit: 100000,
      })
      await updateCurrUserBalances()
      setHasDeployed(true)
    } catch (e) {
      const error = parseExpectedGas(e as Error)
      console.log(error)
      // We can get error from transaction
    }
    setIsActivatingAccount(false)
  }

  const generateNewAccount = () => {
    setPrivateKey(generateNewOwner().privateKey)
  }

  // Update balances on address changed
  useEffect(() => {
    ;(async () => {
      await updateCurrUserBalances()
    })()
  }, [updateCurrUserBalances, address])

  useEffect(() => {
    if (!privateKey) {
      return
    }

    ;(async () => {
      const ownerWallet = new Wallet(privateKey)
      const newAAProvider = await getAAProvider(paymasterMode, ownerWallet)
      const newAddress =
        (await newAAProvider.getSenderAccountAddress()) as Address
      const isPhantom =
        await newAAProvider.smartAccountAPI.checkAccountPhantom()

      unstable_batchedUpdates(() => {
        setAddress(newAddress)
        setAAProvider(newAAProvider)
        setHasDeployed(!isPhantom)
      })
    })()
  }, [paymasterMode, privateKey, updateCurrUserBalances])

  return {
    address,
    balances,
    hasDeployed,
    isActivatingAccount,
    aaProvider,
    // Methods
    generateNewAccount,
    activateAccount,
    updateCurrUserBalances,
  }
}
