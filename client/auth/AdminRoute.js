import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from './auth-helper'

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    auth.isAuthenticated() && auth.isAuthenticated().user && auth.isAuthenticated().user.admin === true ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/'
      }}/>
    )
  )}/>
)

export default AdminRoute
