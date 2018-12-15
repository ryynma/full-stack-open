const reducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN_USER':
    return action.data
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const loginUser = (user) => {
  return (dispatch) => {
    dispatch({ type: 'LOGIN_USER', data: user })
  }
}

export const logout = () => {
  return (dispatch) => {
    dispatch({ type: 'LOGOUT' })
  }
}

export default reducer