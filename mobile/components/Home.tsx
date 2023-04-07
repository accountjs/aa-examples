import { useAbstractAccount } from "@/hooks/useAbstractAccount"
import { useIsMounted } from "@/hooks/useIsMounted"
import { Currency } from "@/lib/type"
import { Page, Grid, Button, Text, Avatar, Collapse } from "@geist-ui/core"
import { Settings, Copy } from "@geist-ui/icons"
import Link from "next/link"
import { Address } from "wagmi"
import cx from "clsx"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { AssetItem } from "./AssetItem"
import { useState } from "react"

// trim address as 0x1234...5678
const trimAddress = (address?: string | Address) => {
  if (!address) return "0x"
  return address.slice(0, 6) + "..." + address.slice(-4)
}

const Home = () => {
  const { hasDeployed, activateAccount, eoaAddress, balances, accountAddress } =
    useAbstractAccount()

  const onClickActivate = async () => {
    if (hasDeployed) return
    await activateAccount()
  }

  const copy = useCopyToClipboard()
  const [active, setActive] = useState(false)
  const handleCopyAddress = () => {
    if (!accountAddress) {
      return
    }
    copy(accountAddress)
    setActive(true)
    setTimeout(() => setActive(false), 2000)
  }

  const mounted = useIsMounted()
  if (!mounted) {
    return null
  }

  return (
    <Page dotBackdrop width="800px" padding={0}>
      <Page.Header pt={2} px={2}>
        <Grid.Container gap={2}>
          <Grid xs={12} justify="flex-start">
            <Link href="/profile">
              <Avatar text="0x"></Avatar>
            </Link>
            <Text h5 pl={1}>
              {trimAddress(eoaAddress)}
            </Text>
          </Grid>

          <Grid xs={12} justify="flex-end">
            <Link href="/setting">
              <Settings />
            </Link>
          </Grid>
        </Grid.Container>
      </Page.Header>

      <Page.Content px={2}>
        <Grid.Container gap={2}>
          <Grid xs={24} justify="center" height="80px">
            <Text p>ETH</Text>
          </Grid>
          <Grid xs={24} justify="center" height="150px">
            <Text h1>{balances.ether?.formatted}</Text>
          </Grid>
          <Grid xs={24} justify="center" height="50px">
            <Button
              auto
              type="abort"
              color="blue"
              className={cx(
                "hover:text-blue-500",
                active ? "text-blue-500" : "text-gray-900"
              )}
              iconRight={<Copy />}
              onClick={handleCopyAddress}
            >
              <Text h5 pr={2}>
                {trimAddress(accountAddress)}
              </Text>
            </Button>
          </Grid>

          <Grid xs={24} justify="center" height="80px">
            {accountAddress && !hasDeployed && (
              <Button
                shadow
                type="secondary-light"
                w="80%"
                onClick={onClickActivate}
              >
                Activate Account
              </Button>
            )}
          </Grid>
        </Grid.Container>
        <Text h3>ASSETS</Text>
        {/* TODO: Abstract it to asset list */}
        <Collapse.Group>
          <AssetItem
            currency={Currency.ether}
            amount={balances.ether?.formatted}
          />
          <AssetItem
            currency={Currency.weth}
            amount={balances.weth?.formatted}
          />
          <AssetItem
            currency={Currency.usdt}
            amount={balances.usdt?.formatted}
          />
          <AssetItem
            currency={Currency.token}
            amount={balances.token?.formatted}
          />
        </Collapse.Group>
      </Page.Content>
    </Page>
  )
}

export default Home
