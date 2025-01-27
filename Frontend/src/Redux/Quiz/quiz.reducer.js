import {  QUIZ_ERROR, QUIZ_LOADING, QUIZ_RESULT, QUIZ_SUCCESS, SET_QUIZ_LEVEL, SET_QUIZ_OFFSET, SET_CURRENT_SECTION } from "./quiz.type";

const init = {
    loading: false,
    error: false,
    question: {
        physics: [],
        chemistry: [],
        maths: []
    },
    currentSection: 'physics',
    level: 'medium',
    offset: 0,
    result: {},
}

export const quizReducer=(state=init,{type,payload})=>{
switch (type) {
    case QUIZ_LOADING:{
        return {
            ...state,
            loading:true
        }
    }
    case QUIZ_SUCCESS:{
        return {
            ...state,
            loading:false,
            question:payload
        }
    }
    case QUIZ_ERROR:{
        return {
            ...state,
            loading:false,
            error:true
        }
    }
    case QUIZ_RESULT:{
        return {
            ...state,
           result:payload
        }
    }
    case SET_QUIZ_LEVEL:
      return {
        ...state,
        level: payload
      } 
    case SET_QUIZ_OFFSET: { 
        return {
            ...state,
            offset: payload
        }
    }
    case SET_CURRENT_SECTION: {
        return {
            ...state,
            currentSection: payload
        }
    }
    default:return state;
}
}