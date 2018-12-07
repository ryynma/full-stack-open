import React from 'react'
import { voting } from '../reducers/anecdoteReducer'
import { notificationShowing, notificationErasing } from '../reducers/notificationReducer';
import Filter from './Filter'
import { connect } from 'react-redux'
import anecdoteService from '../services/anecdotes'

class AnecdoteList extends React.Component {
  handleVote = (anecdote) => () => {
    // päivitetään ääni palvelimelle
    const response = anecdoteService.vote(anecdote.id)
    console.log("palvelin vastasi:", response)

    // päivitetään sovelluksen tilaa
    this.props.voting(anecdote.id)
    this.props.notificationShowing(`you voted  '${anecdote.content}'`)
    setTimeout(() => this.props.notificationErasing(), 5000)
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
  { voting, notificationShowing, notificationErasing }
)(AnecdoteList)

export default ConnectedAnecdoteList