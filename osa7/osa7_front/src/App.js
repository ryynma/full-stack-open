import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import UserList from './components/UserList'
import User from './components/User'
import Menu from './components/Menu'
import blogService from './services/blogs'
import loginService from './services/login'
import { notify } from './reducers/notificationReducer'
import { initializeBlogs, createNew, update, remove, commentOnBlog } from './reducers/blogReducer'
import { initializeUsers, updateUser } from './reducers/userReducer'
import { loginUser, logout } from './reducers/loginReducer'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container, Button } from 'semantic-ui-react'

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  componentDidMount() {
    // Jos käyttäjä oli jo kirjautunut, haetaan tiedot
    const user = JSON.parse(window.localStorage.getItem('loggedBlogListUser'))

    if (user !== null) {
      blogService.setToken(user.token)
      this.props.initializeBlogs()
      this.props.initializeUsers()
      this.props.loginUser(user)
    }
  }

  login = async (event) => {
    event.preventDefault()
    console.log(`logging in with ${this.state.username} ${this.state.password}`)

    try {
      // Yritetään sisäänkirjautumista
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      // Jos onnistui, talletetaan kirjautumistiedot selaimeeen ym.
      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))
      this.props.loginUser(user)
      blogService.setToken(user.token)

      this.setState({ username: '', password: '' })
      this.props.notify('successful login', false)

    } catch (exception) {
      console.log(exception)
      this.props.notify('wrong username or password', true)
    }
  }

  logout = async (event) => {
    event.preventDefault()
    console.log('logging out')
    window.localStorage.removeItem('loggedBlogListUser')
    this.props.logout()
    // this.setState({ user: null })
  }

  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  createNewBlog = async (newBlog) => {
    try {
      const savedBlog = await this.props.createNew(newBlog)
      this.props.notify(
        `a new blog '${savedBlog.title}' by ${savedBlog.author} added`,
        false
      )
      // piilotetaan luontilomake
      this.blogForm.toggleVisibility()
      this.props.updateUser(savedBlog.user._id)
      return true

    } catch (exception) {
      console.log(exception)
      this.props.notify('failed to save blog', true)
      return false
    }
  }

  likeBlog = async (key) => {
    let blogObject = this.props.blogs.find(blog => blog._id === key)

    const newContent = {
      author: blogObject.author,
      title: blogObject.title,
      url: blogObject.url,
      likes: blogObject.likes + 1,
      user: blogObject.user ? blogObject.user._id : undefined
    }

    try {
      this.props.update(blogObject._id, newContent)
      this.props.notify(
        `liked '${blogObject.title}' by ${blogObject.author}`,
        false
      )
    } catch (exception) {
      console.log(exception)
      this.props.notify('failed to like blog', true)
    }
  }

  deleteBlog = async (key) => {
    const blogToRemove = this.props.blogs.find(blog => blog._id === key)
    try {
      // Varmistetaan poisto käyttäjältä
      const confirm = window.confirm(`Delete '${blogToRemove.title}' by ${blogToRemove.author}?`)
      if (!confirm) {
        return
      }
      this.props.remove(key)
      this.props.notify(
        `deleted blog '${blogToRemove.title}' by
        ${blogToRemove.author ? blogToRemove.author : 'anonymous'}`,
        false
      )
    } catch (exception) {
      console.log(exception)
      this.props.notify('failed to delete blog', true)
    }
  }

  commentBlog = async (key, comment) => {
    let blog = this.props.blogs.find(blog => blog._id === key)
    if (comment === '') {
      this.props.notify('comment should have some text on it', false)
      return false
    } else {
      try {
        this.props.commentOnBlog(blog._id, comment)
        this.props.notify(
          `comment '${comment}' added to blog '${blog.title}'`,
          false
        )
        return true
      } catch (exception) {
        console.log(exception)
        this.props.notify('failed to comment blog', true)
        return false
      }
    }
  }

  render() {
    const userById = (id) => {
      return this.props.users.find(user => user._id === id)
    }
    const blogById = (id) => {
      return this.props.blogs.find(blog => blog._id === id)
    }

    if (this.props.loggedUser === null) {
      return <Container>
        <div className="loginContent ui segment">

          <Notification />
          <h1>Log in to application</h1>

          <form onSubmit={this.login} className="ui form">
            <div className="field">
              username:
              <input
                type="test"
                name="username"
                value={this.state.username}
                onChange={this.handleLoginFieldChange}
              />
            </div>
            <div className="field">
              password:
              <input
                type="test"
                name="password"
                value={this.state.password}
                onChange={this.handleLoginFieldChange}
              />
            </div>
            <Button type="submit" className="ui primary button">Log in</Button>
          </form>
        </div>
      </Container>
    }

    return <Container>
      <Router>
        <div>
          <div className="ui inverted segment">
            <h1 className="ui orange inverted center aligned header">Blog app</h1>
          </div>
          <Notification />
          <Menu user={this.props.loggedUser} handleLogout={this.logout} />

          <Route exact path="/blogs" render={() =>
            <div className="blogsContent">
              <Togglable buttonLabel='Create new' ref={comp => this.blogForm = comp}>
                <BlogForm clickFunction={this.createNewBlog} />
              </Togglable>

              <BlogList />
            </div>
          } />
          <Route exact path="/blogs/:id" render={({ match }) =>
            <Blog blog={blogById(match.params.id)} handleLike={this.likeBlog} handleComment={this.commentBlog} />
          } />
          <Route exact path="/users" render={() => <UserList />} />
          <Route exact path="/users/:id" render={({ match }) =>
            <User user={userById(match.params.id)} />
          } />
        </div>
      </Router>
    </Container>
  }
}

// <User user={userById(match.params.id)} />}

const ConnectedApp = connect(
  (state) => ({ blogs: state.blogs.blogs, users: state.users, loggedUser: state.loggedUser }),
  {
    notify, initializeBlogs, createNew, update, remove, commentOnBlog,
    initializeUsers, updateUser, loginUser, logout
  }
)(App)

App.propTypes = {
  initializeBlogs: PropTypes.func.isRequired,
  initializeUsers: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  createNew: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  commentOnBlog: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  loggedUser: PropTypes.object
}

export default ConnectedApp