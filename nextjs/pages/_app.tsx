import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { WagmiConfig, createClient } from "wagmi"
import { provider } from "@/lib/instances"

const client = createClient({
  autoConnect: true,
  provider,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
