import {
  Button,
  Grid,
  Input,
  Page,
  Text
} from "@geist-ui/core"
import Head from "next/head"
import Link from "next/link"

const Guardian = () => {
  return (
    <>
      <Head>
        <title>Guardian</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Page.Header pt={1} pl={2}>
          <Text h2>
            Guardian
          </Text>
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
              <Button shadow type="secondary-light" w="100%"> InitGuardian </Button>
            </Link>
          </Grid>
          </Grid.Container>
          
        </Page.Content>
      </Page>
    </>
  )
}

export default Guardian
