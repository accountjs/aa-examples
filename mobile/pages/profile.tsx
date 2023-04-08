import {
  Button,
  Grid,
  Input,
  Page,
  Text,
  Avatar,
  Divider
} from "@geist-ui/core"
import { ArrowLeft } from "@geist-ui/icons"
import Head from "next/head"
import Link from "next/link"

const Profile = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
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
              <Text h3> Profile </Text>
            </Grid>
          </Grid.Container>
        </Page.Header>

        <Page.Content px={2} >
          <Grid.Container gap={2}>
            <Grid xs={24} justify="center" height="250px">
              <Avatar text="0x" height={4} width={4}></Avatar>
            </Grid>
          </Grid.Container>
          <Divider mt={2}/>
          <Grid.Container gap={2}>
            <Grid xs={8} justify="flex-end" height="50px">
              <Text h4> Name </Text>
            </Grid>
            <Grid xs={16} justify="flex-start" height="50px">
              <Input width="100%" placeholder="account name" />
            </Grid>
          </Grid.Container>
          <Divider mt={2}/>
          <Grid.Container gap={2}>
            <Grid xs={8} justify="flex-end" height="50px">
              <Text h4> Owner </Text>
            </Grid>
            <Grid xs={16} justify="flex-start" height="50px">
              <Input width="100%" placeholder="eoa address" />
            </Grid>
          </Grid.Container>
          <Divider mt={2}/>
          <Grid.Container gap={2}>
            <Grid xs={24} justify="center">
              <Link href="/" className="w-full">
                <Button shadow type="secondary-light" w="100%"> Save </Button>
              </Link>
            </Grid>
          </Grid.Container>

        </Page.Content>
      </Page>
    </>
  )
}

export default Profile
