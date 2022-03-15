const mongoose = require('mongoose')
const joi = require('joi')

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        minLength: 9,
        maxLength: 9,
        required: true
    }
})

const UserModel = mongoose.model('users', UserSchema)

const addUser = (newUser) =>
    UserModel(newUser).save()
        .then(() => { return { result: 'Registration successfull', status: true } })
        .catch((error) => { return { result: error, status: false } })

const validateUser = (newUser) => {
    const validationSchema = joi.object({
        fullName: joi.string().required().min(2),
        phoneNumber: joi.string().pattern(new RegExp('^[0-9]*$')).length(9).required(),
        email: joi.string().email().required(),
        password: joi.string().required()
    })
    return validationSchema.validate(newUser)
}

exports.User = UserModel
exports.addUser = addUser
exports.validateUser = validateUser