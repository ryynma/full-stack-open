// actionit muotoileva moduli

const actionFor = {

    voting(id) {
        return {
            type: 'INCREMENT_VOTE',
            id: id
        }
    },

    adding(anecdote) {
        return {
            type: 'NEW_ANECDOTE',
            data: anecdote
        }
    }
}

export default actionFor