import { Button, Grid, Page, Text } from "@geist-ui/core"
import Head from "next/head"
import Link from "next/link"
import AppLayout from "../components/AppLayout"
import { useAbstractAccount } from "@/hooks/useAbstractAccount"

const Guardian = () => {
  const { accountAddress } =
    useAbstractAccount()

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
            <Grid xs={8} justify="center" height="50px">
              <Text h5 >Account:</Text>
            </Grid>
            <Grid xs={16} justify="flex-start" height="50px">
              <Text h5>0x1234...abcd</Text>
            </Grid>
            <Grid xs={24} justify="center">
                <Button
                  shadow
                  type="secondary-light"
                  w="100%"
                  onClick={initGuaridans}
                >
                  Init Guardians
                </Button>
            </Grid>
          </Grid.Container>
        </Page.Content>
      </Page>
    </AppLayout>
  )
}

export default Guardian
