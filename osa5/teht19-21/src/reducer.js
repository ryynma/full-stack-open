const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000*Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  console.log('state now: ',state)
  console.log('action:', action)

  switch(action.type) {

    case('INCREMENT_VOTE'):
      const anecdoteToVote = state.find(a => a.id === action.id)
      const updatedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
      return state.map(a => a.id !== action.id ? a : updatedAnecdote).sort(mostVotedFirst)

    case('NEW_ANECDOTE'):
      const newAnecdote = {
        content: action.data,
        id: getId(),
        votes: 0 }
      return [...state, newAnecdote]

    default:
      return state
  }  
}

const mostVotedFirst = (a, b) => {
  return b.votes - a.votes
}

export default reducer