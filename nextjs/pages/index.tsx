import Head from "next/head"
import { useState } from "react"
import cx from "clsx"

import { inter } from "@/lib/css"
import { PaymasterMode } from "@/lib/type"
import { UserAccount } from "@/components/UserAccount"
import { PaymasterSetting } from "@/components/PaymasterSetting"
import { PaymasterInfo } from "@/components/PaymasterInfo"

export default function Home() {
  const [paymasterMode, setPaymasterMode] = useState<PaymasterMode>(
    PaymasterMode.none,
  )

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

          <UserAccount paymasterMode={paymasterMode} />
          <PaymasterSetting
            paymasterMode={paymasterMode}
            handlePaymasterChange={(p) => setPaymasterMode(p)}
          />
          <PaymasterInfo />
        </div>
      </main>
    </>
  )
}
