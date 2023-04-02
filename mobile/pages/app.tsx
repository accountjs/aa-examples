import Head from "next/head"
import React from "react"
import AppLayout from "../components/AppLayout"

const App = () => {
  return (
    <>
      <Head>
        <title>AA Wallet with AccountJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  )
}

App.Layout = AppLayout

export default App
