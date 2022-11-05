import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Person from '@material-ui/icons/Person'
import CardMedia from '@material-ui/core/CardMedia'
import Divider from '@material-ui/core/Divider'
import AcceptBuyer from './AcceptBuyer'
import DeclineBuyer from './DeclineBuyer'
import auth from './../auth/auth-helper'
import {getBuyer} from './api-admin.js'
import {Redirect, Link} from 'react-router-dom'
import config from './../../config/config'
import Auctions from './../auction/Auctions'
import {listByBidder} from './../auction/api-auction.js'
import { dateFormat } from '../util/number'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.protectedTitle
  },
  auctions: {
    maxWidth: 600,
    margin: '24px',
    padding: theme.spacing(3),
    backgroundColor: '#3f3f3f0d'
  },
  media: {
    height: 300,
    display: 'inline-block',
    width: '100%',
  }
}))

export default function BuyerDetail({ match }) {
  const classes = useStyles()
  const [user, setUser] = useState({})
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    getBuyer({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true)
      } else {
        setUser(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])

  const imageUrl = user._id
    ? `/api/user_ktp/image/${user._id}?${new Date().getTime()}`
    : '/api/user_ktp/defaultphoto'

  if (redirectToSignin) {
    return <Redirect to='/signin'/>
  }
  return (
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          Verifikasi Penjual
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary={'Nama : ' + user.name} secondary={'Username : ' + user.username}/> 
              <ListItemSecondaryAction>
               {/* <Link to={"/user/edit/" + user._id}>
                 <IconButton aria-label="Edit" color="primary">
                   <Edit/>
                 </IconButton>
               </Link> */}

              <AcceptBuyer userId={user._id}/>
              <DeclineBuyer userId={user._id}/>
              
             </ListItemSecondaryAction>
          </ListItem>
          <Divider/>
          <ListItem>
            <ListItemText primary={"No HP : " + 
              user.nohp}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={"Bergabung Pada : " + 
              dateFormat(user.created)}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={"Alamat : " + 
              user.address}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={"NIK : " + 
              user.nik}/>
          </ListItem>
        </List>

        <CardMedia
          className={classes.media}
          image={imageUrl}
          title={user.name}
        />

        {/* {!auth.isAuthenticated().user.seller && (
          <Paper className={classes.auctions} elevation={4}>
            <Typography type="title" color="primary">
                Lelang yang anda ikuti
            </Typography>
            <Auctions  auctions={auctions} removeAuction={removeAuction} />
          </Paper>
        )} */}
      </Paper>
    )
}
