const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb, nonExistingId, usersInDb, initialUser } = require('./test_helper')

describe('testing blogs', () => {

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

        let validToken

        beforeAll(async () => {
            // luodaan käyttäjä ja haetaan token
            const user = await initialUser()
            await user.save()
            const response = await api.post('/api/login')
                .send({ username: 'ttestaaj', password: 'salasala' })
            validToken = response.body.token
        })

        test('POST /api/blogs succeeds with valid data and token', async () => {
            const newBlog = {
                title: 'Testin tallettama blogi',
                author: 'Tessu Testaaja',
                url: 'https://www.testi.fi',
                likes: 1
            }

            const blogsBefore = await blogsInDb()

            await api.post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: 'bearer ' + validToken })
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAfter = await blogsInDb()
            expect(blogsAfter.length).toBe(blogsBefore.length + 1)

            const titles = blogsAfter.map(blog => blog.title)
            expect(titles).toContain(newBlog.title)
        })

        test('POST /api/blogs fails with missing token', async () => {
            const newBlog = {
                title: 'Testin tallettama blogi',
                author: 'Tessu Testaaja',
                url: 'https://www.testi.fi',
                likes: 1
            }

            const blogsBefore = await blogsInDb()

            const result = await api.post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)

            const blogsAfter = await blogsInDb()
            expect(blogsAfter.length).toBe(blogsBefore.length)
        })

        test('POST /api/blogs fails with invalid token', async () => {
            const newBlog = {
                title: 'Testin tallettama blogi',
                author: 'Tessu Testaaja',
                url: 'https://www.testi.fi',
                likes: 1
            }

            const blogsBefore = await blogsInDb()
            const invalidToken = validToken + 1

            const result = await api.post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: 'bearer ' + invalidToken })
                .expect(401)
                .expect('Content-Type', /application\/json/)

            const blogsAfter = await blogsInDb()
            expect(blogsAfter.length).toBe(blogsBefore.length)
        })

        test('if blog "likes" is not given, it will be 0', async () => {
            const newBlog = {
                title: 'Blogi ilman likeja',
                author: 'Tessu Testaaja',
                url: 'https://www.testi.fi'
            }

            const response = await api.post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: 'bearer ' + validToken })
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
                .set({ Authorization: validToken })
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
                .set({ Authorization: validToken })
                .expect(400)

            const blogsAfter = await blogsInDb()
            expect(blogsAfter.length).toBe(blogsBefore.length)
        })
    })

    describe('deletion of a blog', () => {

        let addedBlog
        let validToken

        beforeAll(async () => {
            // luodaan käyttäjä ja haetaan token
            const user = await initialUser()
            await user.save()
            const response = await api.post('/api/login')
                .send({ username: 'ttestaaj', password: 'salasala' })
            validToken = response.body.token
        })

        beforeEach(async () => {
            // luodaan poistettava blogi
            addedBlog = new Blog({
                title: 'Poistettava blogi',
                author: 'Tessu Testaaja',
                url: 'http://'
            })

            const result = await api.post('/api/blogs')
                .send(addedBlog)
                .set({ Authorization: 'bearer ' + validToken })

            addedBlog = result.body
        })

        test('DELETE /api/blogs/:id succeeds with proper status code whan user is authorized', async () => {
            const blogsBefore = await blogsInDb()

            await api.delete(`/api/blogs/${addedBlog._id}`)
                .set({ Authorization: 'bearer ' + validToken })
                .expect(204)

            const blogsAfter = await blogsInDb()
            expect(blogsAfter.length).toBe(blogsBefore.length - 1)

            const titles = blogsAfter.map(blog => blog.title)
            expect(titles).not.toContain(addedBlog.title)

            const user = await User.findById(addedBlog.user)
            expect(user.blogs).not.toContain(addedBlog._id)
        })

        test('DELETE /api/blogs/:id fails with invalid token', async () => {
            const blogsBefore = await blogsInDb()

            await api.delete(`/api/blogs/${addedBlog._id}`)
                .set({ Authorization: 'bearer ' + validToken + 1 })
                .expect(401)

            const blogsAfter = await blogsInDb()
            expect(blogsAfter.length).toBe(blogsBefore.length)

            const titles = blogsAfter.map(blog => blog.title)
            expect(titles).toContain(addedBlog.title)
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
})

describe('testing users', () => {
    beforeAll(async () => {
        await User.deleteMany({})
        const user = await initialUser()
        await user.save()
    })

    describe('addition of a user', () => {
        test('POST /api/user succeeds with valid data and token', async () => {
            const newUser = {
                username: 'mryynane',
                name: 'Maarit Ryynänen',
                password: 'tosiSalainen',
                adult: true
            }

            const usersBefore = await usersInDb()

            await api.post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAfter = await usersInDb()
            expect(usersAfter.length).toBe(usersBefore.length + 1)

            const usernames = usersAfter.map(user => user.username)
            expect(usernames).toContain(newUser.username)
        })

        test('POST /api/user fails with proper status code if password is less than 3 characters long', async () => {
            const newUser = {
                username: 'ppikkuss',
                name: 'Lyhyt Salasana',
                password: 'os',
                adult: false
            }

            const usersBefore = await usersInDb()

            const result = await api.post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body).toEqual({ error: 'password must have at least 3 characters' })

            const usersAfter = await usersInDb()
            expect(usersAfter.length).toBe(usersBefore.length)
        })

        test('POST /api/user fails with proper status code if username is already taken', async () => {
            const users = await usersInDb()
            const existingUser = users[0]

            const newUser = {
                username: existingUser.username,
                name: 'Any name',
                password: 'mitäVaan',
                adult: false
            }

            const usersBefore = await usersInDb()

            const result = await api.post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body).toEqual({ error: 'username must be unique' })

            const usersAfter = await usersInDb()
            expect(usersAfter.length).toBe(usersBefore.length)
        })

        test('if user adulthood is not given, it will be true', async () => {
            const newUser = {
                username: 'vanhanen',
                name: 'Yli Ikäinen',
                password: 'joopajoo'
            }

            const savedUser = await api.post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            expect(savedUser.adult).toBeTruthy
        })
    })

    describe('retrieving users', () => {
        test('all users are returned as json by GET /api/users', async () => {
            const usersInDataBase = await usersInDb()

            const response = await api.get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(response.body.length).toBe(usersInDataBase.length)

            const returnedNames = await response.body.map(user => user.name)
            usersInDataBase.forEach(user => {
                expect(returnedNames).toContain(user.name)
            })
        })
    })

    describe('login', () => {

        test('POST /api/login succeeds with valid username and password', async () => {
            // initialUser()in tunnukset
            const username = 'ttestaaj'
            const password = 'salasala'

            await api.post('/api/login')
                .send({ username, password })
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('fails with invalid username or password', async () => {
            const username = 'ttestaaj'
            const password = 'vääräSalasana'

            const result = await api.post('/api/login')
                .send({ username, password })
                .expect(401)
                .expect('Content-Type', /application\/json/)

            expect(result.body).toEqual({ error: 'invalid username or password' })
        })
    })

})

afterAll(() => {
    server.close()
})