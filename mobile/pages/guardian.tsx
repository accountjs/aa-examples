import { Button, Grid, Page, Text } from "@geist-ui/core"
import Head from "next/head"
import Link from "next/link"
import AppLayout from "../components/AppLayout"

const Guardian = () => {
  const initGuaridans = () => {}

  return (
    <AppLayout>
      <Head>
        <title>Guardian</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Page.Header pt={1} pl={2}>
          <Text h2>Guardian</Text>
        </Page.Header>

        <Page.Content px={2}>
          <Grid.Container gap={2}>
            <Grid xs={24} justify="center">
              <Link href="/new_owner" className="w-full">
                <Button
                  shadow
                  type="secondary-light"
                  w="100%"
                  onClick={initGuaridans}
                >
                  Init your Guardians
                </Button>
              </Link>
            </Grid>
          </Grid.Container>
        </Page.Content>
      </Page>
    </AppLayout>
  )
}

export default Guardian
