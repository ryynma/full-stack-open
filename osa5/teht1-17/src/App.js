import React from 'react'
import TogglableBlog from './components/TogglableBlog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      username: '',
      password: '',
      user: null,
      message: null,
      isError: false
    }
  }

  mostLikedFirst = (a, b) => {
    return b.likes - a.likes
  }

  componentDidMount() {
    // Jos käyttäjä oli jo kirjautunut, haetaan tiedot
    const user = JSON.parse(window.localStorage.getItem('loggedBlogListUser'))
    if (user) {
      this.setState({ user })
      blogService.setToken(user.token)
    }

    blogService.getAll().then(blogs =>
      this.setState({ blogs: blogs.sort(this.mostLikedFirst) })
    )
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

      // Jos onnistui, talletetaan kirjautumistiedot selaimeeen
      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))

      blogService.setToken(user.token)

      this.setState({
        username: '', password: '', user: user,
        message: `successful login`, isError: false
      })
      setTimeout(() => { this.setState({ message: null }) }, 5000)

    } catch (exception) {
      console.log(exception)

      this.setState({ message: 'wrong username or password', isError: true })
      setTimeout(() => { this.setState({ message: null }) }, 5000)
    }
  }

  logout = async (event) => {
    event.preventDefault()
    console.log('logging out')
    window.localStorage.removeItem('loggedBlogListUser')
    this.setState({ user: null })
  }

  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  createNewBlog = async (newBlog) => {
    try {
      // Yritetään uuden blogiartikkelin tallennusta
      const savedBlog = await blogService.create(newBlog)

      // Jos onnistui, lisätään blogi myös selaimen taulukkoon ja informoidaan käyttäjää
      this.setState({
        blogs: this.state.blogs.concat(savedBlog),
        message: `a new blog '${savedBlog.title}' by ${savedBlog.author} added`,
        isError: false
      })
      setTimeout(() => { this.setState({ message: null }) }, 5000)

      this.blogForm.toggleVisibility()

      return true

    } catch (exception) {
      console.log(exception)

      this.setState({ message: 'failed to save blog', isError: true })
      setTimeout(() => { this.setState({ message: null }) }, 5000)

      return false
    }
  }

  likeBlog = async (key) => {
    let blogObject = this.state.blogs.find(blog => blog._id === key)

    const newBlog = {
      author: blogObject.author,
      title: blogObject.title,
      url: blogObject.url,
      likes: blogObject.likes + 1,
      user: blogObject.user ? blogObject.user._id : undefined
    }

    try {
      // Yritetään blogiartikkelin päivitystä
      const updatedBlog = await blogService.update({
        id: blogObject._id, data: newBlog
      })

      // Jos onnistui, päivitetään myös selaimen taulukko ja informoidaan käyttäjää
      this.setState({
        blogs: this.state.blogs.map(b => b._id === blogObject._id ? updatedBlog : b)
          .sort(this.mostLikedFirst),
        message: `liked '${updatedBlog.title}' by ${updatedBlog.author}`,
        isError: false
      })
      setTimeout(() => { this.setState({ message: null }) }, 5000)

    } catch (exception) {
      console.log(exception)
      this.setState({ message: 'failed to like blog', isError: true })
      setTimeout(() => { this.setState({ message: null }) }, 5000)
    }
  }

  deleteBlog = async (key) => {
    const blogToRemove = this.state.blogs.find(blog => blog._id === key)

    try {
      // Varmistetaan poisto käyttäjältä
      const confirm = window.confirm(`Delete '${blogToRemove.title}' by ${blogToRemove.author}?`)
      if (!confirm) {
        return
      }

      // Yritetään blogiartikkelin poistamista
      await blogService.remove(key)

      // Jos onnistui, päivitetään myös selaimen taulukko ja informoidaan käyttäjää
      this.setState({
        blogs: this.state.blogs.filter(b => b._id !== key),
        message: `deleted blog '${blogToRemove.title}' by
          ${blogToRemove.author ? blogToRemove.author : 'anonymous'}`,
        isError: false
      })
      setTimeout(() => { this.setState({ message: null }) }, 5000)

    } catch (exception) {
      console.log(exception)
      this.setState({ message: 'failed to delete blog', isError: true })
      setTimeout(() => { this.setState({ message: null }) }, 5000)
    }

  }

  render() {
    if (this.state.user === null) {
      return <div>

        <Notification message={this.state.message} isError={this.state.isError} />
        <h1>Log in to application</h1>

        <form onSubmit={this.login}>
          <div>
            username:
            <input
              type="test"
              name="username"
              value={this.state.username}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <div>
            password:
            <input
              type="test"
              name="password"
              value={this.state.password}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <button type="submit">Log in</button>
        </form>
      </div>
    }

    return <div>
      <h2>Blogs</h2>
      <Notification message={this.state.message} isError={this.state.isError} />

      <p>
        {this.state.user.name} logged in
          <button onClick={this.logout}>Log out</button>
      </p>

      <Togglable buttonLabel='Create new' ref={comp => this.blogForm = comp}>
        <BlogForm clickFunction={this.createNewBlog} />
      </Togglable>

      <div>
        {this.state.blogs.map(blog =>
          <TogglableBlog
            key={blog._id}
            blog={blog}
            handleLike={this.likeBlog}
            handleDelete={this.deleteBlog}
            currentUsername={this.state.user.username} />
        )}
      </div>
    </div>
  }
}

export default App;