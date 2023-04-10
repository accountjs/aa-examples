import Head from "next/head"
import Link from "next/link"
import { Button, Grid, Input, Page, Text } from "@geist-ui/core"
import { useState } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Router, useRouter } from "next/router"

const Recovery = () => {
  const [address, setAddress] = useState<string>()
  const [_, setAccountAddress] = useLocalStorage<string>("__ACCOUNT_ADDRESS__")
  const router = useRouter()
  const handleStartRecover = () => {
    setAccountAddress(address)
    router.push(`/new_owner?address=${address}`)
  }

  return (
    <>
      <Head>
        <title>Recover Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Page.Header pt={1} pl={2}>
          <Grid.Container gap={2}>
            <Grid xs={4} justify="flex-start">
              <Text h3>Recovery</Text>
            </Grid>
          </Grid.Container>
        </Page.Header>

        <Page.Content px={2}>
          <Grid.Container gap={2}>
            <Grid xs={4} alignItems="center" height="50px">
              <Text span>Account</Text>
            </Grid>
            <Grid xs={20} justify="flex-start">
              <Input
                width="100%"
                placeholder="Account Address"
                onChange={(ev) => setAddress(ev.target.value)}
              />
            </Grid>

            <Grid xs={24} justify="center">
              <Button
                shadow
                type="secondary-light"
                w="100%"
                onClick={handleStartRecover}
              >
                Start Recover
              </Button>
            </Grid>
          </Grid.Container>
        </Page.Content>
      </Page>
    </>
  )
}

export default Recovery
