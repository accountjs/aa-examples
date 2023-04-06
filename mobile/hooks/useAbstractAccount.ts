import { Wallet } from "ethers"
import { Address } from "wagmi"
import { unstable_batchedUpdates } from "react-dom"
import { ERC4337EthersProvider } from "@account-abstraction/sdk"
import { useLocalStorage } from "./useLocalStorage"
import { useEffect, useState } from "react"
import { usePaymaster } from "./usePaymaster"
import { getAAProvider } from "@/lib/helper"
import { log } from "console"

const randomWallet = () => Wallet.createRandom()

const initialPrivateKey = randomWallet().privateKey
const zeroAddress = "0x"

export const useAbstractAccount = () => {
  const [privateKey, setPrivateKey] = useLocalStorage<string>(
    "__PRIVATE_KEY__",
    initialPrivateKey
  )

  const [hasPrvKey, setHasPrvKey] = useLocalStorage<boolean>(
    "__HAS_PRIVATE__",
    false
  )

  // const [accAddress, setAccAddress] = useLocalStorage<Address>(
  //   "__ABSTRACT_ACC__",
  //   zeroAddress
  // )
  const [aaProvider, setAAProvider] = useState<ERC4337EthersProvider>()
  const [eoaAddress, setEoaAddress] = useState<Address>()
  const [accAddress, setAccAddress] = useState<Address>()
  const [hasDeployed, setHasDeployed] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  
  const generatePrvKey = () => {
    setPrivateKey(randomWallet().privateKey)
    setHasPrvKey(true)
  }

  // Activate account
  const activateAccount = async () => {
    if (!accAddress || !aaProvider) {
      return
    }

    try {
      setIsActivating(true)
      const tx = await aaProvider.getSigner().sendTransaction({
        to: accAddress,
        value: 0,
        gasLimit: 1e5,
      })
      await tx.wait()
      setHasDeployed(true)
    } catch (e) {
      // const error = parseExpectedGas(e as Error)
      console.log(e)
    }
    setIsActivating(false)
  }

  // when privateKey 
  useEffect(() => {
    if (!privateKey) {
      return
    }
    console.log("update privatekey" , privateKey);
    
    ;(async () => {
      const ownerWallet = new Wallet(privateKey)
      const newAAProvider = await getAAProvider(ownerWallet)
      const isPhantom = await newAAProvider.smartAccountAPI.checkAccountPhantom()
      const newAddress = await newAAProvider.getSenderAccountAddress()

      unstable_batchedUpdates(() => {
        setEoaAddress(ownerWallet.address as Address)
        setAAProvider(newAAProvider)
        setHasDeployed(!isPhantom)
        setAccAddress(newAddress as Address)
      })
    })()
  }, [privateKey])
  
  return {
    hasPrvKey,
    eoaAddress,
    accAddress,
    hasDeployed,
    isActivating,
    aaProvider,
    // Methods
    setAccAddress,
    generatePrvKey,
    activateAccount,
  }
}
