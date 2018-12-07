import axios from 'axios'

const url = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}

const createNew = async (content) => {
  const response = await axios.post(url, { content, votes: 0 })
  return response.data
}

const vote = async (id) => {
  const getResponse = await axios.get(`${url}/${id}`)
  const oldAnecdote = getResponse.data
  const newData = {...oldAnecdote, votes: oldAnecdote.votes + 1}

  const response = await axios.put(`${url}/${id}`, newData)
  return response.data
}

export default { getAll, createNew, vote }