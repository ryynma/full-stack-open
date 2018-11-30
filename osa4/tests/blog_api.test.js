const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb, formatBlog, nonExistingId } = require('./test_helper')

/* Alustetaan testitietokanta */
beforeAll(async () => {
    await Blog.deleteMany({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('retrieving blogs', () => {

    test('all blogs are returned as json by GET /api/blogs', async () => {
        const blogsInDataBase = await blogsInDb()

        const response = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(blogsInDataBase.length)

        const returnedTitles = await response.body.map(blog => blog.title)
        blogsInDataBase.forEach(blog => {
            expect(returnedTitles).toContain(blog.title)
        })
    })

    test('individual blogs are returned as json by GET /api/blogs/:id', async () => {
        const blogsInDataBase = await blogsInDb()
        const aBlog = blogsInDataBase[0]

        const response = await api.get(`/api/blogs/${aBlog.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const title = response.body.title

        expect(title).toEqual(aBlog.title)
    })
})


describe('addition of a new blog', () => {

    test('POST /api/blogs succeeds with valid data', async () => {
        const newBlog = {
            title: 'Testin tallettama blogi',
            author: 'Tessu Testaaja',
            url: 'https://www.testi.fi',
            likes: 1
        }

        const blogsBefore = await blogsInDb()

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await blogsInDb()
        expect(blogsAfter.length).toBe(blogsBefore.length + 1)

        const titles = blogsAfter.map(blog => blog.title)
        expect(titles).toContain(newBlog.title)
    })

    test('if blog "likes" is not given, it will be 0', async () => {
        const newBlog = {
            title: 'Blogi ilman likeja',
            author: 'Tessu Testaaja',
            url: 'https://www.testi.fi'
        }

        const response = await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)

        expect(response.body.likes).toBe(0)
    })

    test('POST /api/blogs fails with proper status code if title is missing', async () => {
        const newBlog = {
            author: 'Tessu Testaaja',
            url: 'https://www.testi.fi'
        }

        const blogsBefore = await blogsInDb()

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAfter = await blogsInDb()
        expect(blogsAfter.length).toBe(blogsBefore.length)
    })

    test('POST /api/blogs fails with proper status code if url is missing', async () => {
        const newBlog = {
            title: 'Blogi ilman urlia',
            author: 'Tessu Testaaja'
        }

        const blogsBefore = await blogsInDb()

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAfter = await blogsInDb()
        expect(blogsAfter.length).toBe(blogsBefore.length)
    })
})

describe('deletion of a blog', () => {

    let addedBlog

    beforeAll(async () => {
        addedBlog = new Blog({
            title: 'Poistettava blogi',
            author: 'Tessu Testaaja',
            url: 'http://'
        })
        await addedBlog.save()
    })

    test('DELETE /api/blogs/:id succeeds with proper status code', async () => {
        const blogsBefore = await blogsInDb()

        await api.delete(`/api/blogs/${addedBlog.id}`)
            .expect(204)

        const blogsAfter = await blogsInDb()
        expect(blogsAfter.length).toBe(blogsBefore.length - 1)

        const titles = blogsAfter.map(blog => blog.title)
        expect(titles).not.toContain(addedBlog.title)
    })
})

describe('updating a blog', () => {
    let addedBlog

    beforeAll(async () => {
        addedBlog = new Blog({
            title: 'Päivitettävä blogi',
            author: 'Tessu Testaaja',
            url: 'http://',
            likes: 5
        })
        await addedBlog.save()
    })

    test('PUT /api/blogs/:id succeeds with proper status code', async () => {
        const newLikes = 6
        await api.put(`/api/blogs/${addedBlog.id}`)
            .send({ likes: newLikes })
            .expect(204)

        const response = await api.get(`/api/blogs/${addedBlog.id}`)
        expect(response.body.likes).toBe(newLikes)
    })
})

afterAll(() => {
    server.close()
})