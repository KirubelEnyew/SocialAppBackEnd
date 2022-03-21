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
            date: Date
        }],
        required: true
    }
})

const ChatModel = mongoose.model('ChatModel', ChatSchema)

exports.ChatModel = ChatModel