import { combineReducers } from 'redux'
import counter from './counter'
import global from './global'
import user from './user'
export default combineReducers({
  counter,
  global,
  user
})
