import React, { PropsWithChildren } from "react"
import { useRouter } from "next/router"

import { Page } from "@geist-ui/core"
import { Tabs, Tab } from "@mui/material"
import PersonPinIcon from "@mui/icons-material/PersonPin"
import HomeIcon from "@mui/icons-material/Home"
import SwapVerticalCircleIcon from "@mui/icons-material/SwapVerticalCircle"

type AppLink = "home" | "dapp" | "guardian"

const AppLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter()
  const activateRoute = router.asPath?.replace(/\//g, "") ?? "home"

  const handleChange = (_: React.SyntheticEvent, newValue: AppLink) => {
    router.push(`/${newValue}`)
  }

  return (
    <>
      {children}
      <Page.Footer>
        <Tabs
          value={activateRoute}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="icon tabs example"
        >
          <Tab value="home" icon={<HomeIcon />} {...a11yProps(0)} />
          <Tab
            value="dapp"
            icon={<SwapVerticalCircleIcon />}
            {...a11yProps(1)}
          />
          <Tab value="guardian" icon={<PersonPinIcon />} {...a11yProps(2)} />
        </Tabs>
      </Page.Footer>
    </>
  )
}

export default AppLayout

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  }
}
