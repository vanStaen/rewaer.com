const mongoose = require('mongoose');

const LookSchema = mongoose.Schema({
    "user": {
        type: String,
        required: true
    },
    "category": {
        type: String,
        required: true
    },
    "mediaUrl": {
        type: String,
        required: true
    },
    "dateCreated": {
        type: Date,
        default: Date.now
    },
    "items": {
        type: [String],
        required: false
    },
    "active": {
        type: Boolean,
        required: true
    },
    "favorite": {
        type: Boolean,
        required: true
    }
}
)

module.exports = mongoose.model('Look', UserSchema)