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
import Typography from "@material-ui/core/Typography"
import ArrowForward from "@material-ui/icons/ArrowForward"
import Person from "@material-ui/icons/Person"
import { Link } from "react-router-dom"
import auth from './../auth/auth-helper'
import { listVerifySeller } from "./api-admin.js"
import { Grid } from "@material-ui/core"
import { dateFormat } from "../util/number.js"

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(5),
    margin: theme.spacing(15),
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
  },
}))

export default function VerifySeller() {
  const classes = useStyles()
  const [users, setUsers] = useState([])
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listVerifySeller({t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setUsers(data)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
    <Paper className={classes.root} elevation={3}>
      <Typography variant="h6" className={classes.title}>
        Verifikasi Penjual
      </Typography>
        <Grid container spacing={4}>
          <Grid item xs={4} sm={4}>
            <Typography variant="subtitle1" color="primary">
              Nama
            </Typography>
          </Grid>
          <Grid item xs={4} sm={4}>
            <Typography variant="subtitle1" color="primary">
              Registrasi Pada
            </Typography>
          </Grid>
          <Grid item xs={4} sm={4}>
            <Typography variant="subtitle1" color="primary">
              Username
            </Typography>
          </Grid>
        </Grid>
        {users.map((item, i) => {
          return (
            <Link to={"/seller/" + item._id} key={i}>
              <ListItem button>
                <Grid container spacing={4} key={i}>
                  <Grid item xs={4} sm={4}>
                    <Typography variant="body2">{item.name}</Typography>
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <Typography variant="body2">{dateFormat(item.created)}</Typography>
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <Typography variant="body2">{item.username}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </Link>
          )
        })}
    </Paper>
  )

  // return (
  //   <Paper className={classes.root} elevation={3}>
  //     <Typography variant="h6" className={classes.title}>
  //       Verifikasi Penjual
  //     </Typography>
  //     <List dense>
  //      {users.map((item, i) => {
  //       return <Link to={"/seller/" + item._id} key={i}>
  //                 <ListItem button>
  //                   {/* <ListItemAvatar>
  //                     <Avatar>
  //                       <Person/>
  //                     </Avatar>
  //                   </ListItemAvatar> */}
  //                   <ListItemText primary={item.name}/>
  //                   <ListItemSecondaryAction>
  //                   {/* <IconButton>
  //                       <ArrowForward/>
  //                   </IconButton> */}
  //                   </ListItemSecondaryAction>
  //                 </ListItem>
  //              </Link>
  //            })
  //          }
  //     </List>

  //   </Paper>
  // )
}
