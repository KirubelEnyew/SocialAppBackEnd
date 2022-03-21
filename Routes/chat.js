const route = require('express').Router()
const { ChatModel } = require('../Models/ChatModel')

route.post('/sendMessage', auth, (req, res) => {
    // try $elemMathc in another scenario 
    // use findOne instead of exists?
    const chatExists = ChatModel.exists({ participants: [req.payload.id, req.body.reciever] })
    console.log(chatExists)
})