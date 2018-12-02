import React from 'react'

class TogglableBlog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
  }

  increaseLikes = (event) => {
    event.preventDefault()
    this.props.handleLike(this.props.blog._id)
  }

  delete = (event) => {
    event.preventDefault()
    this.props.handleDelete(this.props.blog._id)
  }

  /**
   * Tarkistaa, että blogin luoja ja poistaja ovat sama henkilö tai
   * luoja ei ole tiedossa.
   */
  isDeletable = () => {
    return this.props.blog.user === undefined
      || this.props.blog.user.username === this.props.currentUsername
  }

  render() {
    // Näytetäänkö kaikki tiedot
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }

    const clickableLabel = `${this.props.blog.title} ${this.props.blog.author}`

    const blog = this.props.blog
    const creator = this.props.blog.user ? this.props.blog.user.name : 'anonymous'

    const blogData = () => {
      return (
        <div>
          <div><a href={blog.url}>{blog.url}</a></div>
          <div>
            {blog.likes} likes
          <button onClick={this.increaseLikes}>Like</button>
          </div>
          <div>added by {creator}</div>
        </div>
      )
    }

    return (
      <div className='blog'>
        <div onClick={this.toggleVisibility}>{clickableLabel}</div>
        <div style={showWhenVisible}>
          {blogData()}
          {this.isDeletable() ?
            <button onClick={this.delete}>Delete</button>
            : null }
        </div>
      </div>
    )
  }
}

export default TogglableBlog