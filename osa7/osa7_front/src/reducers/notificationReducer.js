const initialState = {
  message: null,
  isError: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SHOW_MESSAGE':
    return { message: action.message, isError: action.isError }
  case 'ERASE_MESSAGE':
    return { ...state, message: null }
  default:
    return state
  }
}

export const notify = (message, isError) => {
  return async (dispatch) => {
    dispatch({
      type: 'SHOW_MESSAGE',
      message, isError
    })
    setTimeout(() => dispatch({
      type: 'ERASE_MESSAGE'
    }), 5000)
  }
}

export default reducer