/* Apufunktioita testitiedoston käyttöön */

const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

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

/**
 * Palauttaa annetun blogiartikkelin muotoiltuna.
 * @param {*} blog
 */
const formatBlog = (blog) => {
    return {
        title: blog.title,
        important: blog.important,
        likes: blog.likes,
        id: blog._id
    }
}

/**
 * Palauttaa muotoiltuna kaikki tietokannassa olevat muistiinpanot.
 */
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(formatBlog)
}

/**
 * Palauttaa sellaisen id:n, joka on poistettu tietokannasta.
 */
const nonExistingId = async () => {
    const blog = new Blog()
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(User.format)
}

const initialUser = async () => {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash('salasala', saltRounds)

    const user = new User({
        username: 'ttestaaj',
        name: 'Tessu Testaaja',
        passwordHash,
        adult: true
    })

    return user
}

module.exports = {
    initialBlogs, formatBlog, nonExistingId, blogsInDb, usersInDb, initialUser
}