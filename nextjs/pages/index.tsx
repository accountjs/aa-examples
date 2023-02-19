import { LOCAL_CONFIG } from "@/config"
import Head from "next/head"
import { Inter } from "@next/font/google"
import { useEffect, useMemo, useState } from "react"
import {
  ERC4337EthersProvider,
  ClientConfig,
  TokenPaymasterAPI,
  wrapSimpleProvider,
  wrapPaymasterProvider
} from "@aa-lib/sdk"
import {
  ERC20__factory,
  USDToken__factory,
  WETH__factory,
} from "@aa-lib/contracts"
import { Wallet, getDefaultProvider, BigNumber } from "ethers"
import {
  formatEther,
  getAddress,
  isAddress,
  isValidName,
  keccak256,
  parseEther,
  parseUnits,
  formatUnits
} from "ethers/lib/utils"
import cx from "clsx"
import { Field, Form, Formik, FormikHelpers } from "formik"
import { useEvent } from "react-use-event-hook"

import VortexButton from "@/components/VortexButton"

import { useIsMounted } from "@/hooks/useIsMounted"
import { provider, Currency, FormValues, getAAProvider, PMMode, admin, deposit } from "@/lib/instances"

const inter = Inter({ subsets: ["latin"] })

const {
  usdt,
  weth,
  tokenAddr,
} = LOCAL_CONFIG

type Balance = {
  value: BigNumber
  formatted: string
}

type UserBalances = {
  usdt?: Balance
  weth?: Balance
  ether?: Balance
  token?: Balance
}

async function getBalanceOf(
  of: string,
  tokenAddress?: string,
): Promise<Balance> {
  const isEther = !tokenAddress
  const balance = isEther
    ? await provider.getBalance(of)
    : await ERC20__factory.connect(tokenAddress, provider).balanceOf(of)
  return {
    value: balance,
    formatted: formatEther(balance),
  }
}

