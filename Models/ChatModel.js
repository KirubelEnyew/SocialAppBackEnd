const mongoose = require('mongoose')

const ChatSchema = mongoose.Schema({
    participants: {
        type: [String],
        required: true
    },
    messages: {
        type: [{
            sender: String,
            message: String,
            date: Date,
            edited: Boolean
        }],
        required: true
    }
})

const ChatModel = mongoose.model('Chat', ChatSchema)

exports.ChatModel = ChatModel