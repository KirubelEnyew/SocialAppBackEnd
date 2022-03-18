const user = require('./Routes/user')
const account = require('./Routes/account')
const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))

// routes go here
app.use('/user', user)
app.use('/account', account)

module.exports = app