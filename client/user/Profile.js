import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Edit from "@material-ui/icons/Edit"
import Person from "@material-ui/icons/Person"
import Divider from "@material-ui/core/Divider"
import DeleteUser from "./DeleteUser"
import auth from "./../auth/auth-helper"
import { read } from "./api-user.js"
import { Redirect, Link } from "react-router-dom"
import config from "./../../config/config"
import Auctions from "./../auction/Auctions"
import { listClosedByBidder, listOpenByBidder } from "./../auction/api-auction.js"
import { dateFormat } from "../util/number"
import { AppBar, Box, Tab, Tabs } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.protectedTitle,
  },
  auctions: {
    maxWidth: 600,
    margin: "24px",
    padding: theme.spacing(3),
    backgroundColor: "#3f3f3f0d",
  },
}))

export default function Profile({ match }) {
  const classes = useStyles()
  const [user, setUser] = useState({})
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()

  const [openAuctions, setOpenAuctions] = useState([])
  const [closedAuctions, setClosedAuctions] = useState([])
  const [selectedPanel, setSelectedPanel] = React.useState(0)

  useEffect(() => {
    getOpenAuctions()
    getClosedAuctions()
  }, [])

  const getOpenAuctions = () => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listOpenByBidder(
      {
        userId: match.params.userId,
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
    listClosedByBidder(
      {
        userId: match.params.userId,
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

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true)
      } else {
        setUser(data)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.userId])

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
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profil
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={"Nama : " + user.name} secondary={"Username : " + user.username} />{" "}
          {auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id && (
            <ListItemSecondaryAction>
              {/* <Link to={"/user/edit/" + user._id}>
                 <IconButton aria-label="Edit" color="primary">
                   <Edit/>
                 </IconButton>
               </Link> */}
              {/* <DeleteUser userId={user._id}/> */}
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={"No HP : " + user.nohp} />
        </ListItem>
        <ListItem>
          <ListItemText primary={"Bergabung Pada : " + dateFormat(user.created)} />
        </ListItem>
      </List>
      {auth.isAuthenticated() && auth.isAuthenticated().user && !auth.isAuthenticated().user.seller && (
        <Paper className={classes.auctions} elevation={4}>
          <Typography type="title" color="primary">
            Lelang yang anda ikuti
          </Typography>
          <br></br>
          {/* <Auctions auctions={openAuctions} removeAuction={removeAuction} /> */}

          <AppBar position="static" >
            <Tabs centered value={selectedPanel} onChange={handlePanelChange} aria-label="simple tabs example">
              <Tab label="Sedang Berjalan" {...a11yProps(0)} />
              <Tab label="Sudah Selesai" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={selectedPanel} index={0}>
            {openAuctions && openAuctions.length > 0 ? (
              <Auctions auctions={openAuctions} removeAuction={getOpenAuctions} />
            ) : (
              <Typography component="p">Lelang yang sudah selesai tidak ditemukan</Typography>
            )}
          </TabPanel>
          <TabPanel value={selectedPanel} index={1}>
            {closedAuctions && closedAuctions.length > 0 ? (
              <Auctions auctions={closedAuctions} removeAuction={getClosedAuctions} />
            ) : (
              <Typography component="p">Lelang yang sudah selesai tidak ditemukan</Typography>
            )}
          </TabPanel>
        </Paper>
      )}
    </Paper>
  )
}
