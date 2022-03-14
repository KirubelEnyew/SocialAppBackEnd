const express = require('express')
const route = express.Router()
const {addUser} = require('../Models/UserModel')

route.get('/signup', async (req, res) => {
    // save req.body after validation
    const user = await addUser(req.body)
    if(user){
    return res.status(200).json({message : user})}
    else{
    return res.status(500).json({message : 'An error occured'})}
})

module.exports = route