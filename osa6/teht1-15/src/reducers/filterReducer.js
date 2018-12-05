const initialState = { filter: '' }

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_FILTER':
    return { filter: action.filter }
  default:
    return state
  }
}

export const filterSetting = (filter) => {
  return {
    type: 'SET_FILTER',
    filter
  }
}

export default reducer