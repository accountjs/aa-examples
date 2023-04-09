import { useRecoverAccount } from "@/hooks/useRecoverAccount"
import {
  Button,
  Divider,
  Grid,
  Input,
  Page,
  Text,
  useToasts,
} from "@geist-ui/core"
import { ArrowLeft } from "@geist-ui/icons"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import useEvent from "react-use-event-hook"
import { RecoverData } from "./api/recover"

const NewOwner = () => {
  const { query } = useRouter()
  const { address } = query as { address?: string }
  console.log("🚀 ~ file: new_owner.tsx:22 ~ NewOwner ~ address:", address)
  const { newOwner, oldOwner } = useRecoverAccount(address)
  const [recoverKey, setRecoverKey] = useState<string>()
  const [isRecovering, setIsRecovering] = useState(false)
  const { setToast } = useToasts()

  const handleRecover = useEvent(async () => {
    console.log(
      "🚀 ~ file: new_owner.tsx:29 ~ handleRecover ~ recoverKey:",
      recoverKey
    )
    if (!oldOwner || !address || !newOwner || !recoverKey) {
      return
    }

    const data: RecoverData = {
      oldOwner,
      account: address,
      newOwner,
      privateKey: recoverKey,
    }

    try {
      setIsRecovering(true)
      const response = await fetch("/api/recover", {
        method: "post",
        body: JSON.stringify(data),
      })
      const json = await response.json()
      if (response.status !== 200) {
        throw json.error.message
      }
      setToast({
        text: `Vote recover with ${address} success`,
        type: "success",
      })
    } catch (errorMsg) {
      console.log(
        "🚀 ~ file: new_owner.tsx:59 ~ handleRecover ~ errorMsg:",
        errorMsg
      )
      if (typeof errorMsg === "string") {
        setToast({ text: errorMsg as string, type: "error" })
      }
    }
    setIsRecovering(false)
  })

  // Wait untail new eoa address generated and have a given recover address
  if (!address || !newOwner) {
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
              <Text p>{newOwner}</Text>
            </Grid>
          </Grid.Container>
          <Divider mt={4} mb={2} />
          <Grid.Container gap={2}>
            <Grid xs={6} height="80px">
              <Text h5>Recovery Key:</Text>
            </Grid>
            <Grid xs={18} justify="flex-start" height="80px">
              <Input
                width="100%"
                placeholder="recover key"
                onChange={(ev) => setRecoverKey(ev.target.value)}
              />
            </Grid>
          </Grid.Container>
          <Grid.Container gap={2}>
            <Grid xs={24} justify="center">
              <Button
                shadow
                type="secondary-light"
                w="100%"
                onClick={handleRecover}
                loading={isRecovering}
              >
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
