const express = require('express')
const route = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
        return res.status(500).json({ message: result })
    }
    return res.status(500).json({ message: 'Something went wrong registering user data, Hashing error' })
})

route.post('/login', async (req, res) => {
    const user = await existingEmail(req.body.email)
    if (user) {
        const comparePassword = await bcrypt.compare(req.body.password, user.password)
        if (comparePassword) {
            const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY)
            return res.status(200).json({ message: 'Logged in successfully', token })
        }
        return res.status(400).json({ message: 'Incorrect password' })
    }
    return res.status(404).json({ message: 'Email not found' })
})

module.exports = route