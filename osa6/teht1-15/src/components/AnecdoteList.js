import React from 'react'
import { voting } from '../reducers/anecdoteReducer'
import { notificationShowing, notificationErasing } from '../reducers/notificationReducer';
import Filter from './Filter'

class AnecdoteList extends React.Component {
  handleVote = (anecdote) => () => {
    this.props.store.dispatch(voting(anecdote.id))
    this.props.store.dispatch(notificationShowing(`you voted  '${anecdote.content}'`))
    setTimeout(() =>
      this.props.store.dispatch(notificationErasing()
      ), 5000)
  }

  render() {
    const anecdotesToShow = () => {
      const anecdotes = this.props.store.getState().anecdotes
      const filter = this.props.store.getState().filter.filter
      if (filter.length === 0) {
        return anecdotes
      }
      return anecdotes.filter(a => a.content.includes(filter))
    }

    return (
      <div>
        <h2>Anecdotes</h2>
        <Filter store={this.props.store} />
        {anecdotesToShow()
          .sort((a, b) => b.votes - a.votes)
          .map(anecdote =>
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

export default AnecdoteList
