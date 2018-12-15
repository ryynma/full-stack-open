import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const User = ({ user }) => {
  if (user === undefined) {
    return <div></div>
  }

  return <div>
    <h2>{user.name}</h2>
    <h3>Added blogs</h3>
    <ul>
      {user.blogs.map(blog =>
        <li key={blog._id}>{blog.title}</li>
      )}
    </ul>
  </div>
}

const ConnectedUser = connect()(User)

User.propTypes = {
  user: PropTypes.object
}

export default ConnectedUser