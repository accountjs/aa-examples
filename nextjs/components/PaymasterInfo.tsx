import { useEffect, useState } from "react"
import { BigNumber } from "ethers"
import { PaymasterMode } from "@/lib/type"
import { getDeposit, getDepositInfo } from "@/lib/helper"
import { formatEther } from "ethers/lib/utils.js"

type Deposit = {
  deposit: BigNumber
  staked: boolean
  stake: BigNumber
  unstakeDelaySec: number
  withdrawTime: BigNumber

  // Custom name
  name?: "usdt" | "weth" | "gasless" | "token"
}

type Deposits = {
  [PaymasterMode.usdt]?: Deposit
  [PaymasterMode.weth]?: Deposit
  [PaymasterMode.gasless]?: Deposit
  [PaymasterMode.token]?: Deposit
}

const append = <T = unknown,>(key: string, val: T, obj: Deposit) => {
  return {
    ...obj,
    [key]: val,
  }
}

const useDeposits = () => {
  const [depositInfos, setDepositInfos] = useState<Deposits>()

  useEffect(() => {
    ;(async () => {
      // Exclude none
      const usdtDepositInfo = await getDepositInfo(PaymasterMode.usdt)
      const wethDepositInfo = await getDepositInfo(PaymasterMode.weth)
      const gaslessDepositInfo = await getDepositInfo(PaymasterMode.gasless)
      const tokenDepositInfo = await getDepositInfo(PaymasterMode.token)

      setDepositInfos({
        [PaymasterMode.usdt]: append("name", "usdt", usdtDepositInfo!),
        [PaymasterMode.weth]: append("name", "weth", wethDepositInfo!),
        [PaymasterMode.token]: append("name", "token", tokenDepositInfo!),
        [PaymasterMode.gasless]: append("name", "gasless", gaslessDepositInfo!),
      })
    })()
  }, [])

  return depositInfos
}

type InfoProps = {
  info: Deposit
}

const Info = ({ info }: InfoProps) => {
  return (
    <div>
      <h2>{info.name}</h2>
      Deposit Amount: {formatEther(info.deposit)} ethers
    </div>
  )
}

export const PaymasterInfo = () => {
  const infos = useDeposits()

  return infos ? (
    <div>
      {infos.usdt && <Info info={infos.usdt} />}
      {infos.weth && <Info info={infos.weth} />}
      {infos.gasless && <Info info={infos.gasless} />}
      {infos.token && <Info info={infos.token} />}
    </div>
  ) : null
}
