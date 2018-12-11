import React from 'react'
import { createNew } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer';
import { connect } from 'react-redux'

class AnecdoteForm extends React.Component {
  handleSubmit = async (e) => {
    e.preventDefault()

    const inputField = e.target.anecdote
    this.props.createNew(inputField.value)

    this.props.notify(`you created a new anecdote '${inputField.value}'`, 5)

    inputField.value = ''
  }
  render() {
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={this.handleSubmit}>
          <div><input name='anecdote' /></div>
          <button>create</button>
        </form>
      </div>
    )
  }
}

const ConnectedAnecdoteForm = connect(
  null,
  { createNew, notify }
)(AnecdoteForm)

export default ConnectedAnecdoteForm
