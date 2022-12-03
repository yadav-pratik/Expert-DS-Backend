const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reviewSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    service : {
        type : Schema.Types.ObjectId,
        ref : 'Service',
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    review : {
        type : String,
        maxLength : 400
    }
})

const Review = mongoose.model('Review',reviewSchema)

module.exports = Review