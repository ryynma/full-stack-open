/* Blogin skeeman määrittelevä moduli */

const mongoose = require('mongoose')
const User = require('./user')

const blogSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: Number,
    author: String,
    title: String,
    url: String
})

blogSchema.statics.format = (blog) => {
    return {
        _id: blog.id,
        user: blog.user,
        likes: blog.likes,
        author: blog.author,
        title: blog.title,
        url: blog.url
    }
}

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog