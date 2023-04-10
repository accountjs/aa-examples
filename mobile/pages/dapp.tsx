import { Page, Text, Card, Image, Grid } from "@geist-ui/core"
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

        <Page.Content px={2} pt={1}>
        <Grid.Container px={1} gap={2}>
          <Grid xs={12} justify="center">
            <Card>
              <Image src="https://www.playtoearn.online/wp-content/uploads/2022/01/playtoearn-logo-site-100.png"
                height="150px" width="300px" draggable={false} />
              <Text h4 mb={0}>PlayOnboard</Text>
              <Text type="secondary" small>Play to have your Web3 Wallet</Text>
            </Card>
          </Grid>
          <Grid xs={12} justify="center">
            <Card>
              <Image src="https://www.lucidadvertising.com/wp-content/uploads/2020/06/marketing.jpg"
                height="150px" width="300px" draggable={false} />
              <Text h4 mb={0}>AA Marketing</Text>
              <Text type="secondary" small>Use AA for marketing</Text>
            </Card>
          </Grid>
        </Grid.Container>
        
        </Page.Content>
      </Page>
    </AppLayout>
  )
}

export default Dapp
