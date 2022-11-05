import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Icon from "@material-ui/core/Icon"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import auth from "../auth/auth-helper"
import { sellerClosedAuctions, sellerNotStartAuctions, sellerOpenAuctions } from "./api-auction.js"
import { Redirect, Link } from "react-router-dom"
import Auctions from "./Auctions"
import { AppBar, Box, Tab, Tabs } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px`,
    color: theme.palette.protectedTitle,
    fontSize: "1.2em",
  },
  addButton: {
    float: "right",
  },
  leftIcon: {
    marginRight: "8px",
  },
}))
export default function MyAuctions() {
  const classes = useStyles()
  const [notStartAuctions, setNotStartAuctions] = useState([])
  const [openAuctions, setOpenAuctions] = useState([])
  const [closedAuctions, setClosedAuctions] = useState([])
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const [selectedPanel, setSelectedPanel] = React.useState(0)

  const jwt = auth.isAuthenticated()

  useEffect(() => {
    getNotStartAuctions()
    getOpenAuctions()
    getClosedAuctions()
  }, [])

  const getNotStartAuctions = () => {
    const abortController = new AbortController()
    const signal = abortController.signal
    sellerNotStartAuctions(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setRedirectToSignin(true)
      } else {
        setNotStartAuctions(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }

  const getOpenAuctions = () => {
    const abortController = new AbortController()
    const signal = abortController.signal
    sellerOpenAuctions(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setRedirectToSignin(true)
      } else {
        setOpenAuctions(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }

  const getClosedAuctions = () => {
    const abortController = new AbortController()
    const signal = abortController.signal
    sellerClosedAuctions(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setRedirectToSignin(true)
      } else {
        setClosedAuctions(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }

  // const removeAuction = (auction) => {
  //   const updatedAuctions = [...openAuctions]
  //   const index = updatedAuctions.indexOf(auction)
  //   updatedAuctions.splice(index, 1)
  //   setOpenAuctions(updatedAuctions)
  // }

  const handlePanelChange = (event, newValue) => {
    setSelectedPanel(newValue)
  }

  if (redirectToSignin) {
    return <Redirect to="/signin" />
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    )
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    }
  }

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Daftar Lelang
          <span className={classes.addButton}>
            <Link to="/auction/new">
              <Button color="primary" variant="contained">
                <Icon className={classes.leftIcon}>add_box</Icon> Mulai Lelang
              </Button>
            </Link>
          </span>
        </Typography>
        {/* <Auctions auctions={auctions} removeAuction={removeAuction}/> */}

        <AppBar position="static">
          <Tabs centered value={selectedPanel} onChange={handlePanelChange} aria-label="simple tabs example">
            <Tab label="Belum Dimulai" {...a11yProps(0)} />
            <Tab label="Sedang Berjalan" {...a11yProps(1)} />
            <Tab label="Sudah Selesai" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={selectedPanel} index={0}>
          {notStartAuctions && notStartAuctions.length > 0 ? (
            <Auctions auctions={notStartAuctions} removeAuction={getNotStartAuctions} />
          ) : (
            <Typography component="p">Lelang yang belum dimulai tidak ditemukan</Typography>
          )}
        </TabPanel>
        <TabPanel value={selectedPanel} index={1}>
          {openAuctions && openAuctions.length > 0 ? (
            <Auctions auctions={openAuctions} removeAuction={getOpenAuctions} />
          ) : (
            <Typography component="p">Lelang yang sudah selesai tidak ditemukan</Typography>
          )}
        </TabPanel>
        <TabPanel value={selectedPanel} index={2}>
          {closedAuctions && closedAuctions.length > 0 ? (
            <Auctions auctions={closedAuctions} removeAuction={getClosedAuctions} />
          ) : (
            <Typography component="p">Lelang yang sudah selesai tidak ditemukan</Typography>
          )}
        </TabPanel>
      </Paper>
    </div>
  )
}
