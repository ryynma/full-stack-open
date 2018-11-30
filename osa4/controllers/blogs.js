const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

/**
 * Hakee tietokannasta ja palauttaa kaikki blogiartikkelit json-muodossa.
 */
blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs)
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
        response.json(blog)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong' })
    }
})

/**
 * Tallettaa uuden blogiartikkelin tietokantaan.
 */
blogsRouter.post('/', async (request, response) => {
    try {
        const blog = new Blog({
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes === undefined ? 0 : request.body.likes
        })

        // ilman otsikkoa tai urlia blogia ei talleteta
        if (blog.title === undefined || blog.url === undefined) {
            return response.status(400).json({ error: 'blog should have title and url' })
        }

        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)

    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong' })
    }
})

/**
 * Poistaa tietokannasta tietyn blogiartikkelin.
 */
blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong' })
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