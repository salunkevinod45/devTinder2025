const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        enum: {
            values:['interested','ignored', 'accepted', 'rejected'],
            message: '{VALUE} is not supported'
        }
        
    },
},{ timestamps: true });


// create a compound index  on fromUserId and toUserId to ensure uniqueness
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });



connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        const err = new Error("fromUserId and toUserId cannot be the same");
        err.statusCode = 400;
        throw err;
    }
});


const ConnectionRequest = model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;