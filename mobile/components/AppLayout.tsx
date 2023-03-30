import React, { PropsWithChildren } from "react"

import { Page } from "@geist-ui/core"
import SwipeableViews from "react-swipeable-views"
import { Tabs, Tab, Box, Typography } from "@mui/material"
import PhoneIcon from "@mui/icons-material/Phone"
import FavoriteIcon from "@mui/icons-material/Favorite"
import PersonPinIcon from "@mui/icons-material/PersonPin"

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const AppLayout = ({ children }: PropsWithChildren) => {
  const [value, setValue] = React.useState(0)

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index: number) => {
    setValue(index)
  }

  return (
    <Page dotBackdrop width="800px" height="100vh" padding={0}>
      <Page.Header>
        <h2>Header</h2>
      </Page.Header>

      <Page.Content padding={0}>
        <SwipeableViews
          axis="x"
          index={value}
          onChangeIndex={handleChangeIndex}
          className="h-[calc(100vh-50px-58px)]"
        >
          <TabPanel value={value} index={0}>
            Home
          </TabPanel>
          <TabPanel value={value} index={1}>
            Dapp
          </TabPanel>
          <TabPanel value={value} index={2}>
            Guard
          </TabPanel>
        </SwipeableViews>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="icon tabs example"
        >
          <Tab icon={<PhoneIcon />} {...a11yProps(0)} />
          <Tab icon={<FavoriteIcon />} {...a11yProps(1)} />
          <Tab icon={<PersonPinIcon />} {...a11yProps(2)} />
        </Tabs>
      </Page.Content>
    </Page>
  )
}

export default AppLayout

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  }
}
