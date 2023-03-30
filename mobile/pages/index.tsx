import Head from "next/head"
import {
  Page,
  Text,
  Image,
  Display,
  Button,
  Grid,
  Spacer,
} from "@geist-ui/core"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Head>
        <title>AA Wallet with AccountJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Display
          title="Geist UI"
          caption={
            <>
              Example repository of{" "}
              <Text span b>
                Account.js
              </Text>{" "}
            </>
          }
        >
          <Image
            src="/geist-banner.png"
            alt="geist ui banner"
            draggable={false}
          />
        </Display>
        <Grid.Container justify="center" gap={2} mt="100px">
          <Grid xs={20} sm={7} justify="center">
            <Link href="/create" className="w-full">
              <Button shadow type="secondary-light" w="100%">
                Create
              </Button>
              <Spacer inline w={0.35} />
            </Link>
          </Grid>
          <Grid xs={20} sm={7} justify="center">
            <Button width="100%">Recover</Button>
          </Grid>

          <Grid xs={20} sm={20}>
            <Link href="/app" className="w-full">
              <Button shadow type="secondary-light" w="100%">
                Enter
              </Button>
            </Link>
          </Grid>
        </Grid.Container>
      </Page>
    </>
  )
}
