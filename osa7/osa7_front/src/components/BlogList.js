import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class BlogList extends React.Component {
  render() {
    return <div>
      <h2 className="ui dividing header">Blogs</h2>
      <div className="ui compact inverted yellow segment">
        {this.props.blogs.map(blog =>
          <Link to={`/blogs/${blog._id}`} key={blog._id} className="blog ui segment">
            {blog.title} {blog.author}
          </Link>
        )}
      </div>
    </div >
  }
}

const ConnectedBlogList = connect(
  (state) => ({ blogs: state.blogs.blogs })
)(BlogList)

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired
}

export default ConnectedBlogList