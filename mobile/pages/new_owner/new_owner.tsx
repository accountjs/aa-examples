import {
  Button,
  Grid,
  Input,
  Page,
  Text
} from "@geist-ui/core"
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
          <Text h2>
            Recover
          </Text>
        </Page.Header>

        <Page.Content px={2} >
          <Grid.Container gap={2}>
            <Grid xs={9} justify="center" height="50px">
              <Text p b >Account</Text>
            </Grid>
            <Grid xs={15} justify="flex-start" height="50px">
              <Text p>0x1234...abcd</Text>
            </Grid>
            <Grid xs={9} justify="center" height="50px">
              <Text p b>NewOwner: </Text>
            </Grid>
            <Grid xs={15} justify="flex-start" height="50px">
              <Text p>0x1234...abcd</Text>
            </Grid>
            <Grid xs={8} justify="flex-end" height="50px">
              <Text h4>RecKey:</Text>
            </Grid>
            <Grid xs={16} justify="flex-start" height="50px">
              <Input width="100%" placeholder="recover key" />
            </Grid>
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
