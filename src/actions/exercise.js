import api from '../utils/request'

export const getExercise = (exercise_id => api.get(`/exercises/${exercise_id}`))
