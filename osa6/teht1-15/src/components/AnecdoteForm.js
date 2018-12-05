import React from 'react'
import { anecdoteCreation } from '../reducers/anecdoteReducer'
import { notificationShowing, notificationErasing } from '../reducers/notificationReducer';
import { connect } from 'react-redux'

class AnecdoteForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    this.props.anecdoteCreation(content)
    this.props.notificationShowing(`you created a new anecdote '${content}'`)
    setTimeout(() => this.props.notificationErasing(), 5000)
    e.target.anecdote.value = ''
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
  { anecdoteCreation, notificationShowing, notificationErasing }
)(AnecdoteForm)

export default ConnectedAnecdoteForm
