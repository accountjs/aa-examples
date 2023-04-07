import { Currency } from "@/lib/type"
import { Button, Collapse, Input, Spacer, Text } from "@geist-ui/core"
import { useRef, useState } from "react"

type AssetProps = {
  currency?: Currency
  amount?: string
}

type FormValue = {
  toAddress: string
  amount: string
}

export const AssetItem = ({ currency, amount }: AssetProps) => {
  const [formValue, setFormValue] = useState<FormValue>()
  const setChange = () => {}

  return (
    <Collapse
      title={currency ?? "x"}
      subtitle={
        <Text h3 className="">
          {amount ?? "-"}
        </Text>
      }
    >
      <div className="flex flex-col gap-2">
        <Input
          placeholder="0x..."
          onChange={(e) => console.log(e.target.value)}
        >
          To Address
        </Input>
        <Input
          placeholder="1"
          initialValue="1"
          onChange={(e) => console.log(e.target.value)}
        >
          Amount
        </Input>

        <Spacer h={0.5} />
        <Button width="30%" type="secondary" scale={3 / 4} onClick={setChange}>
          Send
        </Button>
      </div>
    </Collapse>
  )
}
