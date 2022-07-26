const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Reference = Schema.Types.ObjectId;

const CommentSchema = new Schema ({
    user: {
        type: Reference,
        ref: 'User'
    },
    text: {
        type: String,
        trim: true
    },
    likes: [{
        type: String
    }]
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('user');
    next();
}

CommentSchema
    .pre('findOne', autoPopulate)
    .pre('find', autoPopulate)

module.exports = mongoose.model('Comment', CommentSchema);