import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Edit from '@material-ui/icons/Edit'
import ViewIcon from '@material-ui/icons/Visibility'
import SearchIcon from '@material-ui/icons/Search';
import Divider from '@material-ui/core/Divider'
import DeleteAuction from './DeleteAuction'
import auth from '../auth/auth-helper'
import {Link} from 'react-router-dom'
import { dateTimeFormat, rupiahFormat } from '../util/number'

const calculateTimeLeft = (date) => {
  const difference = date - new Date()
  let timeLeft = {}

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      timeEnd: false
    }
  } else {
      timeLeft = {timeEnd: true}
  }
  return timeLeft
}

export default function Auctions(props){
  const currentDate = new Date()
  const showTimeLeft = (date) => {
    let timeLeft = calculateTimeLeft(date)
    return !timeLeft.timeEnd && <span>
      {timeLeft.days != 0 && `${timeLeft.days} hari `} 
      {timeLeft.hours != 0 && `${timeLeft.hours} jam `} 
      {timeLeft.minutes != 0 && `${timeLeft.minutes} menit `} 
      {timeLeft.seconds != 0 && `${timeLeft.seconds} detik`} lagi
    </span>
  }
  const auctionState = (auction)=>{
    return (
      <span>
          {currentDate < new Date(auction.bidStart) && `Lelang dimulai pada ${dateTimeFormat(auction.bidStart)}`}
          {currentDate > new Date(auction.bidStart) && currentDate < new Date(auction.bidEnd) && <>{`Lelang Sedang Berjalan | ${auction.bids.length} tawaran |`} {showTimeLeft(new Date(auction.bidEnd))}</>}
          {currentDate > new Date(auction.bidEnd) && `Lelang selesai | ${auction.bids.length} tawaran `} 
          {currentDate > new Date(auction.bidStart) && auction.bids.length> 0 && ` | Tawaran Tertinggi: ${rupiahFormat(auction.bids[0].bid)}`}
      </span>
    )
  }
    return (
        <List dense>
        {props.auctions.map((auction, i) => {
            return   <span key={i}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar variant='square' src={'/api/auctions/image/'+auction._id+"?" + new Date().getTime()}/>
                </ListItemAvatar>
                <Link to={"/auction/" + auction._id}>
                  <ListItemText primary={auction.itemName} secondary={auctionState(auction)}/>
                </Link>
                <ListItemSecondaryAction>

                    {/* <Link to={"/auction/" + auction._id}>
                      <IconButton aria-label="View" color="primary">
                        <SearchIcon/>
                      </IconButton>
                    </Link> */}

                { auth.isAuthenticated().user && auth.isAuthenticated().user._id == auction.seller._id &&
                  <>
                    {/* <Link to={"/auction/edit/" + auction._id}>
                      <IconButton aria-label="Edit" color="primary">
                        <Edit/>
                      </IconButton>
                    </Link> */}
                    <DeleteAuction auction={auction} onRemove={props.removeAuction}/>
                  </>
                }
                </ListItemSecondaryAction>
              </ListItem>
              <Divider/>
            </span>})}
        </List>
    )
}

Auctions.propTypes = {
    auctions: PropTypes.array.isRequired,
    removeAuction: PropTypes.func.isRequired
  }

