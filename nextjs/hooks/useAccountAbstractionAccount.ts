import { useEffect, useState } from "react"
import { Wallet } from "ethers"
import { ERC4337EthersProvider } from "@aa-lib/sdk"
import useEvent from "react-use-event-hook"
import { Address } from "wagmi"
import { getAAProvider, getUserBalances } from "@/lib/helper"
import { Balances, PaymasterMode } from "@/lib/type"

const aaOwner = Wallet.createRandom()

export const useAccountAbstractionAccount = (
  paymasterMode = PaymasterMode.none,
) => {
  const [eoaSigner, setEoaSigner] = useState<Wallet>(aaOwner)
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
    if (!address) {
      return
    }

    try {
      setIsActivatingAccount(true)
      await aaProvider!.getSigner().sendTransaction({
        to: address,
        data: "0x",
        value: 0,
        gasLimit: 100000,
      })
      await updateCurrUserBalances()
      setHasDeployed(true)
    } catch (e) {
      setIsActivatingAccount(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      const aaProvider = await getAAProvider(paymasterMode, eoaSigner)
      setAAProvider(aaProvider)

      const address = (await aaProvider.getSenderAccountAddress()) as Address
      setAddress(address)

      const isPhantom = await aaProvider.smartAccountAPI.checkAccountPhantom()
      setHasDeployed(!isPhantom)

      await updateCurrUserBalances()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymasterMode, eoaSigner])

  return {
    address,
    balances,
    hasDeployed,
    isActivatingAccount,
    eoaSigner,
    aaProvider,
    activateAccount,
    updateCurrUserBalances,
  }
}
