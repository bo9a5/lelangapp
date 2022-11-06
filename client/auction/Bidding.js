import React, {useState, useEffect}  from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import auth from '../auth/auth-helper'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import { dateTimeFormat, rupiahFormat } from '../util/number'

const io = require('socket.io-client')
const socket = io()

const useStyles = makeStyles(theme => ({
    bidHistory: {
        marginTop: '20px',
        backgroundColor: '#f3f3f3',
        padding: '16px'
    },
    placeForm: {
        margin: '0px 16px 16px',
        backgroundColor: '#e7ede4',
        display: 'inline-block'
    },
    marginInput: {
        margin: 16
    },
    marginBtn: {
        margin: '8px 16px 16px'
    }
}))
export default function Bidding (props) {
    const classes = useStyles()
    const [bid, setBid] = useState('')

    const jwt = auth.isAuthenticated()

    useEffect(() => {
        socket.emit('join auction room', {room: props.auction._id})
        return () => {
            socket.emit('leave auction room', {
              room: props.auction._id
            })
          }
    }, [])

    useEffect(() => {
        socket.on('new bid', payload => {
          props.updateBids(payload)
        })
        return () => {
            socket.off('new bid')
        }
    })
    const handleChange = event => {
        setBid(event.target.value)
    }
    const placeBid = () => {
        let newBid = {
            bid: bid,
            time: new Date(),
            bidder: jwt.user
        }
        socket.emit('new bid', {
            room: props.auction._id,
            bidInfo:  newBid
        })
        setBid('')
    }
    const minBid = props.auction.bids && props.auction.bids.length> 0 ? props.auction.bids[0].bid : props.auction.startingBid
    return(
        <div>
            {!props.justEnded && !auth.isAuthenticated().user.seller && !auth.isAuthenticated().user.admin && new Date() < new Date(props.auction.bidEnd) && <div className={classes.placeForm}>
                <TextField id="bid" label="Tawaran Anda (Rp.)"  
                        value={bid} onChange={handleChange} 
                        type="number" margin="normal"
                        helperText={`Masukkan ${rupiahFormat(Number(minBid)+1)} atau lebih`}
                        className={classes.marginInput}/><br/>
                <Button variant="contained" className={classes.marginBtn} color="secondary" disabled={bid < (minBid + 1)} onClick={placeBid} >Ajukan Tawaran</Button><br/>
            </div>}
            <div className={classes.bidHistory}>
                <Typography variant="h6">Semua Tawaran</Typography><br/>
                <Grid container spacing={4}>
                    <Grid item xs={3} sm={3}>
                        <Typography variant="subtitle1" color="primary">Jumlah Tawaran</Typography>
                    </Grid>
                    <Grid item xs={5} sm={5}>
                        <Typography variant="subtitle1" color="primary">Waktu</Typography>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                        <Typography variant="subtitle1" color="primary">Penawar</Typography>
                    </Grid>
                </Grid>    
                    {props.auction.bids.map((item, index) => {
                        return <Grid container spacing={4} key={index}>
                            <Grid item xs={3} sm={3}><Typography variant="body2">{rupiahFormat(item.bid)}</Typography></Grid>
                            <Grid item xs={5} sm={5}><Typography variant="body2">{dateTimeFormat(item.time)}</Typography></Grid>
                            <Grid item xs={4} sm={4}><Typography variant="body2">{item.bidder.username}</Typography></Grid>
                        </Grid>
                    })}
                
            </div>
        </div>
    )
}