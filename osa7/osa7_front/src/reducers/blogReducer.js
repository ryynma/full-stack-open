import blogService from '../services/blogs'

const initialState = {
  blogs: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return { blogs: action.blogs }
  case 'CREATE_BLOG':
    return { blogs: [...state.blogs, action.data] }
  case 'UPDATE_BLOG':
    const newBlogs = state.blogs.map(b => b._id === action.data._id ? action.data : b)
    return { blogs: sortBlogs(newBlogs) }
  case 'REMOVE_BLOG':
    return { blogs: state.blogs.filter(b => b._id !== action.key) }
  default:
    return state
  }
}

export const blogInitialization = (blogs) => {
  return { type: 'INIT_BLOGS', blogs }
}

export const createNew = (content) => {
  return async (dispatch) => {
    const savedBlog = await blogService.create(content)
    dispatch({ type: 'CREATE_BLOG', data: savedBlog })
    return savedBlog
  }
}

export const update = (key, content) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update({ id: key, content })
    dispatch({ type: 'UPDATE_BLOG', data: updatedBlog })
  }
}

export const commentOnBlog = (key, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.comment(key, comment)
    dispatch({ type: 'UPDATE_BLOG', data: updatedBlog })
  }
}

export const remove = (key) => {
  return async (dispatch) => {
    await blogService.remove(key)
    dispatch({ type: 'REMOVE_BLOG', key })
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogsNotSorted = await blogService.getAll()
    dispatch(blogInitialization(sortBlogs(blogsNotSorted)))
  }
}

const sortBlogs = (blogs) => {
  return blogs.sort((a, b) => b.likes - a.likes)
}

export default reducer