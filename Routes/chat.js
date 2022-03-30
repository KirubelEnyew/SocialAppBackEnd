const route = require('express').Router()
const { ChatModel } = require('../Models/ChatModel')
const auth = require('../Middleware/auth')

route.post('/sendMessage', auth, async (req, res) => {
    // try $elemMathc in another scenario 
    // would ,$or:[req.body.reciever,req.payload.id] be required in the query below, UPDATE : $all does the inteded action 
    // remember to add socket for sending the message as well

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
route.post('/editMessage', auth, (req, res) => {
    ChatModel.findOneAndUpdate(
        { 'messages._id': req.body.messageId },
        {
            $set: {
                'messages.$.message': req.body.editedMessage,
                edited: true
            }
        }
    )
        .then(() => res.status(200).send({ message: 'Message edited' }))
        .catch(() => res.status(400).send({ message: 'Unable to edit message' }))
})

route.post('/deleteMessage', auth, (req, res) => {
    ChatModel.findOneAndDelete({ 'messages._id': req.body.messageId })
        .then(() => res.status(200).send({ message: 'Message deleted' }))
        .catch(() => res.status(500).send({ message: 'Unable to delete message' }))
})

route.post('/deleteChat', auth, (req, res) => {
    ChatModel.findOneAndDelete({ _id: req.body.chatId })
        .then(() => res.status(200).send({ message: 'Chat history deleted' }))
        .catch(() => res.status(500).send({ message: 'Unable to delete chat history' }))
})

route.get('/searchChats', auth, async (req, res) => {
    const searchResult = await ChatModel.aggregate([
        { $match: { 'messages.message': { $text: { $search: req.query.searchQuery } } } },
        { $match: { 'participants': req.payload.id } },
        { $sort: { score: { $meta: 'textScore' } } },
        { $project: { participants: 1, messages: 1 } }
    ])
    return res.status(200).json({ message: searchResult })
})

module.exports = route