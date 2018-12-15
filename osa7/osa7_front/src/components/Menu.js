import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Menu } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const myMenu = ({ user, handleLogout }) => (
  <Menu className="ui four item menu">
    <Link to="/blogs" name="menu_blogs">Blogs</Link>
    <Link to="/users">Users</Link>
    {user ? <em>{user.name} logged in</em>
      : <Link to="/login">login</Link>
    }
    <Button className="mini ui teal right floated basic button" onClick={handleLogout}>Log out</Button>
  </Menu>
)

myMenu.propTypes = {
  user: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired
}

export default myMenu