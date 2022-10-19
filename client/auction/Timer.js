import React, {useState, useEffect}  from 'react'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import { dateTimeFormat } from '../util/number'

const useStyles = makeStyles(theme => ({
    endTime: {
      fontSize: '0.75em',
      color: '#323232',
      fontWeight: 300
    },
    subheading: {
      margin: '16px',
      color: theme.palette.openTitle
    },
  }))

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
export default function Timer (props) {
  const classes = useStyles()
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(new Date(props.endTime)))

    useEffect(() => {
      let timer = null
      if(!timeLeft.timeEnd){
        timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(new Date(props.endTime)))
        }, 1000)
      }else{
          props.update()
      }
      return () => {
        clearTimeout(timer)
      }
    })
    return (<div className={classes.subheading}>
        {!timeLeft.timeEnd? <Typography component="p" variant="h6" >
                Tersisa 
                {timeLeft.days != 0 && ` ${timeLeft.days} hari `} 
                {timeLeft.hours != 0 && ` ${timeLeft.hours} jam `} 
                {timeLeft.minutes != 0 && ` ${timeLeft.minutes} menit `} 
                {timeLeft.seconds != 0 && ` ${timeLeft.seconds} detik`} <span className={classes.endTime}>{`(berakhir pada ${dateTimeFormat(props.endTime)})`}</span></Typography> : 
            <Typography component="p" variant="h6" >Lelang selesai</Typography>}
        </div>
    )
}