const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minLength: 6
    },
    phoneNumber: {
        type: String,
        minLength: 9,
        maxLength: 9
    }
})

const UserModel = mongoose.model('users', UserSchema)

const addUser = async (newUser) => {
    await UserModel(newUser).save().then((results)=>results).catch(()=>null)
}

exports.User = UserModel
exports.addUser = addUser