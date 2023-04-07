import Head from "next/head"
import Home from "@/components/Home"
import Onboard from "@/components/Onboard"
import { useAbstractAccount } from "../hooks/useAbstractAccount"
import AppLayout from "@/components/AppLayout"

export default function Index() {
  const { hasPk } = useAbstractAccount()
  const component = hasPk ? (
    <AppLayout>
      <Home />
    </AppLayout>
  ) : (
    <Onboard />
  )

  return (
    <>
      <Head>
        <title>Wallet with AccountJS</title>
        <link rel="icon" href="/Logo.png" />
      </Head>
      {component}
    </>
  )
}
