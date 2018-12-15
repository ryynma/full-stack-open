const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

/* Sovellus */
app.use(cors())
app.use(bodyParser.json())

app.use(middleware.logger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(middleware.error)

/* Tietokantayhteys */
const mongoUrl = config.mongoUrl
mongoose.connect(mongoUrl, { useNewUrlParser: true })
    .then( () => {
        console.log('connected to database', mongoUrl)
    })
    .catch( error => {
        console.log(error)
    })

/* Palvelin */
const server = http.createServer(app)
const PORT = config.port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
    mongoose.connection.close()
})

module.exports = {
    app,
    server
}