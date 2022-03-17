const express = require('express')
const auth = require('../Middleware/auth')
const route = express.Router()
const { User } = require('../Models/UserModel')

// check security risks using token payload to alter database collections 
route.get('/profileDetails', auth, async (req, res) => {
    const user = await User.findById(req.payload.id)
    if (user) {
        return res.status(200).json({ message: user })
    }
    return res.status(404).json({ message: 'User not found' })
})

route.post('/updateProfile', auth, async (req, res) => {
    const user = await User.findByIdAndUpdate(req.payload.id, req.body)
    if (user) {
        return res.status(200).json({ message: 'User data updated successfully' })
    }
    return res.status(500).json({ message: 'Failed to update data' })
})

route.post('/updateProfileImage', auth, (req, res) => {
    // must find a solution
    User.updateOne({ _id: req.payload.id }, { $set: { image: req.body.image } }).
        then(({ acknowledged }) => {
            if (acknowledged) {
                return res.status(200).json({ message: 'Image added successfully', success: true })
            }
            return res.status(500).json({ message: 'Failed to add profile image', success: false })
        }).
        catch(() => {
            return res.status(500).json({ message: 'Failed to add profile image', success: false })
        })
})
module.exports = route