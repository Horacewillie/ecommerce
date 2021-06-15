import {
  LOGIN_USER
} from '../actions/types'

// eslint-disable-next-line
export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {...state, loginSuccess: action.payload}
    default:
      return state;
  }
}
