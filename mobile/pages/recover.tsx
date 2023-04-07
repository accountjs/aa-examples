import {
  Button,
  Grid,
  Input,
  Page,
  Text
} from "@geist-ui/core"
import { ArrowLeft } from "@geist-ui/icons"
import Head from "next/head"
import Link from "next/link"

const Recover = () => {
  return (
    <>
      <Head>
        <title>Recover Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Page.Header pt={1} pl={2}>
        <Grid.Container gap={2}>
            <Grid xs={2} justify="flex-start" height="50px" pt={1}>
              <Link href="/">
                <ArrowLeft />
              </Link>
            </Grid>
            <Grid xs={4} justify="flex-start">
              <Text h3> InitPage </Text>
            </Grid>
          </Grid.Container>
        </Page.Header>

        <Page.Content px={2} >
          <Grid.Container gap={2}>
          <Grid xs={6} justify="flex-end" height="50px">
            <Text h4>Account</Text>
          </Grid>
          <Grid xs={18} justify="flex-start" height="50px">
            <Input width="100%" placeholder="account address" />
          </Grid>
          
          <Grid xs={24} justify="center">
            <Link href="/new_owner" className="w-full">
              <Button shadow type="secondary-light" w="100%"> Start Recover </Button>
            </Link>
          </Grid>
          </Grid.Container>
          
        </Page.Content>
      </Page>
    </>
  )
}

export default Recover