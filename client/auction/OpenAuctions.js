import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import {listOpen} from './api-auction.js'
import Auctions from './Auctions'
import { Icon } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(1)}px 0 4px ${theme.spacing(1)}px` ,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  addButton:{
    float:'right'
  },
  leftIcon: {
    marginRight: "8px"
  },
  searchField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
    marginBottom: '20px'
  },
  searchButton: {
    minWidth: '20px',
    height: '30px',
    padding: '0 8px',
    marginBottom: '10px'
  },
  error: {
    verticalAlign: 'middle'
  }
}))
export default function OpenAuctions(){
  const classes = useStyles()
  const [auctions, setAuctions] = useState([])

  const [values, setValues] = useState({
    searchName: '',
    error: ''
  })

  useEffect(() => {
    getOpenAuctions()
  }, [])

  const handleChange = name => event => {
    setValues({
      ...values, [name]: event.target.value,
    })
  }

  const getOpenAuctions = () => {
    const abortController = new AbortController()
    const signal = abortController.signal
    const searchParams = {
      itemName: values.searchName
    }
    listOpen(searchParams, signal).then((data) => {
      if (data.error) {
        // setRedirectToSignin(true)
        setValues({ ...values, error: 'Gagal memperoleh daftar lelang'})
      } else {
        if (data.length === 0) {
          setValues({ ...values, error: 'Lelang tidak ditemukan'})
        } else {
          setValues({ ...values, error: ''})
        }

        setAuctions(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }

  // const removeAuction = (auction) => {
  //   const updatedAuctions = [...auctions]
  //   const index = updatedAuctions.indexOf(auction)
  //   updatedAuctions.splice(index, 1)
  //   setAuctions(updatedAuctions)
  // }
    return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Lelang yang Berlangsung
        </Typography>
        <TextField
            value={values.searchName}
            id="searchName"
            label="Cari lelang"
            type="searchName"
            // onKeyDown={enterKey}
            onChange={handleChange("searchName")}
            className={classes.searchField}
            margin="normal"
          />
          <Button variant="contained" color={'primary'} className={classes.searchButton} onClick={getOpenAuctions}>
            <SearchIcon/>
          </Button>
        <Auctions auctions={auctions} removeAuction={getOpenAuctions}/>

        <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}</Typography>)
          }
      </Paper>
    </div>)
}