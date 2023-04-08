import { Button, Divider, Grid, Input, Page, Text } from "@geist-ui/core"
import { ArrowLeft } from "@geist-ui/icons"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

const NewOwner = () => {
  const { query } = useRouter()
  const { address } = query

  if (!address) {
    return null
  }

  return (
    <>
      <Head>
        <title>New Owner - Accountjs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Page.Header pt={1} pl={2}>
          <Grid.Container gap={2}>
            <Grid xs={2} justify="flex-start" height="50px" pt={1}>
              <Link href="/recovery">
                <ArrowLeft />
              </Link>
            </Grid>
            <Grid xs={4} justify="flex-start">
              <Text h3>Recovery</Text>
            </Grid>
          </Grid.Container>
        </Page.Header>

        <Page.Content px={2}>
          <Grid.Container gap={2}>
            <Grid xs={6} height="50px">
              <Text p b>
                Account:
              </Text>
            </Grid>
            <Grid xs={18} justify="flex-start" height="50px">
              <Text p>{address}</Text>
            </Grid>
            <Grid xs={6} height="50px">
              <Text p b>
                NewOwner:
              </Text>
            </Grid>
            <Grid xs={18} justify="flex-start" height="50px">
              <Text p>0x1234...abcd</Text>
            </Grid>
          </Grid.Container>
          <Divider mt={4} mb={2} />
          <Grid.Container gap={2}>
            <Grid xs={6} height="80px">
              <Text h5>Recovery Key:</Text>
            </Grid>
            <Grid xs={18} justify="flex-start" height="80px">
              <Input width="100%" placeholder="recover key" />
            </Grid>
          </Grid.Container>
          <Grid.Container gap={2}>
            <Grid xs={24} justify="center">
              <Button shadow type="secondary-light" w="100%">
                Recover
              </Button>
            </Grid>

            <Grid xs={24} justify="center">
              <Link href="/" className="w-full">
                <Button shadow type="secondary-light" w="100%">
                  Go Wallet
                </Button>
              </Link>
            </Grid>
          </Grid.Container>
        </Page.Content>
      </Page>
    </>
  )
}

export default NewOwner
