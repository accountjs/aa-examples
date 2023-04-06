import Head from "next/head"
import Link from "next/link"
import { Page, Text, Image, Display, Button, Grid } from "@geist-ui/core"
import { useEffect } from "react"
import { useAbstractAccount } from "../hooks/useAbstractAccount"
import { useRouter } from "next/router"

export default function Home() {
  const { hasPrvKey } = useAbstractAccount()
  const router = useRouter()
  
  useEffect (() => {
    if (hasPrvKey) {
      router.push('/home')
    } 
  }, [])

  return (
    <>
      <Head>
        <title>AA zkWallet with AccountJS</title>
        <link rel="icon" href="/Logo.png" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Display
          title="Geist UI"
          caption={
            <>
              Example of{" "}
              <Text span b>
                Account.js
              </Text>{" "}
            </>
          }
        >
          <Image
            src="/LOGO.png"
            alt="Accountjs Logo"
            width="300px"
            draggable={false}
          />
        </Display>
        <Grid.Container justify="center" gap={2} mt="100px">
          <Grid xs={20} sm={20} justify="center">
            <Link href="/recover" className="w-full">
              <Button w="100%">Recover</Button>
            </Link>
          </Grid>

          <Grid xs={20} sm={20} justify="center">
            <Link href="/home" className="w-full">
              <Button shadow type="secondary-light" w="100%">
                Create
              </Button>
            </Link>
          </Grid>
        </Grid.Container>
      </Page>
    </>
  )
}
