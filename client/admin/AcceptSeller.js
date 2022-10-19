import React, {useState} from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import CheckIcon from '@material-ui/icons/Check'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import auth from './../auth/auth-helper'
import {acceptSeller} from './api-admin.js'
import {Redirect} from 'react-router-dom'

export default function AcceptSeller(props) {
  const [open, setOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const jwt = auth.isAuthenticated()
  const clickButton = () => {
    setOpen(true)
  }
  const acceptAccount = () => { 
    acceptSeller({
      userId: props.userId
    }, {t: jwt.token}).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setRedirect(true)
      }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }
  
  if (redirect) {
    return <Redirect to='/verifyseller'/>
  }
    return (<span>
      <IconButton aria-label="Terima" onClick={clickButton} color="primary">
        <CheckIcon/>
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Terima Verifikasi"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah anda ingin menerima verifikasi penjual?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Batal
          </Button>
          <Button onClick={acceptAccount} color="secondary" autoFocus="autoFocus">
            Ya
          </Button>
        </DialogActions>
      </Dialog>
    </span>)

}
AcceptSeller.propTypes = {
  userId: PropTypes.string.isRequired
}
