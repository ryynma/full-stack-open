import React from 'react'
import { vote } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer';
import Filter from './Filter'
import { connect } from 'react-redux'

class AnecdoteList extends React.Component {
  handleVote = (anecdote) => () => {
    this.props.vote(anecdote.id)
    this.props.notify(`you voted '${anecdote.content}'`, 5)
    /*
    this.props.notificationShowing(`you voted  '${anecdote.content}'`)
    setTimeout(() => this.props.notificationErasing(), 5000)
    */
  }

  render() {
    return (
      <div>
        <h2>Anecdotes</h2>
        <Filter />
        {this.props.anecdotesToShow.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={this.handleVote(anecdote)}>
                vote
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const anecdotesToShow = (anecdotes, filter) => {
  if (filter.length === 0)
    return anecdotes.sort((a, b) => b.votes - a.votes)

  return anecdotes
    .filter(a => a.content.includes(filter))
    .sort((a, b) => b.votes - a.votes)
}

const ConnectedAnecdoteList = connect(
  (state) => ({ anecdotesToShow: anecdotesToShow(state.anecdotes, state.filter) }),
  { vote, notify }
)(AnecdoteList)

export default ConnectedAnecdoteList