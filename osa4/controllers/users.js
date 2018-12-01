const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find({})
            .populate('blogs', { likes: 1, author: 1, title: 1, url: 1 })

        res.json(users.map(User.format))

    } catch (exception) {
        console.log(exception)
        res.status(500).json({ error: 'something went wrong' })
    }
})

userRouter.post('/', async (req, res) => {
    const body = req.body

    try {
        const existingUser = await User.find({ username: body.username })
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'username must be unique' })
        }
        if (body.password.length < 3) {
            return res.status(400).json({ error: 'password must have at least 3 characters' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
        console.log('passwordHash', passwordHash)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
            adult: body.adult === undefined ? true : body.adult
        })

        const savedUser = await user.save()
        res.status(201).json(User.format(savedUser))

    } catch (exception) {
        console.log(exception)
        res.status(500).json({ error: 'something went wrong' })
    }
})

module.exports = userRouter