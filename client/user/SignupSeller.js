import React, {useState} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import {createSeller} from './api-user.js'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {Link} from 'react-router-dom'
import { checkNumber } from '../util/number.js'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  }
}))

export default function SignupSeller() {
  const classes = useStyles()
  const [values, setValues] = useState({
    name: '',
    nohp: '',
    nik: '',
    address: '',
    image: '',
    password: '',
    username: '',
    // seller: true,
    open: false,
    error: ''
  })

  const handleChange = name => event => {
    const value = name === 'image'
      ? event.target.files[0]
      : event.target.value

    // nik dan nohp hanya boleh diisi number
    // if ((name !== 'nik' && name !== 'nohp') || ((name === 'nik' || name === 'nohp') && isNumber(value))) {
    //   setValues({ ...values, [name]: value })
    // }

    if (name === 'nik' || name === 'nohp') {
      if (checkNumber(value)) {
        setValues({ ...values, [name]: value })
      }
    } else {
      setValues({ ...values, [name]: value })
    }
  }

  const clickSubmit = () => {
    let sellerData = new FormData()
    values.name && sellerData.append('name', values.name)
    values.nohp && sellerData.append('nohp', values.nohp)
    values.nik && sellerData.append('nik', values.nik)
    values.address && sellerData.append('address', values.address)
    values.image && sellerData.append('image', values.image)
    values.password && sellerData.append('password', values.password)
    values.username && sellerData.append('username', values.username)

    createSeller(sellerData).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, error: '', open: true})
      }
    })
  }

  // const clickSubmit = () => {
  //   const user = {
  //     name: values.name || undefined,
  //     username: values.username || undefined,
  //     password: values.password || undefined,
  //     seller: true
  //   }
  //   create(user).then((data) => {
  //     if (data.error) {
  //       setValues({ ...values, error: data.error})
  //     } else {
  //       setValues({ ...values, error: '', open: true})
  //     }
  //   })
  // }

    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Registrasi Penjual
          </Typography>
          <TextField id="name" label="Nama" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
          <TextField id="nohp" label="No HP"  className={classes.textField} value={values.nohp} onChange={handleChange('nohp')} margin="normal"/><br/>
          <TextField
            id="multiline-flexible"
            label="Alamat"
            multiline
            rows="5"
            value={values.description}
            onChange={handleChange('address')}
            className={classes.textField}
            margin="normal"
          />
          <TextField id="nik" label="NIK"  className={classes.textField} value={values.nik} onChange={handleChange('nik')} margin="normal"/><br/>
          <input accept="image/*" onChange={handleChange('image')} className={classes.input} id="icon-button-file" type="file" />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Foto KTP
              <FileUpload/>
            </Button>
          </label> <span className={classes.filename}>{values.image ? values.image.name : ''}</span><br/>
          <TextField id="username" type="Username" label="Username" className={classes.textField} value={values.username} onChange={handleChange('username')} margin="normal"/><br/>
          <TextField id="password" type="Password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}</Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Daftar</Button>
        </CardActions>
      </Card>
      <Dialog open={values.open} disableBackdropClick={true}>
        <DialogTitle>Akun Baru</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Silahkan tunggu konfirmasi verifikasi akun
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/">
            <Button color="primary" autoFocus="autoFocus" variant="contained">
              OK
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  )
}