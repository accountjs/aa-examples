import { useRecoverAccount } from "@/hooks/useRecoverAccount"
import { getErrorReason, RecursiveError } from "@/lib/utils"
import {
  Button,
  Divider,
  Dot,
  Grid,
  Input,
  Page,
  Text,
  Tooltip,
  useToasts,
} from "@geist-ui/core"
import { ArrowLeft } from "@geist-ui/icons"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import useEvent from "react-use-event-hook"
// @ts-expect-error there is no typing for circomlibjs yet
import { eddsa } from "circomlibjs"
import cx from "clsx"
import { RecoverData } from "./api/recover"

const NewOwner = () => {
  const { query } = useRouter()
  const { address } = query as { address?: string }
  const { newOwner, oldOwner, guardians } = useRecoverAccount(address)
  const [recoverKey, setRecoverKey] = useState<string>()
  const [isRecovering, setIsRecovering] = useState(false)
  const [recoveredGuardians, setRecoveredGuardians] = useState<string[]>([])
  const { setToast } = useToasts()

  const handleRecover = useEvent(async () => {
    if (!oldOwner || !address || !newOwner || !recoverKey) {
      return
    }

    const guard = eddsa.prv2pub(recoverKey)[0].toString()

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
        throw json.error
      }
      setRecoveredGuardians((xs) => [...new Set([...xs, guard])])
      setToast({
        text: `${guard} vote recover with ${address} success`,
        type: "success",
      })
    } catch (e) {
      const error = e as RecursiveError
      console.log("🚀 ~ file: new_owner.tsx:63 ~ handleRecover ~ error:", error)
      const reason = getErrorReason(error)
      if (typeof reason === "string") {
        setToast({ text: reason as string, type: "error" })
      }
    }
    setIsRecovering(false)
  })

  const hasMeetRecoverMeetThreshold = recoveredGuardians.length >= 2

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
                New Owner:
              </Text>
            </Grid>
            <Grid xs={18} justify="flex-start" height="50px">
              <Text p>{newOwner}</Text>
            </Grid>

            <Grid xs={6} mt={1}>
              <Text h5>Your Guardians:</Text>
            </Grid>
            {!!guardians?.length && (
              <Grid xs={18} mt={1}>
                <div className="flex flex-col gap-2 w-full">
                  {guardians.map((guard) => {
                    const hasRecovered = recoveredGuardians.find(
                      (x) => x === guard
                    )

                    return (
                      <div className="flex gap-2" key={guard}>
                        <Tooltip
                          text={hasRecovered ? "Recoverd" : "Wait for Recover"}
                          type={hasRecovered ? "success" : "default"}
                        >
                          <Dot
                            margin={0}
                            key={guard}
                            type={hasRecovered ? "success" : "default"}
                          />
                        </Tooltip>

                        <span
                          className={cx(
                            "w-full overflow-hidden whitespace-nowrap text-ellipsis text-gray-500",
                            hasRecovered && "text-black"
                          )}
                        >
                          {guard}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </Grid>
            )}
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
                <Button
                  shadow
                  type="secondary-light"
                  w="100%"
                  disabled={!hasMeetRecoverMeetThreshold}
                >
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
