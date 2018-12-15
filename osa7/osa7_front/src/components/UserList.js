import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Table } from 'semantic-ui-react'
import PropTypes from 'prop-types'

class UserList extends React.Component {
  render() {
    return <Container>
      <div>
        <h2>Users</h2>
        <Table className="ui celled table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>blogs added</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.users.map(user =>
              <Table.Row key={user._id}>
                <Table.Cell className={user.name === this.props.loggedUser.name ? 'active' : ''}>
                  <Link to={`/users/${user._id}`}>{user.name}</Link>
                </Table.Cell>
                <Table.Cell>
                  {user.blogs.length}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </Container>
  }
}

const ConnectedUserList = connect(
  (state) => ({ users: state.users, loggedUser: state.loggedUser })
)(UserList)

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  loggedUser: PropTypes.object.isRequired
}

export default ConnectedUserList