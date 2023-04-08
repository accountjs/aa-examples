import React, { PropsWithChildren } from "react"
import { useRouter } from "next/router"

import { Page } from "@geist-ui/core"
import { Tabs, Tab } from "@mui/material"
import PersonPinIcon from "@mui/icons-material/PersonPin"
import HomeIcon from "@mui/icons-material/Home"
import SwapVerticalCircleIcon from "@mui/icons-material/SwapVerticalCircle"
import { useIsMounted } from "@/hooks/useIsMounted"

type AppLink = "home" | "dapp" | "guardian"

const AppLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter()
  const activateRoute = router.asPath?.replace(/\//g, "") || "/"

  const handleChange = (_: React.SyntheticEvent, newValue: AppLink) => {
    router.push(`/${newValue}`)
  }

  const mounted = useIsMounted()
  if (!mounted) {
    return null
  }

  return (
    <div className="h-screen">
      <div className="max-h-[calc(100%-50px)]">{children}</div>
      <Page.Footer className="!fixed z-10 bg-white border-t bottom-0 left-0 right-0">
        <Tabs
          value={activateRoute}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="icon tabs example"
        >
          <Tab value="/" icon={<HomeIcon />} {...a11yProps(0)} />
          <Tab
            value="dapp"
            icon={<SwapVerticalCircleIcon />}
            {...a11yProps(1)}
          />
          <Tab value="guardian" icon={<PersonPinIcon />} {...a11yProps(2)} />
        </Tabs>
      </Page.Footer>
    </div>
  )
}

export default AppLayout

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  }
}
