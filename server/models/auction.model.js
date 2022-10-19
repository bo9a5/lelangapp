import mongoose from 'mongoose'
const AuctionSchema = new mongoose.Schema({
  itemName: {
    type: String,
    trim: true,
    required: 'Nama produk harus diisi'
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  bidStart: {
    type: Date,
    default: Date.now
  },
  bidEnd: {
    type: Date,
    required: "Waktu lelang berakhir harus diisi"
  },
  seller: {
    type: mongoose.Schema.ObjectId, 
    ref: 'User'
  },
  startingBid: { type: Number, default: 0 },
  bids: [{
    bidder: {type: mongoose.Schema.ObjectId, ref: 'User'},
    bid: Number,
    time: Date
  }]
})

export default mongoose.model('Auction', AuctionSchema)
