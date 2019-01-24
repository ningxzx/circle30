import { createAction } from 'redux-actions';
import { METHODS, request } from 'utils/request';
export default {
    'getLesson': createAction('GET_LESSON', reqData => request('/lessons', reqData))
}
