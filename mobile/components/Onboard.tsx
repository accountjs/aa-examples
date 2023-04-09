import Link from "next/link"
import { Page, Display, Grid, Button, Text, Image } from "@geist-ui/core"
import { useAbstractAccount } from "@/hooks/useAbstractAccount"
import { useIsMounted } from "@/hooks/useIsMounted"
import { useRouter } from "next/router"

const Onboard = () => {
  const { generatePrvKey } = useAbstractAccount()
  const router = useRouter()

  const createAccount = () => {
    generatePrvKey()
    router.reload()
  }

  const mounted = useIsMounted()
  if (!mounted) {
    return null
  }

  return (
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
          <Link href="/recovery" className="w-full">
            <Button w="100%">Recover</Button>
          </Link>
        </Grid>

        <Grid xs={20} sm={20} justify="center">
          <Button
            shadow
            type="secondary-light"
            w="100%"
            onClick={createAccount}
          >
            Create
          </Button>
        </Grid>
      </Grid.Container>
    </Page>
  )
}

export default Onboard