export default function Home() {
  const [pmMode, setPmMode] = useState<PMMode>()
  const [signer, setSigner] = useState<Wallet>()
  const [aaProvider, setAAProvider] = useState<ERC4337EthersProvider>()
  const [address, setAddress] = useState<string>()
  const [hasDeployed, setHasDeployed] = useState(false)
  const [balances, setBalances] = useState<UserBalances>()
  const [isActivatingAccount, setIsActivatingAccount] = useState(false)
  const isMounted = useIsMounted()

  const updateCurrUserBalances = useEvent(async () => {
    if (!address) {
      return
    }
    
    const etherBalance = await getBalanceOf(address)
    const wethBalance = await getBalanceOf(address, weth)
    const usdtBalance = await getBalanceOf(address, usdt)
    const tokenBalance = await getBalanceOf(address, tokenAddr)
    setBalances({
      ether: etherBalance,
      weth: wethBalance,
      usdt: usdtBalance,
      token: tokenBalance,
    })
  })

  const restoreOrcreateSinger = () => {
    return Wallet.createRandom()
  }

  const usePaymaster = (pmMode: PMMode) => {
    setPmMode(pmMode)
  }

  const pmDeposit = () => {
    deposit(pmMode, "1")
  }

  useEffect(() => {
      const signer = restoreOrcreateSinger()
      setSigner(signer)
      setPmMode(PMMode.none)
  }, [])


  useEffect(() => {
    ;(async () => {
      console.log('signer', await signer?.getAddress())
      const aaProvider = await getAAProvider(pmMode, signer)
      setAAProvider(aaProvider)
      
      const address = await aaProvider.getSenderAccountAddress()
      setAddress(address)

      const isPhantom = await aaProvider.smartAccountAPI.checkAccountPhantom()
      setHasDeployed(!isPhantom)

      await updateCurrUserBalances()
      console.log('updateCurrUserBalances', balances);
    })()
  }, [pmMode, signer])

  // Activate account
  const activateAccount = async () => {
    if (!address) {
      return
    }

    setIsActivatingAccount(true)

    await aaProvider!.getSigner().sendTransaction({
      to: address,
      data: '0x',
      value: 0,
      gasLimit: 100000
    })
    await updateCurrUserBalances()

    setHasDeployed(true)
  }

  const hasAnyBalances =
    balances &&
    Object.values(balances).some((balance) => !!balance && balance.value.gt(0))

  const faucet = async (token?: Currency) => {
    if (!address || (balances && !Object.values(balances).some((x) => !!x))) {
      throw new Error("There's no address or balances to faucet for")
    }
    const requiredBalance = parseEther('1')
    switch (token) {
      case Currency.ether: {
        const bal = await getBalanceOf(address)
        if (bal.value.lt(requiredBalance)) {
          console.log('funding account to', requiredBalance)
          await admin.sendTransaction({
            to: address,
            value: requiredBalance.sub(bal.value)
          })
        } else {
          console.log('not funding account. balance is enough')
        }
        break
      }
      case Currency.weth: {
        const bal = await getBalanceOf(address, weth)
        if (bal.value.lt(requiredBalance)) {
          console.log('funding account to', requiredBalance)
          await admin.sendTransaction({
            to: weth,
            value: parseEther('1')
          }) // wrap ETH to WETH
          await WETH__factory.connect(weth, admin).transfer(
            address,
            requiredBalance.sub(bal.value)
          )
        } else {
          console.log('not funding account. balance is enough')
        }
        break
      }
      case Currency.usdt: {
        const requiredUSD = parseUnits('50000', 8)
        const bal = await getBalanceOf(address, usdt)
        if (bal.value.lt(requiredUSD)) {
          console.log('funding account to', requiredUSD)
          const usdToken = USDToken__factory.connect(usdt, admin)
          const adminBal = await usdToken.balanceOf(admin.address)
          console.log('admin balance', formatUnits(adminBal, 8));
          
          await usdToken.transfer(
            address,
            requiredUSD.sub(bal.value)
          )
        } else {
          console.log('not funding account. balance is enough')
        }
        break
      }
      case Currency.token: {
        const requiredTok = parseEther('3000')
        const bal = await getBalanceOf(address, tokenAddr)
        if (bal.value.lt(requiredTok)) {
          console.log('funding account to', requiredTok)
          const ERC20Token = ERC20__factory.connect(tokenAddr, admin)
          await ERC20Token.mint(parseEther('100000'))
          await ERC20Token.transfer(
            address,
            requiredTok.sub(bal.value)
          )
        } else {
          console.log('not funding account. balance is enough')
        }
        break
      }
      default: {
        throw new Error("Unknown token")
      }
    }
    updateCurrUserBalances()
  }

  const handleTransfer = async (
    { target, amount, currency }: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    if (!amount) {
      return
    }
    console.log(target, amount, currency);
    
    setSubmitting(true)

    switch (currency) {
      case Currency.ether: {
        await aaProvider!.getSigner().sendTransaction({
          to: target,
          data: '0x',
          value: parseEther(amount),
          gasLimit: 100000
        })
        break
      }
      case Currency.weth: {
        await WETH__factory.connect(weth, aaProvider!.getSigner()).transfer(target, parseEther(amount))
        break
      }
      case Currency.usdt: {
        await USDToken__factory.connect(usdt, aaProvider!.getSigner()).transfer(target, parseEther(amount))
        break
      }
      case Currency.token: {
        await ERC20__factory.connect(tokenAddr, aaProvider!.getSigner()).transfer(target, parseEther(amount))
        break
      }
      default: {
        throw new Error("Unknown token")
      }
    }
    updateCurrUserBalances()
    setSubmitting(false)
  }

  const initialFormValues: FormValues = {
    target: "",
    amount: "0",
    currency: Currency.ether
  }

  return (
    <>
      <Head>
        <title>AA Lib Demo</title>
        <meta name="description" content="aa lib example" />
        <meta property="og:title" content="AA lib example" key="title" />
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
            <div className="capitalize">
              <strong>Account Address:</strong> {address}
            </div>
            {/* Activation */}
            <div
              className={cx(
                isMounted && !hasDeployed ? "flex opacity-100" : "hidden",
                "none items-center gap-3 transition-all duration-300",
              )}
            >
              <strong className="capitalize text-orange-700">
                activate account by take this pill &#8594;
              </strong>
              <VortexButton
                rotate={isActivatingAccount}
                onClick={activateAccount}
              />
            </div>
          </div>
          {/* Balances */}
          {/* Demonstrate sponsor and transfer using swc api */}
          <div className="space-y-1">
            <h2 className={cx("text-3xl font-extrabold", inter.className)}>
              Balances
            </h2>
            <div className="flex gap-4 items-center">
              <strong>ETH: </strong>
              <span>{balances?.ether?.formatted}</span>

              {!!balances?.ether &&
                balances.ether.value.lt(parseEther("0.5")) && (
                  <button
                    className="capitalize inline-flex items-center rounded-md border border-transparent bg-pink-600 px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    onClick={() => faucet(Currency.ether)}
                  >
                    faucet
                  </button>
                )}
            </div>
            <div className="flex gap-4 items-center">
              <strong>WETH: </strong>
              <span>{balances?.weth?.formatted}</span>

              {!!balances?.weth && balances.weth.value.lt(parseEther("0.5")) && (
                <button
                  className="capitalize inline-flex items-center rounded-md border border-transparent bg-pink-600 px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  onClick={() => faucet(Currency.weth)}
                >
                  faucet
                </button>
              )}
            </div>
            <div>
              <strong>USDT: </strong>
              <span>{balances?.usdt?.formatted}</span>

              {!!balances?.usdt && balances.usdt.value.lt(parseEther("500")) && (
                <button
                  className="capitalize inline-flex items-center rounded-md border border-transparent bg-pink-600 px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  onClick={() => faucet(Currency.usdt)}
                >
                  faucet
                </button>
              )}
            </div>
            <div>
              <strong>Token: </strong>
              <span>{balances?.token?.formatted}</span>
              <button
                className="capitalize inline-flex items-center rounded-md border border-transparent bg-pink-600 px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                onClick={() => faucet(Currency.token)}
              >
                faucet
              </button>
            </div>
          </div>

          {hasDeployed && hasAnyBalances && (
            <Formik initialValues={initialFormValues} onSubmit={handleTransfer}>
              {({
                values,
                errors,
                touched,
                isSubmitting,
                isValid,
                /* and other goodies */
              }) => (
                <div>
                  <Form className="mt-2 pb-2">
                    <div className="flex items-end">
                      <div className="flex flex-wrap items-center gap-2 w-full sm:max-w-4xl">
                        <label
                          htmlFor="addressOrName"
                          className="text-base font-semibold text-slate-800"
                        >
                          Transfer to
                        </label>
                        <div className="relative">
                          <Field
                            as="input"
                            type="text"
                            name="target"
                            id="target"
                            className={cx(
                              "block rounded-md sm:text-sm w-auto",
                              errors.target
                                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
                                : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
                            )}
                            placeholder="0x..."
                          />
                          <div className="absolute top-11 left-1 text-sm text-red-600">
                            <p>
                              {errors.target &&
                                touched.target &&
                                errors.target}
                            </p>
                          </div>
                        </div>

                        <label
                          htmlFor="amount"
                          className="text-base font-semibold text-slate-800"
                        >
                          with
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <Field
                            as="input"
                            type="text"
                            name="amount"
                            id="amount"
                            className={cx(
                              "block rounded-md sm:text-sm w-auto",
                              errors.amount
                                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
                                : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
                            )}
                            placeholder="0.00"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center">
                            <label htmlFor="currency" className="sr-only">
                              Currency
                            </label>
                            <Field
                              id="currency"
                              name="currency"
                              as="select"
                              className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 sm:text-sm"
                            >
                              <option>Ethers</option>
                              <option>WETH</option>
                              <option>USDT</option>
                              <option>TOKEN</option>
                            </Field>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={
                            isSubmitting || !isValid || !values.target
                          }
                          className={cx(
                            "capitalize inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 disabled:bg-gray-400 px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                            "sm:ml-1 sm:w-auto sm:text-sm",
                          )}
                        >
                          transfer
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              )}
            </Formik>

            
          )}
          
          <div className="flex items-end">
          <button
            className="capitalize inline-flex items-center rounded-md border border-transparent bg-blue-600 px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            onClick={() => usePaymaster(PMMode.weth)}
          >
            use wethPaymaster
          </button>
          <button
            className="capitalize inline-flex items-center rounded-md border border-transparent bg-blue-600 px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            onClick={() => usePaymaster(PMMode.usdt)}
          >
            use usdtPaymaster
          </button>
          </div>
          <div className="flex items-end">
          <button
            className="capitalize inline-flex items-center rounded-md border border-transparent bg-blue-600 px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            onClick={() => usePaymaster(PMMode.gasless)}
          >
            use gaslessPaymaster
          </button>
          <button
            className="capitalize inline-flex items-center rounded-md border border-transparent bg-blue-600 px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            onClick={() => usePaymaster(PMMode.token)}
          >
            use tokenPaymaster
          </button>
          
          </div>
          <button
            className="capitalize items-center rounded-md border border-transparent bg-blue-600 px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            onClick={() => pmDeposit()}
          >
            deposit 1 ether
          </button>
        </div>
      </main>
    </>
  )
}
