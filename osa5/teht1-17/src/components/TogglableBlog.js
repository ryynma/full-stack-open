import React from 'react'
import PropTypes from 'prop-types'

class TogglableBlog extends React.Component {
  constructor({ blog, handleLike, handleDelete, currentUsername }) {
    super({ blog, handleLike, handleDelete, currentUsername })
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
          <div className='url'><a href={blog.url}>{blog.url}</a></div>
          <div className='likes'>
            {blog.likes} likes
          <button onClick={this.increaseLikes}>Like</button>
          </div>
          <div className='creator'>added by {creator}</div>
        </div>
      )
    }

    return (
      <div className='blog'>
        <div onClick={this.toggleVisibility} className='clickableTitle'>{clickableLabel}</div>
        <div style={showWhenVisible} className='togglableContent'>
          {blogData()}
          {this.isDeletable() ?
            <button onClick={this.delete}>Delete</button>
            : null }
        </div>
      </div>
    )
  }
}

TogglableBlog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentUsername: PropTypes.string.isRequired
}

export default TogglableBlog