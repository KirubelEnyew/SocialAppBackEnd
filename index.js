const app = require('./app')
const http = require('http')
const mongoose = require('mongoose')

const port = process.env.PORT || 5000

// connection goes here

const server = http.createServer(app)
const dbUri = 'mongodb+srv://LeulHBT:1234test@cluster0.5kpjp.mongodb.net/SampleAppDB?retryWrites=true&w=majority'

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>
        server.listen(port, () => {
            console.log(`server runinig on port ${port}`)
        }))
    .catch((error) => { console.log(error) })