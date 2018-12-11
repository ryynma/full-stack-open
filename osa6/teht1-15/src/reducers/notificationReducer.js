const initialState = {
  message: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SHOW_MESSAGE':
    return { message: action.message }
  case 'ERASE_MESSAGE':
    return { message: '' }
  default:
    return state
  }
}

export const notify = (message, sec) => {
  return async (dispatch) => {
    // näytetään viesti
    dispatch({
      type: 'SHOW_MESSAGE',
      message
    })
    // tyhjennetään viesti
    setTimeout(() => dispatch({
      type: 'ERASE_MESSAGE'
    }), sec * 1000)
  }
}

export default reducer