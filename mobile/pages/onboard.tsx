import { useAbstractAccount } from "@/hooks/useAbstractAccount"
import { testDeposit, testFaucet } from "@/lib/helper"
import { PaymasterMode } from "@/lib/type"
import { Button, Select, Grid, Page, Text } from "@geist-ui/core"
import { ArrowLeft } from "@geist-ui/icons"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

const Setting = () => {
  const {
    hasDeployed,
    accountAddress,
    exitAccount,
    paymasterAddress,
    paymasterMode,
    handleSetPaymaster,
  } = useAbstractAccount()
  const router = useRouter()

  function initPmMode(): string {
    switch (paymasterMode) {
      case PaymasterMode.weth:
        return "1"
      case PaymasterMode.usdt:
        return "2"
      case PaymasterMode.token:
        return "3"
      case PaymasterMode.gasless:
        return "4"
      default:
        return "0"
    }
  }

  const handlePmModeChange = (val: any) => {
    switch (val as string) {
      case "1":
        handleSetPaymaster(PaymasterMode.weth)
        break
      case "2":
        handleSetPaymaster(PaymasterMode.usdt)
        break
      case "3":
        handleSetPaymaster(PaymasterMode.token)
        break
      case "4":
        handleSetPaymaster(PaymasterMode.gasless)
        break
      default:
        handleSetPaymaster(PaymasterMode.none)
        break
    }
    console.log(paymasterAddress)
  }

  const onClickDeposit = async () => {
    await testDeposit()
  }

  const onClickFaucet = async () => {
    if (!accountAddress) return
    await testFaucet(accountAddress)
  }

  const onClickExit = async () => {
    exitAccount()
    router.push("/")
  }

  return (
    <>
      <Head>
        <title>Setting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Page.Header pt={1} pl={2}>
          <Grid.Container gap={2}>
            <Grid xs={2} justify="flex-start" height="50px" pt={1}>
              <Link href="/">
                <ArrowLeft />
              </Link>
            </Grid>
            <Grid xs={4} justify="flex-start">
              <Text h3> Setting </Text>
            </Grid>
          </Grid.Container>
        </Page.Header>

        <Page.Content px={2} py={1}>
          <Grid.Container gap={2}>
            {/* <Grid xs={8} justify="flex-end" height="50px">
              <Text h4>Network</Text>
            </Grid>
            <Grid xs={16} justify="flex-start" height="50px">
              <Select placeholder="Localnet" type="default" width="100%">
                <Select.Option value="1">Localnet</Select.Option>
                <Select.Option value="2">Gorlinet</Select.Option>
              </Select>
            </Grid>

            <Grid xs={8} justify="flex-end" height="50px">
              <Text h4>Bundler</Text>
            </Grid>
            <Grid xs={16} justify="flex-start" height="50px">
              <Input width="100%" placeholder="Bundler url" />
            </Grid>
            */}

            {!hasDeployed && (
              <>
                <Grid xs={8} justify="flex-end" height="50px">
                  <Text h4>Paymaster</Text>
                </Grid>
                <Grid xs={16} justify="flex-start" height="50px">
                  <Select
                    initialValue={initPmMode()}
                    type="default"
                    width="100%"
                    onChange={handlePmModeChange}
                  >
                    <Select.Option value="0">NoPaymaster</Select.Option>
                    <Select.Option value="1">WETHPaymaster</Select.Option>
                    <Select.Option value="2">USDTPaymaster</Select.Option>
                    <Select.Option value="3">TokenPaymaster</Select.Option>
                    <Select.Option value="4">VerifyingPaymaster</Select.Option>
                  </Select>
                </Grid>

                <Grid xs={24} justify="center">
                  <Button
                    shadow
                    type="warning"
                    w="100%"
                    onClick={onClickDeposit}
                  >
                    PM deposit
                  </Button>
                </Grid>

                <Grid xs={24} justify="center">
                  <Button
                    shadow
                    type="warning"
                    w="100%"
                    onClick={onClickFaucet}
                  >
                    ETH faucet
                  </Button>
                </Grid>
              </>
            )}

            <Grid xs={24} justify="center">
              <Link href="/" className="w-full">
                <Button shadow type="secondary-light" w="100%">
                  Save
                </Button>
              </Link>
            </Grid>

            <Grid xs={24} justify="center">
              <Link href="/" className="w-full">
                <Button shadow type="error" w="100%" onClick={onClickExit}>
                  Exit Account
                </Button>
              </Link>
            </Grid>
          </Grid.Container>
        </Page.Content>
      </Page>
    </>
  )
}

export default Setting
