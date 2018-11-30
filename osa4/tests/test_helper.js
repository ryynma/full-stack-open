/* Apufunktioita testitiedoston käyttöön */

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

module.exports = {
    initialBlogs, formatBlog, nonExistingId, blogsInDb
}