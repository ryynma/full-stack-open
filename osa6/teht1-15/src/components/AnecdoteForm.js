import React from 'react'
import { anecdoteCreation } from '../reducers/anecdoteReducer'
import { notificationShowing, notificationErasing } from '../reducers/notificationReducer';
import { connect } from 'react-redux'
import anecdoteService from '../services/anecdotes'

class AnecdoteForm extends React.Component {
  handleSubmit = async (e) => {
    e.preventDefault()
    const inputField = e.target.anecdote

    // talletetaan palvelimelle
    const savedAnecdote = await anecdoteService.createNew(inputField.value)

    // päivitetään sovelluksen tilaa
    this.props.anecdoteCreation(savedAnecdote)
    this.props.notificationShowing(`you created a new anecdote '${inputField.value}'`)
    setTimeout(() => this.props.notificationErasing(), 5000)

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
  { anecdoteCreation, notificationShowing, notificationErasing }
)(AnecdoteForm)

export default ConnectedAnecdoteForm
