const route = require('express').Router()
const { ChatModel } = require('../Models/ChatModel')
const auth = require('../Middleware/auth')

route.post('/sendMessage', auth, async (req, res) => {
    // try $elemMathc in another scenario 
    // would ,$or:[req.body.reciever,req.payload.id] be required in the query below 
    const chatExists = await ChatModel.findOne({ participants: { $all: [req.payload.id, req.body.reciever] } })
    if (chatExists) {
        ChatModel.updateOne(chatExists,
            {
                $push:
                {
                    messages:
                    {
                        sender: req.payload.id,
                        message: req.body.message,
                        date: new Date().toString()
                    }
                }
            })
            .then(() => res.status(200).json({ message: 'Message sent' }))
            .catch(() => res.status(500).json({ message: 'Unable to send message' }))
    } else {
        ChatModel({
            participants: [req.payload.id, req.body.reciever],
            messages: [{
                sender: req.payload.id,
                message: req.body.message,
                date: new Date().toString()
            }]
        }).save()
            .then(() => res.status(200).json({ message: 'Message sent' }))
            .catch(() => res.status(500).json({ message: 'Unable to send message' }))
    }
})

// add edit and delete(also for whole chat) for specific messages

module.exports = route