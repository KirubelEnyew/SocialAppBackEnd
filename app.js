const user = require('./Routes/user')
const account = require('./Routes/account')
const chat = require('./Routes/chat')
const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))

// routes go here
app.use('/user', user)
app.use('/account', account)
app.use('/chat', chat)

module.exports = app