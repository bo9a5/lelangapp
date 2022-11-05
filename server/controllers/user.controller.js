import User from '../models/user.model'
import extend from 'lodash/extend'
import formidable from 'formidable'
import fs from 'fs'
import errorHandler from './../helpers/dbErrorHandler'
import request from 'request'
import config from './../../config/config'
import defaultImage from './../../client/assets/images/default.png'

const create = async (req, res) => {

  const foundUser = await User.find({username: req.body.username})

  if (foundUser && foundUser.length > 0) {
    return res.status('400').json({
      error: "Username sudah digunakan"
    })
  }

  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: "Foto KTP tidak dapat di-upload"
      })
    }
    
    let user = new User(fields)
    user.seller = false
    user.verified = null
    user.admin = false

    if(files.image){
      user.image.data = fs.readFileSync(files.image.path)
      user.image.contentType = files.image.type
    }
    try {
      let result = await user.save()
      res.status(200).json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const createSeller = async (req, res) => {

  const foundUser = await User.find({username: req.body.username})
  
  if (foundUser && foundUser.length > 0) {
    return res.status('400').json({
      error: "Username sudah digunakan"
    })
  }

  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: "Foto KTP tidak dapat di-upload"
      })
    }
    
    let user = new User(fields)
    user.seller = true
    user.verified = null
    user.admin = false

    if(files.image){
      user.image.data = fs.readFileSync(files.image.path)
      user.image.contentType = files.image.type
    }
    try {
      let result = await user.save()
      res.status(200).json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
    if (!user)
      return res.status('400').json({
        error: "User not found"
      })
    req.profile = user
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const list = async (req, res) => {
  try {
    let users = await User.find().select('name username updated created')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listNotVerifiedSeller = async (req, res) => {
  try {

    let users = await User.find({ seller: true, verified: null }).select('name username updated created')

    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const readSeller = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const listNotVerifiedBuyer = async (req, res) => {
  try {

    let users = await User.find({ seller: false, admin: false, verified: null }).select('name username updated created')

    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const readBuyer = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const ktpImage = (req, res) => {
  if(req.profile && req.profile.image && req.profile.image.data){
    res.set("Content-Type", req.profile.image.contentType)
    return res.send(req.profile.image.data)
  }
}

const defaultKtpImage = (req, res) => {
  return res.sendFile(process.cwd()+defaultImage)
}

const acceptSeller = async (req, res) => {
  try {
    let user = req.profile
    user.verified = true
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const declineSeller = async (req, res) => {
  try {
    let user = req.profile
    user.verified = false
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const acceptBuyer = async (req, res) => {
  try {
    let user = req.profile
    user.verified = true
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const declineBuyer = async (req, res) => {
  try {
    let user = req.profile
    user.verified = false
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let user = req.profile
    user = extend(user, req.body)
    user.updated = Date.now()
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isSeller = (req, res, next) => {
  const isSeller = req.profile && req.profile.seller
  if (!isSeller) {
    return res.status('403').json({
      error: "User is not a seller"
    })
  }
  next()
}

export default {
  create,
  createSeller,
  userByID,
  read,
  list,
  listNotVerifiedSeller,
  readSeller,
  listNotVerifiedBuyer,
  readBuyer,
  ktpImage,
  defaultKtpImage,
  acceptSeller,
  declineSeller,
  acceptBuyer,
  declineBuyer,
  remove,
  update,
  isSeller
}
