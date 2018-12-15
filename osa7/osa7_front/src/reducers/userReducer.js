import userService from '../services/users'

const initialState = []

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'INIT_USERS':
    return action.data
  case 'UPDATE_USER':
    return state.map(u => u._id === action.data._id ? action.data : u)
  default:
    return state
  }
}

export const userInitialization = (users) => {
  return { type: 'INIT_USERS', data: users }
}

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(userInitialization(users))
  }
}

export const updateUser = (key) => {
  return async (dispatch) => {
    const updatedUser = await userService.getOne(key)
    dispatch({ type: 'UPDATE_USER', data: updatedUser })
  }
}

export default reducer