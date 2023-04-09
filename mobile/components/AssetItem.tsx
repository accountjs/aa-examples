import { formatDecimals } from "@/lib/utils"
import { Button, Collapse, Input, Spacer, useToasts } from "@geist-ui/core"
import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { useState } from "react"

export type AssetFormValue = {
  toAddress?: string
  amount?: string
}

type AssetProps = {
  currency?: string
  value?: BigNumber
  decimals?: number
  formatted?: string
  onTransfer: (x: AssetFormValue) => void
  isTransfering?: boolean
}

export const AssetItem = ({
  currency,
  value: bigBalance,
  decimals,
  formatted,
  onTransfer,
  isTransfering,
}: AssetProps) => {
  const [formValue, setFormValue] = useState<AssetFormValue>({
    amount: "1",
  })
  const setChange = (key: keyof AssetFormValue, value: string) => {
    setFormValue((x) => ({ ...x, [key]: value }))
  }
  const { setToast } = useToasts()
  const handleTransfer = () => {
    if (!formValue?.amount) {
      return
    }
    const isGreaterCurrentBalance = parseUnits(formValue.amount, decimals).gt(
      bigBalance ?? "0"
    )
    if (isGreaterCurrentBalance) {
      setToast({
        text: `Sending Amount is Greater Than the Current Balance!`,
        type: "error",
      })
      return
    }
    onTransfer?.(formValue)
  }

  return (
    <Collapse
      // A hack to change is layout
      title={
        (
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl text-blue-600">{currency ?? "x"}</h1>
            <h3 className="text-2xl">
              {formatted ? formatDecimals(formatted, 4) : "-"}
            </h3>
          </div>
        ) as unknown as string
      }
    >
      <div className="flex flex-col gap-2">
        <Input
          placeholder="0x..."
          onChange={(ev) => setChange("toAddress", ev.target.value)}
          disabled={isTransfering}
        >
          To Address
        </Input>
        <Input
          placeholder="1"
          initialValue="1"
          onChange={(ev) => setChange("amount", ev.target.value)}
          disabled={isTransfering}
        >
          Amount
        </Input>

        <Spacer h={0.5} />
        <Button
          width="30%"
          type="secondary"
          scale={3 / 4}
          onClick={handleTransfer}
          loading={isTransfering}
        >
          Send
        </Button>
      </div>
    </Collapse>
  )
}
