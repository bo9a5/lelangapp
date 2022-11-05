import mongoose from 'mongoose'
import crypto from 'crypto'
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name harus diisi'
  },
  username: {
    type: String,
    trim: true,
    unique: 'Username sudah digunakan',
    required: 'Username harus diisi'
  },
  hashed_password: {
    type: String,
    required: "Password harus diisi"
  },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  seller: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  nohp: {
    type: String,
    trim: true,
    required: 'No HP harus diisi'
  },
  nik: {
    type: String,
    trim: true,
    required: 'NIK harus diisi'
  },
  image: {
    data: Buffer,
    contentType: String
  },
  address: {
    type: String,
    trim: true,
    required: 'Alamat harus diisi'
  }
})

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })

UserSchema.path('hashed_password').validate(function(v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password minimal harus 6 karakter.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password harus diisi')
  }
}, null)

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function(password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }
}

export default mongoose.model('User', UserSchema)
