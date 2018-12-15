import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const generateId = () => Math.floor(Math.random() * 100000)

class Blog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      comment: ''
    }
  }

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleLike = () => {
    this.props.handleLike(this.props.blog._id)
  }

  handleComment = async () => {
    const succeed = await this.props.handleComment(this.props.blog._id, this.state.comment)
    if (succeed)
      this.setState({ comment: '' })
  }

  render() {
    if (this.props.blog === undefined)
      return <div></div>

    return (
      <div className="blog">
        <h2>{this.props.blog.title}</h2>
        <div><a href={this.props.blog.url}>{this.props.blog.url}</a></div>
        <div>
          {this.props.blog.likes} likes
          <button onClick={this.handleLike}>Like</button>
        </div>
        <div>added by {this.props.blog.user.name}</div>
        <h3>Comments</h3>
        <ul>
          {this.props.blog.comments.map(c =>
            <li key={generateId()}>{c}</li>
          )}
        </ul>
        <div>
          <input
            type="test"
            name="comment"
            value={this.state.comment}
            onChange={this.handleFieldChange}
          />
          <button onClick={this.handleComment}>Add comment</button>
        </div>
      </div>
    )
  }
}

const ConnectedBlog = connect()(Blog)

Blog.propTypes = {
  blog: PropTypes.object,
  handleLike: PropTypes.func.isRequired,
  handleComment: PropTypes.func.isRequired
}

export default ConnectedBlog