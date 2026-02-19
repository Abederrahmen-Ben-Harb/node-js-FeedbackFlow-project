const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['under-review', 'planned', 'in-progress', 'completed'],
        default: 'under-review'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    upvotes: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);