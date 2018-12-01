const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/**
 * Hakee tietokannasta ja palauttaa kaikki blogiartikkelit json-muodossa.
 */
blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({})
            .populate('user', { username: 1, name: 1 })

        response.json(blogs.map(Blog.format))

    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong' })
    }
})

/**
 * Hakee tietokannasta ja palauttaa tietyn blogiartikkelin json-muodossa.
 */
blogsRouter.get('/:id', async (request, response) => {
    try {
        const blog = await Blog.findById(request.params.id)
            .populate('user', { username: 1, name: 1 })

        response.json(Blog.format(blog))

    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong' })
    }
})

/**
 * Tallettaa uuden blogiartikkelin tietokantaan.
 */
blogsRouter.post('/', async (request, response) => {
    const body = request.body

    // ilman otsikkoa tai urlia ei tehdä mitään
    if (body.title === undefined || body.url === undefined) {
        return response.status(400).json({ error: 'blog should have title and url' })
    }

    try {
        // tarkistetaan tokenin oikeellisuus
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        // haetaan käyttäjä tokenin avulla
        const user = await User.findById(decodedToken.id)

        if (!request.token || !decodedToken.id || !user) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const blog = new Blog({
            user: user.id,
            likes: body.likes === undefined ? 0 : request.body.likes,
            author: body.author,
            title: body.title,
            url: body.url
        })

        const savedBlog = await blog.save()

        // talletetaan blogi myös käyttäjän tietoihin
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)

    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).json({ error: 'something went wrong' })
        }
    }
})

/**
 * Poistaa tietokannasta tietyn blogiartikkelin.
 */
blogsRouter.delete('/:id', async (request, response) => {
    try {
        // tarkistetaan tokenin oikeellisuus
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const removerId = decodedToken.id

        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        // tarkistetaan että poistaja on sama kuin blogin lisääjä
        const blogToRemove = await Blog.findById(request.params.id)

        const userId = blogToRemove.user
        if (removerId.toString() !== userId.toString()) {
            return response.status(401).json({ error: 'not authorized to delete this blog' })
        }

        // poistetaan blogi myös käyttäjän tiedoista
        const user = await User.findById(userId)
        user.blogs = user.blogs.filter(blog => {
            return blog.toString() !== request.params.id
        })
        await user.save()

        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()

    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).json({ error: 'something went wrong' })
        }
    }
})

/**
 * Päivittää tietokannassa olevaa blogia. Jos annetulla id:llä ei löydy blogia, luo uuden.
 */
blogsRouter.put('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndUpdate(request.params.id, request.body)
        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong' })
    }
})

module.exports = blogsRouter