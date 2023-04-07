import { useAbstractAccount } from "@/hooks/useAbstractAccount"
import { testFaucet } from "@/lib/helper"
import {
  Button,
  Select,
  Grid,
  Input,
  Page,
  Text
} from "@geist-ui/core"
import { ArrowLeft } from "@geist-ui/icons"
import Head from "next/head"
import Link from "next/link"

const Setting = () => {
  const {
    accAddress,
    removePrvKey,
  } = useAbstractAccount()

  const onClickFaucet = async () => {
    console.log("faucet", accAddress)
    if (!accAddress) return
    await testFaucet(accAddress)
  }

  const onClickExit = async () => {
    console.log("Exit", accAddress)
    removePrvKey()
  }

  const onClickSave = async () => {
    console.log("Save", accAddress)
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
              <Link href="/home">
                <ArrowLeft />
              </Link>
            </Grid>
            <Grid xs={4} justify="flex-start">
              <Text h3> Setting </Text>
            </Grid>
          </Grid.Container>
        </Page.Header>

        <Page.Content px={2} py={1} >
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

            <Grid xs={8} justify="flex-end" height="50px">
              <Text h4>Paymaster</Text>
            </Grid>
            <Grid xs={16} justify="flex-start" height="50px">
              <Select placeholder="No Paymaster" type="default" width="100%">
                <Select.Option value="0">NoPaymaster</Select.Option>
                <Select.Option value="1">WETHPaymaster</Select.Option>
                <Select.Option value="2">USDTPaymaster</Select.Option>
                <Select.Option value="3">TokenPaymaster</Select.Option>
                <Select.Option value="4">VerifyingPaymaster</Select.Option>
              </Select>
            </Grid>
          
            <Grid xs={24} justify="center">
              <Link href="/home" className="w-full">
                <Button shadow type="secondary-light" w="100%" onClick={onClickSave}> Save </Button>
              </Link>
            </Grid>
            
            <Link href="/home" className="w-full">
              <Grid xs={24} justify="center">
                <Button shadow type="warning" w="100%" onClick={onClickFaucet}> ETH faucet </Button>
              </Grid>
            </Link>

            <Grid xs={24} justify="center">
              <Link href="/" className="w-full">
                <Button shadow type="error" w="100%" onClick={onClickExit}> Exit Account </Button>
              </Link>
            </Grid>
          </Grid.Container>
          
        </Page.Content>
      </Page>
    </>
  )
}

export default Setting
