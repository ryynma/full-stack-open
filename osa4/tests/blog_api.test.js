const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Eka testiblogi',
        author: 'Bongo Blogaaja',
        url: 'https://www.google.fi'
    },
    {
        title: 'Toka testiblogi',
        author: 'Bongo Blogaaja',
        url: 'https://www.google.fi'
    },
    {
        title: 'Kolmas testiblogi',
        author: 'Bongo Blogaaja',
        url: 'https://www.google.fi'
    }
]

/* Alustetaan testitietokanta */
beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('testing GET /api/blogs', () => {

    test('blogs are returned as json', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(blog => blog.title)
        expect(titles).toContain('Eka testiblogi')
    })
})

describe('testing POST /api/blogs', () => {

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Testin tallettama blogi',
            author: 'Tessu Testaaja',
            url: 'https://www.testi.fi',
            likes: 1
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const titles = response.body.map(blog => blog.title)

        expect(response.body.length).toBe(initialBlogs.length + 1)
        expect(titles).toContain('Testin tallettama blogi')
    })

    test('if "likes" is not set, it will be 0', async () => {
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

    test('blog without title is not added', async () => {
        const newBlog = {
            author: 'Tessu Testaaja',
            url: 'https://www.testi.fi'
        }

        const initialBlogs = await api.get('/api/blogs/')

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(initialBlogs.body.length)
    })

    test('blog without url is not added', async () => {
        const newBlog = {
            title: 'Blogi ilman urlia',
            author: 'Tessu Testaaja'
        }

        const initialBlogs = await api.get('/api/blogs')
        await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(initialBlogs.body.length)
    })
})


afterAll(() => {
    server.close()
})