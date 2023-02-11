import { CONFIG } from "@/config"
import Head from "next/head"
import { Inter } from "@next/font/google"
import { useEffect, useState } from "react"
import { SimpleAccountAPI } from "@aa-lib/sdk"
import { Wallet, getDefaultProvider } from "ethers"
import cx from "clsx"

import VortexButton from "@/components/VortexButton"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const [account, setAccount] = useState<SimpleAccountAPI>()
  const [hasDeployed, setHasDeployed] = useState(false)
  const [address, setAddress] = useState<string>()

  useEffect(() => {
    const { mnemonic, providerUrl, entryPoint, accountFactory } = CONFIG
    const provider = getDefaultProvider(providerUrl)
    const owner = Wallet.fromMnemonic(mnemonic).connect(provider)

    const account = new SimpleAccountAPI({
      owner,
      provider,
      entryPointAddress: entryPoint,
      factoryAddress: accountFactory,
    })
    ;(async () => {
      const address = await account.getCounterFactualAddress()
      const isPhantom = await account.checkAccountPhantom()
      setAccount(account)
      setAddress(address)
      setHasDeployed(!isPhantom)
    })()
  }, [])

  const [rotate, setRotate] = useState(false)

  return (
    <>
      <Head>
        <title>AA Lib Demo</title>
        <meta name="description" content="aa lib example" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={cx("p-24 min-h-screen text-xl")}>
        <div className="space-y-6">
          <h1
            className={cx(
              "text-5xl font-extrabold capitalize",
              inter.className,
            )}
          >
            AA Lib demo
          </h1>

          <div className="space-y-1">
            <h2
              className={cx(
                "text-3xl font-extrabold capitalize",
                inter.className,
              )}
            >
              Account State
            </h2>

            <div className="flex items-center gap-2">
              <strong>Deployed:</strong> {hasDeployed.toString()}
            </div>
            <div>
              <strong>Account address:</strong> {address}
            </div>
            <div className="flex items-center gap-3">
              <strong className="capitalize text-orange-700">
                activate account by take this pill &#8594;
              </strong>
              {/* <button className="capitalize inline-flex items-center rounded-full border border-transparent bg-red-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                &nbsp;
              </button>

              <Vortex /> */}
              <VortexButton rotate={rotate} onClick={() => setRotate(v => !v)} />
            </div>
          </div>
          {/* Balances */}
          {/* Demonstrate sponsor and transfer using swc api */}
          <div className="space-y-1">
            <h2 className={cx("text-3xl font-extrabold", inter.className)}>
              Balances
            </h2>
            <div>
              <strong>ETH: </strong>
              <span>{"x"}</span>
            </div>
            <div>
              <strong>USDC: </strong>
              <span>{"x"}</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
