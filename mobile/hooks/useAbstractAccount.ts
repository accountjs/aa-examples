import { Wallet } from "ethers"
import { Address } from "wagmi"
import { unstable_batchedUpdates } from "react-dom"
import { ERC4337EthersProvider } from "@accountjs/sdk"
import { useEffect, useState } from "react"
import useEvent from "react-use-event-hook"
import { getAAProvider, getUserBalances } from "@/lib/helper"
import { Balances, PAYMASTER_TO_ADDRESS, PaymasterMode, zeroAddress } from "@/lib/type"
import { useLocalStorage } from "./useLocalStorage"

export const randomWallet = () => Wallet.createRandom()

export const useAbstractAccount = () => {
  const [privateKey, setPrivateKey, removePrivateKey] = useLocalStorage<string>("__PRIVATE_KEY__")
  const [paymasterMode, setPaymasterMode] = useLocalStorage<PaymasterMode>("__PAYMASTER_MODE__", PaymasterMode.none)
  const [aaProvider, setAAProvider] = useState<ERC4337EthersProvider>()
  const [eoaAddress, setEoaAddress] = useState<Address>()
  const [accountAddress, setAccountAddress, removeAccountAddress] = useLocalStorage<Address>("__ACCOUNT_ADDRESS__")
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

  const exitAccount = () => {
    removePrivateKey()
    removeAccountAddress()
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
      try {
        const ownerWallet = new Wallet(privateKey)
        const newAAProvider = await getAAProvider(ownerWallet, paymasterMode!, accountAddress)
        const isPhantom = await newAAProvider.smartAccountAPI.checkAccountPhantom()
        const newAddress = await newAAProvider.getSenderAccountAddress()

        unstable_batchedUpdates(() => {
          setEoaAddress(ownerWallet.address as Address)
          setAAProvider(newAAProvider)
          setHasDeployed(!isPhantom)
          setAccountAddress(newAddress as Address)
        })
      } catch (error) {
        console.log("🚀 ~ file: useAbstractAccount.ts:89 ~ ; ~ error:", error)
      }
    })()
  }, [privateKey, paymasterMode, setAccountAddress, accountAddress])

  const handleSetPaymaster = (mode: PaymasterMode) => {
    setPaymasterMode(mode)
    removeAccountAddress()
  }

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
    exitAccount,
    activateAccount,
    updateUserBalances,

    paymasterAddress: PAYMASTER_TO_ADDRESS[paymasterMode!],
    paymasterMode,
    handleSetPaymaster,
  }
}
