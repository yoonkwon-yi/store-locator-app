const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')

const StoreSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: [true, 'Please add a store ID'],
    unique: true,
    trim: true,
    maxlength: [10, 'Store ID must be less than 10 chars']
  },
  address: { type: String, required: [true, 'Please add an address'] },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'] // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere' //2dsphere supports queries that calculate geomertries on an earth-like sphere
    },
    formattedAddress: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

//Geocode & create location -- want to run it PRE-save (before it is saved in the database)
StoreSchema.pre('save', async function (next) {
  //geocoder return promise so we put await
  const loc = await geocoder.geocode(this.address)
  // console.log(loc)

  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  }

  //dion't want to save actually address to the database
  this.address = undefined

  //since this is a middleware run next at the end
  next()
})

module.exports = mongoose.model('Store', StoreSchema)
