import { Page, Text } from "@geist-ui/core"
import Head from "next/head"
import AppLayout from "../components/AppLayout"

const Dapp = () => {
  return (
    <AppLayout>
      <Head>
        <title>AA Dapps</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Page.Header pt={1} pl={2}>
          <Text h2>DAPP</Text>
        </Page.Header>

        <Page.Content px={2}>Coming soon...</Page.Content>
      </Page>
    </AppLayout>
  )
}

export default Dapp
