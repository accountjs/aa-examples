import {
  Avatar,
  Button,
  Grid,
  Divider,
  Page,
  Text
} from "@geist-ui/core"
import { Settings, Copy } from "@geist-ui/icons"
import Head from "next/head"
import Link from "next/link"

const Home = () => {
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Page.Header pt={2} px={2}>
          <Grid.Container gap={2}>
            <Grid xs={12} justify="flex-start">
              <Avatar text="0x"></Avatar>
              <Text h5 pl={1}>0x1234...abcd</Text>
            </Grid>

            <Grid xs={12} justify="flex-end">
              <Settings />
            </Grid>
          </Grid.Container>
        </Page.Header>

        <Page.Content px={2} >
          <Grid.Container gap={2}>
          <Grid xs={24} justify="center" height="80px">
            <Text p>ETH</Text>
          </Grid>
          <Grid xs={24} justify="center" height="150px">
            <Text h1>$123</Text>
          </Grid>
          <Grid xs={24} justify="center" height="50px">
            <Text h5 pr={2}>0xacc...ount</Text><Copy  />
          </Grid>
          
          <Grid xs={24} justify="center" height="80px">
              <Button shadow type="secondary-light" w="80%"> Activate Account </Button>
          </Grid>
          
          </Grid.Container>
          
          <Grid.Container gap={2}>
            <Grid xs={24} justify="center" height="30px">
              <Divider>ASSETS</Divider>
            </Grid>
            <Grid xs={24} justify="space-around" height="50px">
              <Text h4>ETH</Text>  <Text h4>3</Text> 
            </Grid>
            <Grid xs={24} justify="center" height="20px">
              <Divider />
            </Grid>
            <Grid xs={24} justify="space-around" height="50px">
              <Text h4>USDT</Text>  <Text h4>100</Text> 
            </Grid>
          </Grid.Container>
          
          
          
        </Page.Content>
      </Page>
    </>
  )
}

export default Home
