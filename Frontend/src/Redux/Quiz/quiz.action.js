import axios from "axios";
const BASE_URL="http://localhost:4000" 
import { QUIZ_ERROR, QUIZ_LOADING, QUIZ_SUCCESS, SET_QUIZ_LEVEL, SET_QUIZ_OFFSET, SET_CURRENT_SECTION } from "./quiz.type";
export const getQuestion=(section,type,level,offset = 0)=>async(dispatch)=>{
    try {
        dispatch(setQuizLevel(level)); 
        dispatch(setQuizOffset(offset))
        dispatch({type:QUIZ_LOADING})
        const res=await axios.get(`${BASE_URL}/quiz/?section=${section}&type=${type}&level=${level}&limit=75&offset=${offset}`);;
        dispatch({type:QUIZ_SUCCESS,payload:res.data.message})
    } catch (error) {
        dispatch({type:QUIZ_ERROR})
    }
}
export const setCurrentSection = (section) => ({
    type: SET_CURRENT_SECTION,
    payload: section
});
export const setQuizLevel = (level) => ({
    type: SET_QUIZ_LEVEL,
    payload: level
});
export const setQuizOffset = (offset) => ({ 
    type: SET_QUIZ_OFFSET,
    payload: offset
});