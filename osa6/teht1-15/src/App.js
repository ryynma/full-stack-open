import React from 'react'
import Notification from './components/Notification'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import { connect } from 'react-redux'
import { initializeAnecdotes } from './reducers/anecdoteReducer'

class App extends React.Component {
  componentDidMount = async () => {
    this.props.initializeAnecdotes()
  }

  render() {
    return (
      <div>
        <h1>Programming anecdotes</h1>
        <Notification />
        <AnecdoteList />
        <AnecdoteForm />
      </div>
    )
  }
}

const ConnectedApp = connect(
  null,
  { initializeAnecdotes }
)(App)

export default ConnectedApp