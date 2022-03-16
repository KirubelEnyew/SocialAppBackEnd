const express = require('express')
const route = express.Router()
const bcrypt = require('bcryptjs')
const { addUser, validateUser, existingEmail } = require('../Models/UserModel')

route.post('/signUp', async (req, res) => {
    const { error } = validateUser(req.body)
    // the 2 ifs below should have status codes for bad data
    if (error) {
        return res.status(400).json({ message: error })
    }
    const emailExists = await existingEmail(req.body.email)
    if (emailExists) {
        return res.status(409).json({ message: 'Email already exists', exists: true })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    if (hashedPassword) {
        const registrationData = { ...req.body, password: hashedPassword }
        const { status, result } = await addUser(registrationData)
        if (status) {
            return res.status(200).json({ message: result })
        }
        else {
            return res.status(500).json({ message: result })
        }
    } else {
        return res.status(500).json({ message: 'Something went wrong registering user data, Hashing error' })
    }
})

route.post('/login', (req, res) => {
    // insert token generation here
    // fetch from db with email and then bcrypt compare with req.body
})

module.exports = route