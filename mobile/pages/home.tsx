import { Avatar, Button, Grid, Divider, Page, Text, Tag } from "@geist-ui/core"
import { Settings, Copy } from "@geist-ui/icons"
import Head from "next/head"
import Link from "next/link"
import AppLayout from "../components/AppLayout"
import { useAbstractAccount } from "../hooks/useAbstractAccount"
import { useEffect } from "react"
import { Address } from "wagmi"
import { useRouter } from "next/router"

// trim address as 0x1234...5678
const trimAddress = (address?: string | Address) => {
  if (!address) return "0x"
  return address.slice(0, 6) + "..." + address.slice(-4)
}

const Home = () => {
  
  const {
    hasPrvKey,
    aaProvider,
    eoaAddress,
    accAddress,
    hasDeployed,
    isActivating,
    generatePrvKey,
    activateAccount,
  } = useAbstractAccount()

  useEffect (() => {
    if (!hasPrvKey) {
      generatePrvKey()
    }
  }, [])

  return (
    <AppLayout>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Page.Header pt={2} px={2}>
          <Grid.Container gap={2}>
            <Grid xs={12} justify="flex-start">
              <Link href="/profile">
                <Avatar text="0x"></Avatar>
              </Link>
              <Text h5 pl={1}>
                {trimAddress(eoaAddress)}
              </Text>
            </Grid>

            <Grid xs={12} justify="flex-end">
              <Link href="/setting">
                <Settings />
              </Link>
            </Grid>
          </Grid.Container>
        </Page.Header>

        <Page.Content px={2}>
          <Grid.Container gap={2}>
            <Grid xs={24} justify="center" height="80px">
              <Text p>ETH</Text>
            </Grid>
            <Grid xs={24} justify="center" height="150px">
              <Text h1>$123</Text>
            </Grid>
            <Grid xs={24} justify="center" height="50px">
              <Text h5 pr={2}>
                {trimAddress(accAddress)}
              </Text>
              <Copy />
            </Grid>

            <Grid xs={24} justify="center" height="80px">
              <Button shadow type="secondary-light" w="80%">
                Activate Account
              </Button>
            </Grid>
          </Grid.Container>
          <Divider>ASSETS</Divider>
          <Grid.Container gap={2}>
            <Grid xs={24} justify="space-around" height="50px">
              <Text h4>ETH</Text>
              <Text h4>3</Text>
            </Grid>
          </Grid.Container>
          <Divider />
          <Grid.Container gap={2}>
            <Grid xs={24} justify="space-around" height="50px">
              <Text h4>USDT</Text>
              <Text h4>100</Text>
            </Grid>
          </Grid.Container>
          <Divider />
          <Grid.Container>
            <Grid xs={24} justify="center" height="80px">
              <Tag type="error" invert>
                More
              </Tag>
            </Grid>
          </Grid.Container>
        </Page.Content>
      </Page>
    </AppLayout>
  )
}

export default Home
