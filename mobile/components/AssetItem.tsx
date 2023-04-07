import { Currency } from "@/lib/type"
import { Divider, Grid, Text } from "@geist-ui/core"
import { BigNumberish } from "ethers"
import { format } from "path"


type AssetProps = {
  currency?: Currency
  amount?: string
}

export const AssetItem = ({
  currency,
  amount,
}: AssetProps) => {
  return (
    <>
      <Grid.Container gap={2}>
        <Grid xs={22} justify="space-between" height="50px" pl={2}>
          <Text h4>{currency}</Text>
          <Text h4>{amount}</Text>
        </Grid>
      </Grid.Container>
      <Divider />
    </>
  )
    
}