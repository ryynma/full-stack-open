const dummy = (blogs) => {
    return 1
}

/**
 * Palauttaa kaikkien blogien yhteenlasketun tykkäysmäärän.
 * @param {*} blogs
 */
const totalLikes = (blogs) => {
    const reducer = (sum, next) => {
        return sum + next
    }

    return blogs.map(b => b.likes).reduce(reducer, 0)
}

/**
 * Palauttaa (jonkun) blogin, jolla on eniten tykkäyksiä.
 * @param {*} blogs
 */
const favoriteBlog = (blogs) => {
    const reducer = (fav, next) => {
        return fav.likes > next.likes ? fav : next
    }
    return blogs.length === 0 ? undefined : formatBlog(blogs.reduce(reducer, { likes: 0 }))
}

const formatBlog = (blog) => {
    return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
    }
}

/**
 * Palauttaa kirjoittajan, jolla on eniten blogeja, sekä hänen blogiensa määrän.
 * @param {*} blogs
 */
const mostBlogs = (blogs) => {
    if (blogs.length === 0)
        return undefined

    const authors = new Map()

    blogs.forEach(blog => {
        let oldValue = authors.get(blog.author)
        const newValue = oldValue === undefined ? 1 : oldValue + 1
        authors.set(blog.author, newValue)
    })

    let mostAuthor = undefined
    let mostBlogs = 0
    authors.forEach((value, key, map) => {
        if (mostAuthor === undefined || value > mostBlogs) {
            mostAuthor = key
            mostBlogs = value
        }
    })

    return { author: mostAuthor, blogs: mostBlogs }
}

/**
 * Palauttaa kirjoittajan, jonka blogeilla on eniten tykkäyksiä, sekä tykkäysten määrän.
 * @param {*} blogs
 */
const mostLikes = (blogs) => {
    if (blogs.length === 0)
        return undefined

    const authors = new Map()

    blogs.forEach(blog => {
        let oldLikes = authors.get(blog.author)
        if (oldLikes === undefined)
            oldLikes = 0
        const newLikes = oldLikes + blog.likes
        authors.set(blog.author, newLikes)
    })

    let likedAuthor = undefined
    let likes = 0
    authors.forEach((value, key, map) => {
        if (likedAuthor === undefined || value > likes) {
            likedAuthor = key
            likes = value
        }
    })

    return { author: likedAuthor, likes: likes }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}