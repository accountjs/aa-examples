import {
  Button,
  Divider,
  Grid,
  Input,
  Page,
  Text
} from "@geist-ui/core"
import { ArrowLeft } from "@geist-ui/icons"
import Head from "next/head"
import Link from "next/link"

const NewOwner = () => {
  return (
    <>
      <Head>
        <title>New Owner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Page.Header pt={1} pl={2}>
          <Grid.Container gap={2}>
            <Grid xs={2} justify="flex-start" height="50px" pt={1}>
              <Link href="/recover">
                <ArrowLeft />
              </Link>
            </Grid>
            <Grid xs={4} justify="flex-start">
              <Text h3> Recover </Text>
            </Grid>
          </Grid.Container>
        </Page.Header>

        <Page.Content px={2} >
          <Grid.Container gap={2}>
            <Grid xs={10} justify="center" height="50px">
              <Text p b >Account:</Text>
            </Grid>
            <Grid xs={14} justify="flex-start" height="50px">
              <Text p>0x1234...abcd</Text>
            </Grid>
            <Grid xs={10} justify="center" height="50px">
              <Text p b>NewOwner:</Text>
            </Grid>
            <Grid xs={14} justify="flex-start" height="50px">
              <Text p>0x1234...abcd</Text>
            </Grid>
          </Grid.Container>
          <Divider mt={2}/>
          <Grid.Container gap={2}>
            <Grid xs={8} justify="flex-end" height="80px">
              <Text h4>RecKey:</Text>
            </Grid>
            <Grid xs={16} justify="flex-start" height="80px">
              <Input width="100%" placeholder="recover key" />
            </Grid>
          </Grid.Container>
          <Grid.Container gap={2}>
            <Grid xs={24} justify="center">
                <Button shadow type="secondary-light" w="100%"> Recover </Button>
            </Grid>

            <Grid xs={24} justify="center">
              <Link href="/home" className="w-full">
                <Button shadow type="secondary-light" w="100%"> Go Wallet </Button>
              </Link>
            </Grid>
          </Grid.Container>
        </Page.Content>
      </Page>
    </>
  )
}

export default NewOwner
