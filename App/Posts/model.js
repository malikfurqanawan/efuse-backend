const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Reference = Schema.Types.ObjectId;

const PostSchema = new Schema({
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
    }],
    comments: [{
        type: Reference,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});

const autoPopulate = function (next) {
    this.populate('user');
    this.populate('comments');
    next();
}

PostSchema
    .pre('findOne', autoPopulate)
    .pre('find', autoPopulate)

module.exports = mongoose.model('Post', PostSchema);