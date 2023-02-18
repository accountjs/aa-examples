import { LOCAL_CONFIG } from "@/config"
import { TokenPaymaster__factory } from "@aa-lib/contracts"
import { getDefaultProvider, Wallet } from "ethers"
import { parseEther } from "ethers/lib/utils.js"

const { providerUrl, mnemonic, wethPaymaster } = LOCAL_CONFIG

export const provider = getDefaultProvider(providerUrl)
export const owner = Wallet.fromMnemonic(mnemonic).connect(provider)
export const paymaster = TokenPaymaster__factory.connect(wethPaymaster, owner)

let hasDeposited = false
export const initPaymaster = () => {
  return hasDeposited
    ? null
    : (hasDeposited = true) && paymaster.deposit({ value: parseEther("1") })
}
