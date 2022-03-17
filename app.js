const user = require('./Routes/user')
const account = require('./Routes/account')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes go here
app.use('/user', user)
app.use('/account', account)

module.exports = app