import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'
import CartIcon from '@material-ui/icons/ShoppingCart'
import Badge from '@material-ui/core/Badge'
// import cart from './../cart/cart-helper'
import MUIMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return {color: '#bef67a'}
  else
    return {color: '#ffffff'}
}
const isPartActive = (history, path) => {
  if (history.location.pathname.includes(path))
    return {color: '#bef67a'}
  else
    return {color: '#ffffff'}
}
const Menu = withRouter(({history}) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        Lelang Online
      </Typography>
      <div>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(history, "/")}>
            <HomeIcon/>
          </IconButton>
        </Link>
        {/* <Link to="/shops/all">
          <Button style={isActive(history, "/shops/all")}>All Shops</Button>
        </Link> */}
        <Link to="/auctions/all">
          <Button style={isActive(history, "/auctions/all")}>Lelang yang Berlangsung</Button>
        </Link>
        {/* <Link to="/cart">
          <Button style={isActive(history, "/cart")}>
            Cart
            <Badge invisible={false} color="secondary" badgeContent={cart.itemTotal()} style={{'marginLeft': '7px'}}>
              <CartIcon />
            </Badge>
          </Button>
        </Link>       */}
      </div>
      <div style={{'position':'absolute', 'right': '10px'}}><span style={{'float': 'right'}}>
      {
        !auth.isAuthenticated() && (<span>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  Registrasi
                </Button>
                <MUIMenu {...bindMenu(popupState)}>
                  <MenuItem onClick={() => history.push('/signup')}>Pembeli</MenuItem>
                  <MenuItem onClick={() => history.push('/signupseller')}>Penjual</MenuItem>
                  {/* <MenuItem onClick={popupState.close}>Logout</MenuItem> */}
                </MUIMenu>
              </React.Fragment>
            )}
          </PopupState>
          {/* <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Registrasi
            </Button>
          </Link> */}
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Login
            </Button>
          </Link>
        </span>)
      }
      {
        auth.isAuthenticated() && auth.isAuthenticated().user && (<span>
          {auth.isAuthenticated().user.seller === true && (<>
            {/* <Link to="/seller/shops"><Button style={isPartActive(history, "/seller/")}>My Shops</Button></Link> */}
            <Link to="/myauctions"><Button style={isPartActive(history, "/myauctions")}>Lelang Saya</Button></Link>
            </>
          )}
          {auth.isAuthenticated().user.admin === true && (<>
            <Link to="/verifyseller"><Button style={isPartActive(history, "/verifyseller")}>Verifikasi Penjual</Button></Link>
            </>
          )}
          {auth.isAuthenticated().user.admin !== true && (<>
            <Link to={"/user/" + auth.isAuthenticated().user._id}>
              <Button style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>Profil</Button>
            </Link>
            </>
          )}

          <Button color="inherit" onClick={() => {
              auth.clearJWT(() => history.push('/'))
            }}>Logout</Button>
        </span>)
      }
      </span></div>
    </Toolbar>
  </AppBar>
))

export default Menu
