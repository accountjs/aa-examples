import { useAbstractAccount } from "@/hooks/useAbstractAccount"
import { useIsMounted } from "@/hooks/useIsMounted"
import { Currency, TokenSymbol } from "@/lib/type"
import {
  Page,
  Grid,
  Button,
  Text,
  Avatar,
  Collapse,
  useToasts,
} from "@geist-ui/core"
import { Settings, Copy } from "@geist-ui/icons"
import Link from "next/link"
import cx from "clsx"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { AssetFormValue, AssetItem } from "./AssetItem"
import { useState } from "react"
import { formatDecimals, transfer, trimAddress } from "@/lib/utils"

const Home = () => {
  const {
    hasDeployed,
    activateAccount,
    isActivating,
    eoaAddress,
    balances,
    accountAddress,
    aaProvider,
    updateUserBalances,
  } = useAbstractAccount()

  const onClickActivate = async () => {
    if (hasDeployed) return
    await activateAccount()
  }

  const copy = useCopyToClipboard()
  const [active, setActive] = useState(false)
  const { setToast } = useToasts()
  const handleCopyAddress = () => {
    if (!accountAddress) {
      return
    }
    copy(accountAddress)
    setToast({ text: "Address copied!", type: "success" })
    setActive(true)
    setTimeout(() => setActive(false), 2000)
  }

  const [isTransfering, setIsTransfering] = useState(false)
  const handleTransfer = async (
    { amount, toAddress }: AssetFormValue,
    symbol: TokenSymbol
  ) => {
    if (!aaProvider || !amount || !toAddress) {
      return
    }

    const currency: Currency = {
      ETH: Currency.ether,
      TT: Currency.token,
      USD: Currency.usdt,
      WETH: Currency.weth,
    }[symbol]

    try {
      setIsTransfering(true)
      await transfer(toAddress, amount, aaProvider, currency)
      await updateUserBalances()
      setToast({
        text: `Transfer ${amount} ${symbol} to ${toAddress} Successful`,
        type: "success",
      })
    } catch (error) {
      console.log("🚀 ~ file: Home.tsx:64 ~ Home ~ error:", error)
      setToast({
        text: "Error happened during transfer",
        type: "error",
      })
    }
    setIsTransfering(false)
  }

  const tokens = Object.values(balances)

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
            <Text h1>
              {balances.ether ? formatDecimals(balances.ether.formatted) : "-"}
            </Text>
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
                onClick={onClickActivate}
                loading={isActivating}
              >
                Activate Account
              </Button>
            )}
          </Grid>
        </Grid.Container>
        <Text h3>ASSETS</Text>
        {/* TODO: Abstract it to asset list */}
        <Collapse.Group accordion>
          {tokens.map(({ formatted, symbol, decimals, value }) => (
            <AssetItem
              key={symbol}
              currency={symbol}
              value={value}
              formatted={formatted}
              decimals={decimals}
              onTransfer={(formValue) => handleTransfer(formValue, symbol)}
              isTransfering={isTransfering}
            />
          ))}
        </Collapse.Group>
      </Page.Content>
    </Page>
  )
}

export default Home
