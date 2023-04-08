import { Wallet } from "ethers"
import { Address } from "wagmi"
import { unstable_batchedUpdates } from "react-dom"
import { ERC4337EthersProvider } from "@accountjs/sdk"
import { useEffect, useState } from "react"
import useEvent from "react-use-event-hook"
import { getAAProvider, getUserBalances } from "@/lib/helper"
import { Balances, zeroAddress } from "@/lib/type"
import { useLocalStorage } from "./useLocalStorage"

const randomWallet = () => Wallet.createRandom()

export const useAbstractAccount = () => {
  const [privateKey, setPrivateKey] = useLocalStorage<string>("__PRIVATE_KEY__")
  const [aaProvider, setAAProvider] = useState<ERC4337EthersProvider>()
  const [eoaAddress, setEoaAddress] = useState<Address>()
  const [accountAddress, setAccountAddress] = useState<Address>()
  const [hasDeployed, setHasDeployed] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [balances, setBalances] = useState<Balances>({})

  const updateUserBalances = useEvent(async () => {
    if (!accountAddress || accountAddress === zeroAddress) {
      return
    }

    const balances = await getUserBalances(accountAddress)
    setBalances(balances)
  })

  const generatePrvKey = () => {
    setPrivateKey(randomWallet().privateKey)
  }

  const removePrvKey = () => {
    setPrivateKey(undefined)
  }

  // Activate account
  const activateAccount = async () => {
    if (!accountAddress || !aaProvider) {
      return
    }

    try {
      setIsActivating(true)
      const tx = await aaProvider.getSigner().sendTransaction({
        to: accountAddress,
        value: 0,
        gasLimit: 1e5,
      })
      await tx.wait()
      await updateUserBalances()
      setHasDeployed(true)
    } catch (e) {
      // const error = parseExpectedGas(e as Error)
      console.log(e)
    }
    setIsActivating(false)
  }

  useEffect(() => {
    ;(async () => {
      await updateUserBalances()
    })()
  }, [accountAddress, updateUserBalances])

  // when privateKey
  useEffect(() => {
    if (!privateKey) {
      return
    }

    ;(async () => {
      const ownerWallet = new Wallet(privateKey)
      console.log("ownerWallet", ownerWallet.address)
      
      const newAAProvider = await getAAProvider(ownerWallet)
      const isPhantom =
        await newAAProvider.smartAccountAPI.checkAccountPhantom()
      const newAddress = await newAAProvider.getSenderAccountAddress()

      unstable_batchedUpdates(() => {
        setEoaAddress(ownerWallet.address as Address)
        setAAProvider(newAAProvider)
        setHasDeployed(!isPhantom)
        setAccountAddress(newAddress as Address)
      })
    })()
  }, [privateKey])

  return {
    hasPk: !!privateKey,
    eoaAddress,
    accountAddress,
    hasDeployed,
    isActivating,
    aaProvider,
    balances,
    // Methods
    setAccountAddress,
    generatePrvKey,
    removePrvKey,
    activateAccount,
    updateUserBalances,
  }
}
