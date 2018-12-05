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

export const notificationShowing = (message) => {
  return {
    type: 'SHOW_MESSAGE',
    message
  }
}

export const notificationErasing = () => {
  return {
    type: 'ERASE_MESSAGE'
  }
}

export default reducer