import { LOCAL_CONFIG } from "@/config"
import { getDefaultProvider, Wallet } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers"

const { mnemonic, providerUrl } = LOCAL_CONFIG

export const provider = getDefaultProvider(providerUrl) as JsonRpcProvider
export const admin = Wallet.fromMnemonic(mnemonic).connect(provider)
