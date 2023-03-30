import "../styles/global.css"
import { PropsWithChildren } from "react"
import type { AppProps } from "next/app"
import { GeistProvider, CssBaseline } from "@geist-ui/core"

const Noop = ({ children }: PropsWithChildren) => <>{children}</>

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  return (
    <GeistProvider>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GeistProvider>
  )
}
export default MyApp
